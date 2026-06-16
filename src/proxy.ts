// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const protectedRoutes = [
//   "/dashboard",
//   "/resume",
//   "/cover-letter",
//   "/jobs",
//   "/settings",
// ];

// const authRoutes = [
//   "/",           // ← added
//   "/login",
//   "/signup",
//   "/forgot-password",
// ];

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const accessToken = request.cookies.get("access_token")?.value;
//   const isAuthenticated = !!accessToken;

//   // Redirect unauthenticated users away from protected routes
//   const isProtected = protectedRoutes.some((route) =>
//     pathname === route || pathname.startsWith(`${route}/`)
//   );

//   if (isProtected && !isAuthenticated) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Redirect authenticated users away from auth pages
//   const isAuthPage = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

//   if (isAuthPage && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",           // ← added
//     "/dashboard/:path*",
//     "/resume/:path*",
//     "/cover-letter/:path*",
//     "/jobs/:path*",
//     "/settings/:path*",
//     "/login",
//     "/signup",
//     "/forgot-password",
//     "/reset-password/:path*",
//   ],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/resume",
  "/cover-letter",
  "/jobs",
  "/settings",
];

const authRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.cookies.get("refresh_token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = authRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/resume/:path*",
    "/cover-letter/:path*",
    "/jobs/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password/:path*",
  ],
};