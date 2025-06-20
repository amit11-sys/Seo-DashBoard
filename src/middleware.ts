import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath =
        path === '/sign-up' ||
        path === '/sign-in'
    const token = request.cookies.has('accessToken')

    if (token) {
        if (isPublicPath) {
            return NextResponse.redirect(
                new URL('/', request.nextUrl)
            );
        }
    } else {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
        }
    }

}

export const config = {
    matcher: [
        '/sign-up',
        '/sign-in',
        '/'
    ],
};