import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import NextTopLoader from 'nextjs-toploader';

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuanLy_chothue | Financial Command Center",
  description: "Hệ thống quản lý thuê trọ cao cấp, nhanh chóng, minh bạch.",
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
      <body className="min-h-full flex flex-col pb-16 md:pb-0 bg-slate-50 text-slate-900">
        <AuthProvider>
          <ReactQueryProvider>
            <NextTopLoader color="#4f46e5" showSpinner={false} />
            {children}
            <MobileBottomNav />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
