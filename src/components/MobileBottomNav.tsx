'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, LogOut, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Chỉ hiển thị trên mobile
  // Nếu không phải là admin hoặc ctv, không hiển thị
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'CTV')) return null;

  const role = session.user.role;
  const isPending = (session.user as any).status === 'Pending';

  if (isPending) return null;

  const adminLinks = [
    { href: '/admin', label: 'Tổng quan', icon: Home },
    { href: '/admin/posts', label: 'Bài đăng', icon: FileText },
    { href: '/admin/users', label: 'CTV', icon: Users },
  ];

  const ctvLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: Home },
    { href: '/ctv/post', label: 'Quản lý phòng', icon: FileText },
    { href: '/ctv/customers', label: 'Khách hàng', icon: MessageSquare },
  ];

  const links = role === 'Admin' ? adminLinks : ctvLinks;
  
  // Tránh hiển thị nav này trên trang chủ Customer (chỉ hiện khi đang ở trong /admin hoặc /ctv)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/ctv')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center justify-center w-full py-3 gap-1 transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : ''}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'font-space' : ''}`}>{link.label}</span>
          </Link>
        );
      })}
      
      <a 
        href="/api/auth/signout"
        className="flex flex-col items-center justify-center w-full py-3 gap-1 text-slate-400 hover:text-rose-400 transition-all duration-300"
      >
        <div className="p-1.5 rounded-xl">
          <LogOut className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold tracking-wide">Thoát</span>
      </a>
    </div>
  );
}
