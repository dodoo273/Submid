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

    const promo = await prisma.promo.findUnique({
      where: { id: idNum },
    });

    if (!promo) {
      return NextResponse.json(
        { error: "Promo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializePrisma(promo));
  } catch (error) {
    console.error("Error fetching promo:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo" },
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
    const { title, description, imageUrl, startAt, endAt } = body;

    const promo = await prisma.promo.update({
      where: { id: idNum },
      data: {
        title,
        description,
        imageUrl,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
      },
    });

    return NextResponse.json(serializePrisma(promo));
  } catch (error) {
    console.error("Error updating promo:", error);
    return NextResponse.json(
      { error: "Failed to update promo" },
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

    const promo = await prisma.promo.delete({
      where: { id: idNum },
    });

    return NextResponse.json(serializePrisma(promo));
  } catch (error) {
    console.error("Error deleting promo:", error);
    return NextResponse.json(
      { error: "Failed to delete promo" },
      { status: 500 }
    );
  }
}
