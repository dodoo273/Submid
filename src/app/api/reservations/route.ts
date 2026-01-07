import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      whatsappNumber, 
      reservationDate, 
      arrivalTime, 
      numberOfGuests, 
      areaChoice, 
      additionalNotes 
    } = body;

    // Basic validation
    if (!fullName || !whatsappNumber || !reservationDate || !arrivalTime || !numberOfGuests || !areaChoice) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (kecuali catatan tambahan)" },
        { status: 400 }
      );
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        fullName: sanitize(fullName),
        whatsappNumber: sanitize(whatsappNumber),
        reservationDate: new Date(reservationDate),
        arrivalTime: sanitize(arrivalTime),
        numberOfGuests: parseInt(numberOfGuests.toString()),
        areaChoice: sanitize(areaChoice),
        additionalNotes: additionalNotes ? sanitize(additionalNotes) : null,
        status: "pending",
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Gagal membuat reservasi. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
