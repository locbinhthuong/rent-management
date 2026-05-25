import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const appType = process.env.APP_TYPE || 'CUSTOMER'; // Mặc định là Khách hàng nếu không set
    
    // Tracking Affiliate
    const refCode = req.nextUrl.searchParams.get('ref');
    let response = NextResponse.next();

    // Bỏ chặn APP_TYPE khắt khe để Admin/CTV có thể vào Bảng điều khiển từ Trang chủ
    if (path.startsWith("/admin") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/ctv")) {
      if (token?.role !== "CTV" && token?.role !== "Admin") {
        response = NextResponse.redirect(new URL("/login", req.url));
      } else if (token?.status === "Pending") {
        if (path !== "/ctv/pending") {
          response = NextResponse.redirect(new URL("/ctv/pending", req.url));
        }
      }
    }

    if (refCode) {
      response.cookies.set({
        name: 'affiliate_ref',
        value: refCode,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const appType = process.env.APP_TYPE || 'CUSTOMER';
        // Với app CUSTOMER, không yêu cầu login (token có thể rỗng)
        if (appType === 'CUSTOMER') return true;
        
        // Với app ADMIN, trang /login thì không yêu cầu token, các trang khác cần token
        if (req.nextUrl.pathname.startsWith('/login')) return true;
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Chạy middleware trên tất cả các route ngoại trừ tài nguyên tĩnh
};
