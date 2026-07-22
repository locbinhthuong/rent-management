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
              {/* Email */}
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 shrink-0">
                  <Mail className="w-4 h-4 text-violet-400" />
                </div>
                <span>{contact.email || 'locushomels@gmail.com'}</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 pt-2">
              {/* Hotline Icon */}
              {contact.hotline && (
                <a href={`tel:${contact.hotline.replace(/[^0-9+]/g, '')}`} title={`Gọi Hotline: ${contact.hotline}`} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_4px_15px_rgba(16,185,129,0.4)] transition-all duration-300 group">
                  <Phone className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                </a>
              )}
              {/* Zalo */}
              {contact.zalo && (
                <a href={contact.zalo.startsWith('http') ? contact.zalo : `https://zalo.me/${contact.zalo.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Zalo" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                    <path d="M21.731 11.65c0-3.704-3.52-6.705-7.865-6.705-4.343 0-7.864 3.001-7.864 6.705 0 3.702 3.52 6.703 7.864 6.703.953 0 1.867-.146 2.713-.414l3.3.99c.319.1.63-.173.495-.467l-1.103-2.42c1.516-1.066 2.46-2.463 2.46-4.392z"/>
                  </svg>
                </a>
              )}
              {/* Facebook */}
              {contact.facebook && (
                <a href={contact.facebook.startsWith('http') ? contact.facebook : `https://${contact.facebook}`} target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-[0_4px_15px_rgba(79,70,229,0.4)] transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                    <path d="M16.39 23.61v-9.3h3.12l.47-3.62h-3.59v-2.31c0-1.04.29-1.76 1.79-1.76h1.91V3.38c-.33-.04-1.47-.14-2.79-.14-2.76 0-4.65 1.69-4.65 4.79v2.66H9.52v3.62h3.13v9.3h3.74z"/>
                  </svg>
                </a>
              )}
              {/* TikTok */}
              {contact.tiktok && (
                <a href={contact.tiktok.startsWith('http') ? contact.tiktok : `https://${contact.tiktok}`} target="_blank" rel="noopener noreferrer" title="TikTok" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white hover:border-black hover:shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68l.01.2a6.29 6.29 0 0 0 4.13 5.86 6.3 6.3 0 0 0 7.82-3.13 6.42 6.42 0 0 0 .5-3V8.71a8.3 8.3 0 0 0 3.19.64V5.9a4.85 4.85 0 0 1-1.06-.06z"/>
                  </svg>
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
