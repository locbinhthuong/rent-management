import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/components/Footer";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Thuê Trọ",
  description: "Giải pháp toàn diện quản lý phòng trọ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <ReactQueryProvider>
            <NextTopLoader color="#4f46e5" showSpinner={false} />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <MobileBottomNav />
            <Footer />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
