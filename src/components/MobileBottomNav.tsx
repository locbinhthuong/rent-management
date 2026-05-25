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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center pb-safe pt-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1.5 rounded-full ${isActive ? 'bg-indigo-50' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{link.label}</span>
          </Link>
        );
      })}
      
      <a 
        href="/api/auth/signout"
        className="flex flex-col items-center justify-center w-full py-2 gap-1 text-slate-400 hover:text-red-500 transition-colors"
      >
        <div className="p-1.5 rounded-full">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold">Thoát</span>
      </a>
    </div>
  );
}
