import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subId = searchParams.get("sub_id");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {
      isAvailable: true,
      deletedAt: null,
    };

    if (subId) {
      const subIdNum = parseInt(subId);
      if (!isNaN(subIdNum)) where.subCategoryId = subIdNum;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        subCategory: {
          include: {
            mainCategory: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    const safe = menuItems.map((m) => serializePrisma(m));
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      subCategoryId,
      imageUrl,
      isFeatured,
      displayOrder,
    } = body;

    if (
      !name ||
      typeof price === "undefined" ||
      price === null ||
      price === "" ||
      !subCategoryId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(price as any);
    if (isNaN(priceNum)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const subCatNum = parseInt(subCategoryId as any);
    if (isNaN(subCatNum)) {
      return NextResponse.json(
        { error: "Invalid subCategoryId" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: priceNum,
        subCategoryId: subCatNum,
        imageUrl,
        isFeatured: Boolean(isFeatured),
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
