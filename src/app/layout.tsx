import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import MobileBottomNav from "@/components/MobileBottomNav";

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
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0 bg-background text-foreground">
        <AuthProvider>
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
