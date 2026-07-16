# TÀI LIỆU HỆ THỐNG DỰ ÁN QUẢN LÝ CHO THUÊ NHÀ TRỌ

Tài liệu này ghi chú lại toàn bộ công nghệ, kiến trúc và cách thức vận hành của 2 hệ thống chính trong dự án của bạn: **Dự án Quản lý Nhà Trọ (`quanly-nhatro`)** và **Dự án SaaS Portal (`saas_portal`)**.

---

## 1. DỰ ÁN QUẢN LÝ NHÀ TRỌ (`quanly-nhatro`)
Đây là ứng dụng web chính dành cho khách thuê trọ, cộng tác viên (CTV) và quản trị viên (Admin), nơi mọi người có thể tìm kiếm, đăng tin và quản lý phòng trọ.

### 💻 Công nghệ sử dụng (Tech Stack)
- **Framework Chính**: `Next.js` (phiên bản 16.x) sử dụng mô hình *App Router* mới nhất.
- **Ngôn ngữ**: TypeScript (`.ts`, `.tsx`).
- **Giao diện (UI/UX)**: 
  - `Tailwind CSS v4` (thiết kế tiện lợi, giao diện sáng hiện đại với màu Xanh ngọc Emerald).
  - `shadcn/ui` (bộ component giao diện cao cấp).
  - `Framer Motion` & `tw-animate-css` (Hiệu ứng chuyển động, animation mượt mà).
  - `Lucide React` (bộ icon).
- **Bản đồ**: `Leaflet` & `react-leaflet` (hiển thị bản đồ tìm trọ trực quan).
- **Cơ sở dữ liệu (Database)**: `MongoDB` thông qua thư viện `Mongoose`.
- **Xác thực (Authentication)**: `NextAuth.js` (quản lý đăng nhập, phiên người dùng an toàn) kết hợp với `bcryptjs` (mã hóa mật khẩu).
- **Quản lý Form & Data**: `React Hook Form`, `Zod` (validate dữ liệu) và `React Query` (quản lý state và fetch data).
- **Lưu trữ ảnh**: `Cloudinary` & `next-cloudinary`.

### 🏗 Kiến trúc thư mục chính
- `/src/app`: Chứa tất cả các trang web và API routes (định tuyến).
  - `/src/app/(admin)`: Các trang dành riêng cho Admin (quản trị viên).
  - `/src/app/(ctv)`: Các trang dành riêng cho Cộng tác viên đăng bài.
  - `/src/app/api`: Các endpoint backend/API xử lý logic và gọi vào database (ví dụ: đăng nhập, lấy danh sách phòng).
- `/src/components`: Chứa các mảnh giao diện tái sử dụng (Buttons, Cards, Navbar, Sidebar, Bản đồ...).

### 🚀 Cách thức Vận hành & Cài đặt
1. **Yêu cầu môi trường**: Node.js (v18+).
2. **Cài đặt thư viện**: Mở terminal ở thư mục `quanly-nhatro` và chạy lệnh `npm install`.
3. **Biến môi trường**: Cấu hình các thông số kết nối Database, Cloudinary, NextAuth trong file `.env` hoặc `.env.local`.
4. **Chạy môi trường phát triển (Dev)**: 
   ```bash
   npm run dev
   ```
   (Web sẽ chạy tại http://localhost:3000)
5. **Build cho Production (triển khai thực tế)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 2. DỰ ÁN QUẢN LÝ PHẦN MỀM (`saas_portal`)
Đây là một cổng thông tin (portal) tách biệt dùng để quản lý phần mềm, khách hàng, hoặc các tác vụ quản trị cấp cao.

### 💻 Công nghệ sử dụng (Tech Stack)
- **Framework Frontend**: `React 19` kết hợp với công cụ build siêu tốc `Vite`.
- **Ngôn ngữ**: JavaScript (`.js`, `.jsx`).
- **Giao diện (UI/UX)**: `Tailwind CSS`, `Framer Motion`, `Lucide React`.
- **Định tuyến (Routing)**: `react-router-dom`.
- **Backend / API**: Triển khai theo mô hình *Serverless Functions* của Vercel (thư mục `/api`).
- **Cơ sở dữ liệu**: `MongoDB` (Mongoose).
- **Bảo mật**: Sử dụng `jsonwebtoken` (JWT) để cấp token đăng nhập và `bcryptjs` để mã hóa mật khẩu.

### 🏗 Kiến trúc thư mục chính
- `/src`: Chứa code frontend React (pages, components, utils).
- `/api`: Chứa các hàm Backend (Serverless functions) để xử lý logic khi đẩy lên Vercel.
- `/models`: Chứa các định nghĩa cấu trúc dữ liệu MongoDB.
- `vercel.json`: File cấu hình định tuyến (rewrite) để Vercel hiểu cách kết nối Frontend và Backend API.

### 🚀 Cách thức Vận hành & Cài đặt
1. **Cài đặt thư viện**: Mở terminal ở thư mục `saas_portal` và chạy lệnh `npm install`.
2. **Biến môi trường**: Đặt chuỗi kết nối MongoDB và JWT_SECRET trong file `.env`.
3. **Chạy giao diện Frontend**:
   ```bash
   npm run dev
   ```
   (Thường chạy ở http://localhost:5173)
4. **Lưu ý Backend**: Khi chạy ở máy cá nhân (Local), thư mục `/api` thường cần Vercel CLI (`vercel dev`) để mô phỏng hoàn chỉnh cả môi trường serverless, hoặc phải tự viết một server Express nhỏ nếu không dùng Vercel CLI. Khi đẩy code lên Vercel (Production), nó sẽ tự động chạy trơn tru.

---

## 3. TỔNG KẾT VỀ MÔ HÌNH TRIỂN KHAI (DEPLOYMENT)
- **Nền tảng Hosting**: Cả 2 dự án đều được thiết kế cực kỳ tối ưu để chạy trên **Vercel** (hỗ trợ Next.js và Vite cực tốt).
- **Cơ sở dữ liệu**: Đám mây **MongoDB Atlas** (có khả năng mở rộng tốt).
- **Quản lý mã nguồn**: Github (Mỗi khi bạn `git push` lên nhánh `master`, Vercel sẽ tự động tải code mới về, chạy `npm run build` và cập nhật trang web của bạn chỉ trong vài phút).

*Tài liệu này được tạo tự động để giúp bạn nắm bắt tổng quan dự án dễ dàng hơn.*
