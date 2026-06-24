import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutePrefixes = [
  "/dashboard",
  "/properties",
  "/tenancies",
  "/my-tenancy",
  "/issues",
  "/messages",
  "/disputes",
  "/reports",
  "/notifications",
  "/profile",
  "/documents",
  "/users",
  "/settings",
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute = protectedRoutePrefixes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/properties/:path*",
    "/tenancies/:path*",
    "/my-tenancy/:path*",
    "/issues/:path*",
    "/messages/:path*",
    "/disputes/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/documents/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
