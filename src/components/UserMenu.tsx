'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, User, LayoutDashboard, Heart } from 'lucide-react';

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardUrl = user?.role === 'Admin' ? '/admin' : user?.role === 'CTV' ? '/ctv' : '/account';

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 text-slate-900 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-slate-300 hover:scale-105 transition-transform"
        title="Tài khoản"
      >
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm text-slate-900 font-bold line-clamp-1">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          
          <div className="p-2 space-y-1">
            <Link 
              href={dashboardUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-500" />
              Bảng điều khiển
            </Link>
            
            <Link 
              href="/account/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
            >
              <User className="w-4 h-4 text-blue-500" />
              Thông tin cá nhân
            </Link>

            <Link 
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium sm:hidden"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              Tin đã lưu
            </Link>
          </div>

          <div className="p-2 border-t border-slate-100">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
