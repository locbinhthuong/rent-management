import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';

export default function NotificationsSettingsPage() {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/ctv/account" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Cài đặt thông báo</h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tính năng đang phát triển</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện tính năng tùy chỉnh thông báo. Vui lòng quay lại sau nhé!
          </p>
        </div>
      </div>
    </div>
  );
}
