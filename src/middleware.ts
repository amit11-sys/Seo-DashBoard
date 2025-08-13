// import { NextResponse, NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;
//   const isPublicPath =
//     pathname === "/sign-in" || pathname === "/sign-up"
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/', '/sign-up', '/sign-in', '/dashboard'],
// };



import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isPublicPath =
    pathname === "/sign-in" || pathname === "/sign-up";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};

