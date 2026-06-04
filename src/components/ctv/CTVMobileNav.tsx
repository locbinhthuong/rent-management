'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, MessageCircle } from 'lucide-react';

export default function CTVMobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: Home, exact: true },
    { href: '/ctv/post', label: 'Đăng tin', icon: PlusCircle, exact: false },
    { href: '/ctv/customers', label: 'Khách', icon: MessageCircle, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-[100] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`} />
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
