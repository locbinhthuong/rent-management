'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, User, Crown, Menu, X, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CTVMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/ctv', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
    { href: '/ctv/posts', label: 'Tin đăng', icon: FileText, exact: false },
    { href: '/bang-gia', label: 'Dịch vụ', icon: Crown, exact: false },
    { href: '/ctv/customers', label: 'Tư vấn', icon: MessageSquare, exact: false },
    { href: '/ctv/contracts', label: 'Hợp đồng', icon: FileText, exact: false },
    { href: '/ctv/account', label: 'Hồ sơ', icon: User, exact: false },
  ];

  return (
    <>
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-[100] h-16 flex items-center justify-between px-4">
        <div className="font-black text-lg text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Users className="w-4 h-4 text-white" />
          </div>
          Cộng Tác Viên
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700 bg-slate-100 rounded-lg">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-[90] overflow-hidden shadow-xl"
          >
            <div className="flex flex-col py-4 px-4 space-y-2 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-cyan-500/10 text-cyan-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5`} />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
