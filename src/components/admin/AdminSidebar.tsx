'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Settings, MessageCircle } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Tổng quan', icon: Home, exact: true },
    { href: '/admin/posts', label: 'Duyệt bài đăng', icon: FileText, exact: false },
    { href: '/admin/users', label: 'Quản lý CTV', icon: Users, exact: false },
    { href: '/admin/leads', label: 'Quản lý Khách hàng', icon: MessageCircle, exact: false },
    { href: '/admin/settings', label: 'Cấu hình Web', icon: Settings, exact: false },
  ];

  return (
    <aside className="w-72 bg-white/80 border-r border-slate-200 hidden md:flex flex-col relative z-20 shadow-2xl backdrop-blur-2xl shrink-0 h-screen sticky top-0 text-slate-900">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <Settings className="w-7 h-7 text-cyan-400" />
          Admin Portal
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 text-sm font-semibold overflow-y-auto custom-scrollbar">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
}
