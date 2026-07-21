import Link from 'next/link';
import { ArrowLeft, HelpCircle, PhoneCall, MessageSquare } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/ctv/account" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Trợ giúp & Hướng dẫn</h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center mb-8">
             <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Bạn cần hỗ trợ?</h2>
            <p className="text-slate-600">Đội ngũ admin luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="tel:0909090909" className="flex flex-col items-center p-6 border border-slate-200 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-all group">
              <PhoneCall className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 mb-3 transition-colors" />
              <span className="font-bold text-slate-800">Hotline hỗ trợ</span>
              <span className="text-sm text-slate-500 mt-1">0909.090.909</span>
            </a>
            
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="flex flex-col items-center p-6 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <MessageSquare className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
              <span className="font-bold text-slate-800">Zalo Hỗ trợ CTV</span>
              <span className="text-sm text-slate-500 mt-1">Nhắn tin ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
