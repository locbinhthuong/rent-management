'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, User, Crown } from 'lucide-react';

export default function CTVMobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
    { href: '/ctv/posts', label: 'Tin đăng', icon: FileText, exact: false },
    { href: '/bang-gia', label: 'Dịch vụ', icon: Crown, exact: false },
    { href: '/ctv/customers', label: 'Tư vấn', icon: MessageSquare, exact: false },
    { href: '/ctv/contracts', label: 'Hợp đồng', icon: FileText, exact: false },
    { href: '/ctv/account', label: 'Hồ sơ', icon: User, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-[100] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? 'text-orange-400' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-400/20' : 'bg-transparent text-slate-600'}`}>
                <Icon className={`w-5 h-5`} />
              </div>
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
