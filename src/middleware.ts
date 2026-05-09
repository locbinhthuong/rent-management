import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const appType = process.env.APP_TYPE || 'CUSTOMER'; // Mặc định là Khách hàng nếu không set

    // Xử lý luồng cho Khách Hàng (CUSTOMER)
    if (appType === 'CUSTOMER') {
      // Chặn khách hàng không được truy cập vào admin/ctv/login
      if (path.startsWith("/admin") || path.startsWith("/ctv") || path.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Xử lý luồng cho Quản trị viên & CTV (ADMIN)
    if (appType === 'ADMIN') {
      // Chặn không cho vào trang chủ (trang tìm phòng)
      if (path === "/") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Vẫn giữ logic phân quyền NextAuth cũ
      if (path.startsWith("/admin") && token?.role !== "Admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (path.startsWith("/ctv") && token?.role !== "CTV" && token?.role !== "Admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
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
