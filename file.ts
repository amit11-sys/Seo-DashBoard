import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // console.log(path);

    const isPublicPath =
        path === '/login' ||
        path === '/' ||
        path === '/register' ||
        path === '/register/users';
    const token = request.cookies.get('token')?.value || '';
    let role = request.cookies.get('role')?.value || 2;

    const rolePermissions: { [key: string]: string[] } = {
        '1': [
            '/jobs-approve',
            '/skills-approve',
            '/education-approve',
            '/support',
            '/jobs/job-detail',
            '/profile-visibilty',
            '/',
        ], //for super user
        '2': [
            '/candidate-home',
            '/jobs/job-detail',
            '/',
            '/profile',
            '/profile/history',
            '/credits',
            '/profile/add-update',
            '/login',
            '/support',
            '/register',
            '/my-referral',
            '/payment',
            '/candidate',
        ], //for candidate
        '3': [
            '/employer-home',
            '/jobs-posting',
            '/jobs-posting/add-update',
            '/',
            '/job-applications',
            '/register',
            '/employer-credits',
            '/login',
            '/payment',
            '/company-profile',
            '/support',
            '/jobs/job-detail',
            '/my-referral',
        ], // for recruiter
    };
    // console.log(token);

    if (token) {
        // console.log(isPublicPath, path);
        // if (isPublicPath) {
        //     // console.log(isPublicPath);
        //     // console.log(role, "2");
        //     if (role === '2') {
        //         //  console.log(role);
        //         return NextResponse.redirect(
        //             new URL('/candidate-home', request.nextUrl)
        //         );
        //     } else if (role === '3') {
        //         // console.log(role);
        //         return NextResponse.redirect(
        //             new URL('/employer-home', request.nextUrl)
        //         );
        //     } else {
        //         return NextResponse.redirect(
        //             new URL('/jobs-approve', request.nextUrl)
        //         );
        //     }
        // }
        if (!rolePermissions[role]?.includes(path)) {
            return new Response('You dont have access to this page', {
                status: 401,
            });
        }
    } else {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }
    // return NextResponse.next();
}

export const config = {
    matcher: [
        '/register',
        '/candidate-home',
        '/emloyer-credits',
        '/my-referral',
        '/credits',
        '/payment',
        '/employer-home',
        '/skills-approve',
        '/education-approve',
        '/support',
        '/login',
        '/company-profile',
        '/register/users',
        '/job-applications',
        '/jobs',
        '/jobs-approve',
        '/jobs-posting',
        '/jobs-posting/add-update',
        '/profile',
        '/user',
        '/user/add-update',
        '/profile/history',
        // '/jobs/:path*',
        '/candidate',
        '/',
    ],
};
