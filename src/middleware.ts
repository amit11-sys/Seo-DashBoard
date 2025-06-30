// import { NextResponse, NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const path = request.nextUrl.pathname;

//     const isPublicPath =
//         path === '/sign-up' ||
//         path === '/sign-in'
//     const token = request.cookies.has('accessToken')
//     console.log("tkone",token)
//     if (token) {
//         if (isPublicPath) {
//             return NextResponse.redirect(
//                 new URL('/dashboard', request.nextUrl)
//             );
//         }
//     } else {
//         if (!isPublicPath) {
//             return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
//         }
//     }

    // if (token) {
    //      return NextResponse.redirect(
    //             new URL('/dashboard', request.nextUrl)
    //          );

    // } else {
    //     return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
    // }

// }

// export const config = {
//     matcher: [
//         '/sign-up',
//         '/sign-in',
//         '/dashboard'
//     ],
// };



import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isPublicPath = pathname === '/sign-in' || pathname === '/sign-up';
  const isRootPath = pathname === '/';

  // Redirect root to sign-in
  if (isRootPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If logged in & trying to access login/signup -> redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If NOT logged in & trying to access private routes -> redirect to sign-in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/sign-up', '/sign-in', '/dashboard'],
};
