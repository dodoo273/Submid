import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        deletedAt: null,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        subCategory: true,
      },
      take: 10,
      orderBy: { name: "asc" },
    });

    const safe = menuItems.map((m) => serializePrisma(m));
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
