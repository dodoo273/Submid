import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: idNum },
      include: {
        subCategory: {
          include: {
            mainCategory: true,
          },
        },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializePrisma(menuItem));
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      subCategoryId,
      imageUrl,
      isFeatured,
      isAvailable,
      displayOrder,
    } = body;

    const menuItem = await prisma.menuItem.update({
      where: { id: idNum },
      data: {
        name,
        description,
        price:
          typeof price !== "undefined" && price !== null && price !== ""
            ? parseFloat(price as any)
            : undefined,
        subCategoryId: subCategoryId
          ? parseInt(subCategoryId as any)
          : undefined,
        imageUrl,
        isFeatured,
        isAvailable,
        displayOrder,
      },
    });

    return NextResponse.json(serializePrisma(menuItem));
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Soft delete
    const deleted = await prisma.menuItem.update({
      where: { id: idNum },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(serializePrisma(deleted));
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
