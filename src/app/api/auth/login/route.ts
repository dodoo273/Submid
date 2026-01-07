import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  // Login endpoint removed — return Gone
  return NextResponse.json({ error: "Login removed" }, { status: 410 });
}
