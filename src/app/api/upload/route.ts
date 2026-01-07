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

    const uploadDir = path.join(process.cwd(), "public/uploads", folder);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, finalFilename);

    await writeFile(filepath, buffer);

    // Return URL relative to public
    const url = finalFilename; // Just the filename as stored in DB in old app?
    // Wait, old app stored just URL? Or filename?
    // includes/utility_functions.php: uploadImage returns just filename string, or full path?
    // "return $fileName;"
    // And getImageUrl in utility uses: UPLOAD_MENU_URL . $image
    // So DB stores just the filename usually.
    // My getImageUrl in utils.ts: const folder = type === 'promo' ? 'promos' : 'menu'; return `/uploads/${folder}/${imageUrl}`
    // So I should return just the filename.

    return NextResponse.json({
      filename: finalFilename,
      url: `/uploads/${folder}/${finalFilename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
