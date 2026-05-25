'use client';

import { ShieldAlert, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Tài khoản chờ duyệt</h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Tài khoản Cộng Tác Viên của bạn đã được ghi nhận và đang trong quá trình chờ Ban Quản Trị xét duyệt. Vui lòng quay lại sau!
        </p>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
