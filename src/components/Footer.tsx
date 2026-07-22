import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-50 text-slate-700 border-t border-slate-200">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Về chúng tôi */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-space">Locus</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nền tảng kết nối người cho thuê và người đi thuê phòng trọ. Cung cấp thông tin trực quan, chính xác với giao diện hiện đại và hệ thống quản lý chuyên nghiệp.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-200/50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-500 hover:text-slate-900 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 group">
                <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-200/50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-pink-500 hover:text-slate-900 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 group">
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Về chúng tôi</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Trang chủ</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Giới thiệu</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Quy định sử dụng</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Hướng dẫn đăng tin</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Bảng giá dịch vụ</Link></li>
              <li><Link href="#" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Liên hệ</h3>
            <ul className="space-y-5 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="pt-1">Trụ sở chính (Đang cập nhật)</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-slate-900 tracking-wide">Hotline: 0988.727.604</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 shrink-0">
                  <Mail className="w-4 h-4 text-violet-400" />
                </div>
                <span>Email: locushomels@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} <span className="text-slate-700 font-medium">Locushomee.com</span>. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            Nền tảng tìm phòng thông minh <span className="text-amber-500 animate-pulse">✨</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
