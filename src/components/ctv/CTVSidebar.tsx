'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Users, MessageCircle, FileText, User } from 'lucide-react';

export default function CTVSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: Home, exact: true },
    { href: '/ctv/posts', label: 'Quản lý tin đăng', icon: FileText, exact: true },
    { href: '/ctv/post', label: 'Đăng phòng mới', icon: PlusCircle, exact: true },
    { href: '/ctv/customers', label: 'Khách liên hệ', icon: MessageCircle, exact: false },
    { href: '/ctv/contracts', label: 'Hợp đồng thuê', icon: FileText, exact: false },
    { href: '/ctv/account', label: 'Hồ sơ CTV', icon: User, exact: false },
  ];

  return (
    <aside className="w-72 bg-white/80 border-r border-slate-200 hidden md:flex flex-col relative z-20 shadow-2xl backdrop-blur-2xl shrink-0 h-screen sticky top-0 text-slate-900">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-black flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Users className="w-5 h-5 text-slate-900" />
          </div>
          Bảng điều khiển
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 text-sm font-bold overflow-y-auto custom-scrollbar">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
            
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-5 h-5" /> {link.label}
            </Link>
          );
        })}
      </nav>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
}
