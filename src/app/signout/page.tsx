'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, ArrowLeft } from 'lucide-react';
import LocusLogo from '@/components/LocusLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Central Glassmorphism Panel */}
      <div className="relative z-10 max-w-[420px] w-full rounded-3xl overflow-hidden backdrop-blur-xl bg-slate-200/80 border border-slate-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        
        {/* Header Section */}
        <div className="p-8 pb-6 text-center border-b border-slate-200 relative overflow-hidden flex flex-col items-center">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/30 rounded-full blur-[50px] -z-10" />
          
          <div className="mb-4">
            <LocusLogo width={50} height={50} variant="horizontal" className="scale-110" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
            Đăng xuất khỏi hệ thống
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            Bạn có chắc chắn muốn đăng xuất?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-8 space-y-4 bg-white/50">
          <Button 
            onClick={handleSignOut}
            disabled={loading}
            className="w-full py-6 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-[15px] shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                ĐĂNG XUẤT NGAY
              </>
            )}
          </Button>

          <Button 
            onClick={() => router.back()}
            disabled={loading}
            variant="outline"
            className="w-full py-6 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang trước
          </Button>

          <div className="pt-4 text-center">
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Trở về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
