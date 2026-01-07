import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Admin auth removed — allow access to all admin routes
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
