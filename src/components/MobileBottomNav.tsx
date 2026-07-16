'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, LogOut, MessageSquare, Settings, Heart, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;

  const adminLinks = [
    { href: '/admin', label: 'Tổng quan', icon: Home },
    { href: '/admin/posts', label: 'Bài đăng', icon: FileText },
    { href: '/admin/users', label: 'CTV', icon: Users },
    { href: '/admin/leads', label: 'Khách hàng', icon: MessageSquare },
    { href: '/admin/settings', label: 'Cấu hình', icon: Settings },
  ];

  const ctvLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: Home },
    { href: '/ctv/post', label: 'Đăng tin', icon: FileText },
    { href: '/ctv/customers', label: 'Khách hàng', icon: MessageSquare },
  ];
  
  const customerLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/saved', label: 'Yêu thích', icon: Heart },
    { href: '/messages', label: 'Tin nhắn', icon: MessageSquare },
    { href: '/account', label: 'Tài khoản', icon: User },
  ];

  let links = customerLinks;
  if (role === 'Admin' && pathname.startsWith('/admin')) {
    links = adminLinks;
  } else if (role === 'CTV' && pathname.startsWith('/ctv')) {
    links = ctvLinks;
  }

  // Disable on CTV routes because CTV has its own MobileNav (CTVMobileNav)
  if (pathname.startsWith('/ctv')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)] px-2 min-h-[68px]">
      {links.map((link) => {
        const Icon = link.icon;
        // Logic for exact match on Home '/'. For others, prefix match.
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-500/20' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-medium tracking-wide text-center leading-tight whitespace-nowrap`}>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
