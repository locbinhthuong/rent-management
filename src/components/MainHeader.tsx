'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Heart, Phone, Mail } from 'lucide-react';
import LocusLogo from './LocusLogo';
import UserMenu from './UserMenu';

export default function MainHeader({ user }: { user: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const aboutLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giới thiệu', href: '/gioi-thieu' },
    { name: 'Quy định sử dụng', href: '/quy-dinh' },
    { name: 'Chính sách bảo mật', href: '/bao-mat' },
  ];

  const supportLinks = [
    { name: 'Hướng dẫn đăng tin', href: '/huong-dan' },
    // { name: 'Bảng giá dịch vụ', href: '/bang-gia' },
    { name: 'Liên hệ hỗ trợ', href: '/lien-he' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-slate-50/90 backdrop-blur-xl z-50 border-b border-slate-200 shadow-sm flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 lg:gap-8">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <LocusLogo width={45} height={45} variant="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Về chúng tôi */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('about')}
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-500 transition-colors"
            >
              Về chúng tôi <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'about' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 flex flex-col z-50">
                {aboutLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpenDropdown(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-500 transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('support')}
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-500 transition-colors"
            >
              Hỗ trợ khách hàng <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'support' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'support' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 flex flex-col z-50">
                {supportLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpenDropdown(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-500 transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Liên hệ và theo dõi */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('contact')}
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-cyan-500 transition-colors"
            >
              Liên hệ và theo dõi <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'contact' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-lg py-3 px-4 flex flex-col gap-3 z-50">
                <a href="tel:0988727604" className="flex items-center gap-3 text-sm text-slate-600 hover:text-cyan-500 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                  0988.727.604
                </a>
                <a href="mailto:locushomels@gmail.com" className="flex items-center gap-3 text-sm text-slate-600 hover:text-cyan-500 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                  locushomels@gmail.com
                </a>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <a href="https://zalo.me/0988727604" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0068FF] flex items-center justify-center text-white text-[10px] font-bold hover:scale-110 transition-transform">Zalo</a>
                  <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.39 23.61v-9.3h3.12l.47-3.62h-3.59v-2.31c0-1.04.29-1.76 1.79-1.76h1.91V3.38c-.33-.04-1.47-.14-2.79-.14-2.76 0-4.65 1.69-4.65 4.79v2.66H9.52v3.62h3.13v9.3h3.74z"/></svg>
                  </a>
                  <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68l.01.2a6.29 6.29 0 0 0 4.13 5.86 6.3 6.3 0 0 0 7.82-3.13 6.42 6.42 0 0 0 .5-3V8.71a8.3 8.3 0 0 0 3.19.64V5.9a4.85 4.85 0 0 1-1.06-.06z"/></svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      <div className="flex items-center gap-3 lg:gap-4">
        <Link href="/saved" className="flex items-center gap-2 text-slate-700 hover:text-cyan-400 transition-colors font-medium text-sm">
          <Heart className="w-5 h-5" />
          <span className="hidden sm:inline">Đã lưu</span>
        </Link>
        
        <div className="w-px h-5 bg-slate-300 mx-1 hidden sm:block"></div>
        
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link 
            href="/login" 
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] text-sm"
          >
            Đăng Nhập
          </Link>
        )}

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-slate-700 bg-slate-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-2 z-50 lg:hidden max-h-[80vh] overflow-y-auto">
          {/* Về chúng tôi */}
          <div className="flex flex-col gap-1">
            <button onClick={() => toggleDropdown('mobile-about')} className="flex items-center justify-between font-bold text-slate-800 p-3 bg-slate-50 rounded-lg">
              Về chúng tôi <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'mobile-about' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'mobile-about' && (
              <div className="flex flex-col gap-1 pl-4 py-2">
                {aboutLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 py-2 text-sm">{link.name}</Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Hỗ trợ khách hàng */}
          <div className="flex flex-col gap-1">
            <button onClick={() => toggleDropdown('mobile-support')} className="flex items-center justify-between font-bold text-slate-800 p-3 bg-slate-50 rounded-lg">
              Hỗ trợ khách hàng <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'mobile-support' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'mobile-support' && (
              <div className="flex flex-col gap-1 pl-4 py-2">
                {supportLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 py-2 text-sm">{link.name}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Liên hệ và theo dõi */}
          <div className="flex flex-col gap-1">
            <button onClick={() => toggleDropdown('mobile-contact')} className="flex items-center justify-between font-bold text-slate-800 p-3 bg-slate-50 rounded-lg">
              Liên hệ và theo dõi <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'mobile-contact' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'mobile-contact' && (
              <div className="flex flex-col gap-3 pl-4 py-2">
                <a href="tel:0988727604" className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                  0988.727.604
                </a>
                <a href="mailto:locushomels@gmail.com" className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                  locushomels@gmail.com
                </a>
                <div className="flex items-center gap-3 pt-2">
                  <a href="https://zalo.me/0988727604" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center text-white text-[12px] font-bold">Zalo</a>
                  <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.39 23.61v-9.3h3.12l.47-3.62h-3.59v-2.31c0-1.04.29-1.76 1.79-1.76h1.91V3.38c-.33-.04-1.47-.14-2.79-.14-2.76 0-4.65 1.69-4.65 4.79v2.66H9.52v3.62h3.13v9.3h3.74z"/></svg>
                  </a>
                  <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68l.01.2a6.29 6.29 0 0 0 4.13 5.86 6.3 6.3 0 0 0 7.82-3.13 6.42 6.42 0 0 0 .5-3V8.71a8.3 8.3 0 0 0 3.19.64V5.9a4.85 4.85 0 0 1-1.06-.06z"/></svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
