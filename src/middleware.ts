// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//    const isPublicPath =
//     pathname === "/sign-in" ||
//     pathname === "/sign-up" ||
//     pathname === "/forgot-password" ||
//     pathname === "/term-and-conditions" ||
//     pathname === "/privacy-policy" ||
//     pathname.startsWith("/reset-password") ||
//     pathname.startsWith("/dashboard/detail");
 
//   // if logged in and trying to go to login/signup
//   if (isPublicPath && token) {
  
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//     if(pathname === "/"  && token) {
     
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }

//   if (!token) {
//     if (pathname.startsWith("/dashboard/detail")) {
//       return NextResponse.next();
//     }
//    if (
//   pathname.startsWith("/term-and-conditions") ||
//   pathname.startsWith("/privacy-policy") ||
//    pathname.startsWith("/reset-password")
// ) {
//   return NextResponse.next();
// }
//     // block all other private routes → sign-in
//     if (!isPublicPath) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|.*\\..*|api).*)"], 
// };






// import { NextRequest, NextResponse } from "next/server";
 
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;
 
//   const isPublicPath =
//     pathname === "/sign-in" ||
//     pathname === "/sign-up" ||
//     pathname === "/forgot-password" ||
//     pathname === "/term-and-conditions" ||
//     pathname === "/privacy-policy" ||
//     pathname.startsWith("/reset-password") ||
//     pathname.startsWith("/dashboard/detail");
 
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//   if (!token) {
//     if (!isPublicPath) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }
 
//   return NextResponse.next();
// }
 
// export const config = {
//   matcher: ["/((?!_next|.*\\..*|api).*)"], // exclude api, static, etc
// };




// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken"; // Make sure to install this: `npm i jsonwebtoken`

// const SECRET = process.env.ACCESS_TOKEN_SECRET || "swayam"; // same secret used in token creation

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//   const isPublicPath =
//     pathname === "/sign-in" ||
//     pathname === "/sign-up" ||
//     pathname === "/forgot-password" ||
//     pathname === "/term-and-conditions" ||
//     pathname === "/privacy-policy" ||
//     pathname.startsWith("/reset-password") ||
//     pathname.startsWith("/dashboard/detail");

//   // ✅ Redirect logged-in users away from auth pages
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (pathname === "/" && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // 🔐 If no token, block private routes
//   if (!token) {
//     if (
//       pathname.startsWith("/dashboard/detail") ||
//       pathname.startsWith("/term-and-conditions") ||
//       pathname.startsWith("/privacy-policy") ||
//       pathname.startsWith("/reset-password")
//     ) {
//       return NextResponse.next();
//     }
//     if (!isPublicPath) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   } else {
//     try {
//       // ✅ Decode JWT token to extract role
//       const decoded: any = jwt.verify(token, SECRET);
//       const userRole = decoded?.role;

//       // 🛑 Restrict /admin-dashboard to only role 2 (admin)
//       if (pathname.startsWith("/admin-dashboard") && userRole !== 2) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }
//     } catch (err) {
//       console.error("Invalid token:", err);
//       // if invalid token → force logout
//       const response = NextResponse.redirect(new URL("/sign-in", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|.*\\..*|api).*)"],
// };



import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "swayam");

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

  const isPublicPath =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/term-and-conditions") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/dashboard/detail");

  if (isPublicPath && token) {
    
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token) {
    if (
      pathname.startsWith("/dashboard/detail") ||
      pathname.startsWith("/term-and-conditions") ||
      pathname.startsWith("/privacy-policy") ||
      pathname.startsWith("/reset-password")
    ) {
      return NextResponse.next();
    }

    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};




// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "swayam");

// async function verifyJWT(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     return payload;
//   } catch (error) {
//     console.error("❌ Invalid or expired token:", error);
//     return null;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//   // const isPublicPath =
//   //   pathname === "/sign-in" ||
//   //   pathname === "/sign-up" ||
//   //   pathname === "/forgot-password" ||
//   //   pathname === "/term-and-conditions" ||
//   //   pathname === "/privacy-policy" ||
//   //   pathname.startsWith("/reset-password") ||
//   //   pathname.startsWith("/dashboard/detail");

//   const isFreeAccessPath =
//    pathname === "/sign-in" ||
//     pathname === "/sign-up" ||
//     pathname === "/forgot-password" ||
//     pathname === "/term-and-conditions" ||
//     pathname === "/privacy-policy" ||
//     pathname.startsWith("/dashboard/detail") ||
//     pathname.startsWith("/term-and-conditions") ||
//     pathname.startsWith("/privacy-policy") ||
//     pathname.startsWith("/reset-password");

//   if (token && !isFreeAccessPath) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (pathname === "/" && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (!token) {
//     if (isFreeAccessPath) {
//       return NextResponse.next();
//     }

//     if (!isFreeAccessPath) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   } else {
//     const decoded: any = await verifyJWT(token);
//     if (!decoded) {
//       const response = NextResponse.redirect(new URL("/sign-in", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }

//     const userRole = decoded?.role;

//     if (pathname.startsWith("/admin-dashboard") && userRole !== 2) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|.*\\..*|api).*)"],
// };





// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "swayam");

// async function verifyJWT(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     return payload;
//   } catch (error) {
//     console.error("❌ Invalid or expired token:", error);
//     return null;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//   // ✅ Always accessible routes
//   const alwaysAccessible =
//     pathname.startsWith("/dashboard/detail") ||
//     pathname.startsWith("/term-and-conditions") ||
//     pathname.startsWith("/privacy-policy") ||
//     pathname.startsWith("/reset-password");

//   // 🔓 Allow always accessible routes for both with/without token
//   if (alwaysAccessible) {
//     return NextResponse.next();
//   }

//   const isPublicPath =
//     pathname === "/sign-in" ||
//     pathname === "/sign-up" ||
//     pathname === "/forgot-password";

//   // 🚪 If token exists and user tries to access public pages → redirect to dashboard
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // 🏠 Root redirect when logged in
//   if (pathname === "/" && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // 🔒 If no token and route is protected → redirect to login
//   if (!token && !isPublicPath) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // 🔐 Verify token and handle admin restriction
//   if (token) {
//     const decoded: any = await verifyJWT(token);
//     if (!decoded) {
//       const response = NextResponse.redirect(new URL("/sign-in", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }

//     const userRole = decoded?.role;
//     if (pathname.startsWith("/admin-dashboard") && userRole !== 2) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|.*\\..*|api).*)"],
// };
