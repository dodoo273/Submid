import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" &&
      (folderRaw === "menu" || folderRaw === "promos")
        ? folderRaw
        : "menu";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await (file as File).arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Basic validation: max 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Sanitize filename
    const filename = (file as File).name.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Add timestamp to prevent duplicates
    const finalFilename = `${Date.now()}-${filename}`;

    // Upload to Supabase Storage
    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const filePath = `${folder}/${finalFilename}`;

    // Initialize server-side supabase client lazily (gives clearer error if misconfigured)
    let supabaseAdmin;
    try {
      const mod = await import("@/lib/supabaseAdmin");
      supabaseAdmin = mod.getSupabaseAdmin();
    } catch (e: any) {
      console.error("Supabase configuration error:", e?.message || e);

      // Development fallback: write to local `public/uploads` so developers can test without Supabase keys
      if (process.env.NODE_ENV !== "production") {
        try {
          const uploadDir = path.join(process.cwd(), "public/uploads", folder);
          await mkdir(uploadDir, { recursive: true });
          const localPath = path.join(uploadDir, finalFilename);
          await writeFile(localPath, buffer);
          const publicUrl = `/uploads/${folder}/${finalFilename}`;
          console.warn("Falling back to local public/uploads for development: ", localPath);
          return NextResponse.json({ filename: finalFilename, url: publicUrl });
        } catch (fsErr) {
          console.error("Local fallback write failed:", fsErr);
          return NextResponse.json(
            { error: "Server misconfiguration and local fallback failed" },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { error: "Server misconfiguration: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: (file as File).type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicResp = await supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicResp?.data?.publicUrl || `/uploads/${folder}/${finalFilename}`;

    return NextResponse.json({ filename: finalFilename, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
