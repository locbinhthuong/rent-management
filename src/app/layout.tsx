import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import NextTopLoader from 'nextjs-toploader';
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import SplashScreen from "@/components/SplashScreen";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontSpace = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocusHome - Nền tảng thuê nhà thông minh",
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
      className={`${fontSans.variable} ${fontMono.variable} ${fontSpace.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
        <AuthProvider>
          <ReactQueryProvider>
            <SplashScreen />
            <NextTopLoader color="#06b6d4" showSpinner={false} height={3} />
            <div className="flex-1 flex flex-col pb-[68px] md:pb-0">
              {children}
            </div>
            <MobileBottomNav />
            <Footer />
          </ReactQueryProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
