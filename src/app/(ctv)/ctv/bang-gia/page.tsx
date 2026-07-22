'use client';

import Link from 'next/link';
import { ArrowLeft, Settings2 } from 'lucide-react';

export default function CTVBangGiaPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings2 className="w-10 h-10 text-indigo-600 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Đang Cập Nhật</h1>
        <p className="text-slate-600 mb-8">
          Bảng giá dịch vụ đang được chúng tôi cập nhật. Vui lòng quay lại sau!
        </p>
        <Link href="/ctv" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Về tổng quan CTV
        </Link>
      </div>
    </main>
  );
}
