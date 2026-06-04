'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, User } from 'lucide-react';

export default function CTVMobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ctv', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/ctv/posts', label: 'Posts', icon: FileText, exact: false },
    { href: '/ctv/customers', label: 'Consults', icon: MessageSquare, exact: false },
    { href: '/ctv/account', label: 'Account', icon: User, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 z-[100] pb-[env(safe-area-inset-bottom)]">
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
                isActive ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-orange-500/10' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : ''}`} />
              </div>
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
