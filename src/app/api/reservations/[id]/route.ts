import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
  id: string;
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;

    await prisma.reservation.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Reservation deleted" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
