import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("kotoze_access_token")?.value;
  const { pathname } = request.nextUrl;

  console.log("================================");
  console.log("PATH:", pathname);
  console.log("COOKIE HEADER:", request.headers.get("cookie"));
  console.log("ALL COOKIES:");
console.log(request.cookies.getAll());

console.log("TOKEN:");
console.log(request.cookies.get("kotoze_access_token"));

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("❌ NO TOKEN");

      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await verifyAccessToken(token);

      console.log("✅ VERIFIED:", payload);

      return NextResponse.next();
    } catch (error) {
      console.error("❌ VERIFY ERROR:");
      console.error(error);

      // Temporary debugging
      throw error;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};