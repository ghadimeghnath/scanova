import { NextResponse } from "next/server";

// Protect /admin routes with session-based auth
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only guard /admin pages
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const session = request.cookies.get("admin_session");
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;

  // Missing environment configuration
  if (!expectedToken) {
    console.error("[middleware] ADMIN_SESSION_TOKEN not configured");
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 503 }
    );
  }

  // Session validation
  if (!session || session.value !== expectedToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Middleware only runs on /admin paths
  matcher: ["/admin/:path*"],
};
