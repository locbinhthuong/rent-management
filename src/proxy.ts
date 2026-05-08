import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protect Admin routes
    if (path.startsWith('/admin') && token.role !== 'Admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protect CTV routes
    if (path.startsWith('/ctv') && token.role !== 'CTV' && token.role !== 'Admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware only to specific routes
export const config = {
  matcher: ['/admin/:path*', '/ctv/:path*'],
};
