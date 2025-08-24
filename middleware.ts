import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/features",
    "/how-it-works",
    "/blog",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  // SEO and static files that should be publicly accessible
  const seoRoutes = ["/sitemap.xml", "/robots.txt", "/favicon.ico"];
  const isSeoRoute = seoRoutes.some((route) => pathname === route);

  // API routes that don't require authentication
  const publicApiRoutes = ["/api/auth/login", "/api/auth/signup"];
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a public route, public API route, or SEO route, allow access
  if (isPublicRoute || isPublicApiRoute || isSeoRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyTokenEdge(token);
    return NextResponse.next();
  } catch (error) {
    // Invalid token
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap)
     * - robots.txt (robots file)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
