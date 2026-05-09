import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Phân quyền cho /admin
    if (path.startsWith("/admin") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Phân quyền cho /ctv
    if (path.startsWith("/ctv") && token?.role !== "CTV" && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/ctv/:path*"],
};
