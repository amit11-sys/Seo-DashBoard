import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "swayam");

const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/term-and-conditions",
  "/privacy-policy",
  "/reset-password",
  "/dashboard/detail",
];
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    console.error("❌ Invalid or expired token:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  const decoded: any = await verifyJWT(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("accessToken");
    return response;
  }
  const userRole = decoded?.role;
  if (pathname.startsWith("/admin-dashboard") && userRole !== 2) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
