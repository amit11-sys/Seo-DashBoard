import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isPublicPath =
    pathname === "/sign-in" ||
    pathname === "/sign-up";

  // if logged in and trying to go to login/signup
  if (isPublicPath && token) {
  
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
    if(pathname === "/"  && token) {
     
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

  if (!token) {
    if (pathname.startsWith("/dashboard/detail")) {
      return NextResponse.next();
    }
   if (
  pathname.startsWith("/term-and-conditions") ||
  pathname.startsWith("/privacy-policy")
) {
  return NextResponse.next();
}
    // block all other private routes → sign-in
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"], // exclude api, static, etc
};