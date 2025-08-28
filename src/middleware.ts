

// import { NextResponse, NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//   const isPublicPath =
//     pathname === "/sign-in" || pathname === "/sign-up";

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
  
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
//   ],
// };






import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const searchParams = request.nextUrl.searchParams;

  const token = request.cookies.get("accessToken")?.value;
  const shareToken = searchParams.get("share_token");

  const isPublicPath = pathname === "/sign-in" || pathname === "/sign-up";

  // If user already logged in, block access to sign-in/sign-up
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If protected route and no token
  if (!isPublicPath && !token) {
    // If share link is present, allow for now
    if (shareToken) {
      return NextResponse.next();
    }

    // Otherwise, redirect to login
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// ✅ Edge runtime safe (no mongoose here)
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"], // exclude api, static, etc
};
