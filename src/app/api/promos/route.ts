import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");

    let promos;

    if (all === "true") {
      // Get all promos (for admin)
      promos = await prisma.promo.findMany({
        orderBy: { startAt: "desc" },
      });
    } else {
      // Get active promos only
      const now = new Date();
      promos = await prisma.promo.findMany({
        where: {
          startAt: { lte: now },
          endAt: { gte: now },
        },
        orderBy: { startAt: "desc" },
      });
    }

    const safe = promos.map((p) => serializePrisma(p));
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Error fetching promos:", error);
    return NextResponse.json(
      { error: "Failed to fetch promos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, startAt, endAt } = body;

    if (!title || !startAt || !endAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const promo = await prisma.promo.create({
      data: {
        title,
        description,
        imageUrl,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error("Error creating promo:", error);
    return NextResponse.json(
      { error: "Failed to create promo" },
      { status: 500 }
    );
  }
}
