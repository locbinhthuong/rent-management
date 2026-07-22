import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Globe, MessageCircle } from 'lucide-react';
import connectDB from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';

export default async function Footer() {
  await connectDB();
  const config = await SystemConfig.findOne().lean();
  const contact = config?.contact || {
    hotline: '0988.727.604',
    zalo: 'https://zalo.me/0988727604',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
    email: 'locushomels@gmail.com',
    address: 'Trụ sở chính (Đang cập nhật)'
  };

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
              <img src="/logo.png" alt="Locushome Logo" className="w-8 h-8 object-contain rounded-full" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-space">Locushome</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Hệ thống Tìm Phòng Trọ Thông Minh</strong> – Nền tảng kết nối người thuê và chủ trọ <strong>miễn phí</strong>, giúp tìm kiếm phòng trọ <strong>nhanh chóng, thông minh, uy tín và chuyên nghiệp</strong>, mang đến giải pháp tìm nơi ở an toàn, tiện lợi và hiệu quả.
            </p>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Về chúng tôi</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Trang chủ</Link></li>
              <li><Link href="/gioi-thieu" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Giới thiệu</Link></li>
              <li><Link href="/quy-dinh" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Quy định sử dụng</Link></li>
              <li><Link href="/bao-mat" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/huong-dan" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Hướng dẫn đăng tin</Link></li>
              <li><Link href="/bang-gia" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Bảng giá dịch vụ</Link></li>
              <li><Link href="/lien-he" className="text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Liên hệ và theo dõi</h3>
            <ul className="space-y-5 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="pt-1">{contact.address || 'Trụ sở chính (Đang cập nhật)'}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-slate-900 tracking-wide">Hotline: {contact.hotline || '0988.727.604'}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 shrink-0">
                  <Mail className="w-4 h-4 text-violet-400" />
                </div>
                <span>Email: {contact.email || 'locushomels@gmail.com'}</span>
              </li>
            </ul>
            <div className="flex gap-3 pt-2">
              {contact.zalo && (
                <a href={contact.zalo} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300 group">
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {contact.tiktok && (
                <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-black hover:text-white hover:border-black hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
              )}
            </div>
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
