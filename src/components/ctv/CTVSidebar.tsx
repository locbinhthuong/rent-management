'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Users, MessageCircle } from 'lucide-react';

export default function CTVSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: Home, exact: true },
    { href: '/ctv/post', label: 'Đăng tin mới', icon: PlusCircle, exact: false },
    { href: '/ctv/customers', label: 'Khách liên hệ', icon: MessageCircle, exact: false },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)] backdrop-blur-2xl shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-black flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Users className="w-5 h-5 text-white" />
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
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
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
