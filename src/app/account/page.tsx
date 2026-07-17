'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Clock, Settings, HelpCircle, LogOut, ChevronRight, ShieldCheck, Star, Edit2, Mail, Phone, MessageCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const currentUser = session?.user || {
    name: 'Khách hàng',
    email: 'Vui lòng đăng nhập để xem thông tin',
    image: null
  };
  const avatarUrl = currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Khách Hàng')}&background=0D8ABC&color=fff`;

  const menuItems = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân', color: 'text-blue-400 bg-blue-500/10', href: '/account/profile' },
    { id: 'history', icon: Clock, label: 'Lịch sử chọn phòng tư vấn', color: 'text-emerald-400 bg-emerald-500/10', href: '#' },
    { id: 'privacy', icon: ShieldCheck, label: 'Chính sách bảo mật', color: 'text-violet-400 bg-violet-500/10', href: '#' },
    { id: 'terms', icon: FileText, label: 'Điều khoản sử dụng', color: 'text-pink-400 bg-pink-500/10', href: '#' },
    { id: 'help', icon: HelpCircle, label: 'Trợ giúp', color: 'text-amber-400 bg-amber-500/10', href: '#' },
  ];

  const handleLogout = async () => {
    router.push('/api/auth/signout');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center justify-center px-4">
        <h1 className="text-lg font-space font-bold tracking-wide">Tài khoản</h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none"></div>
          
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl z-10 mb-4 bg-slate-100">
            {avatarUrl && (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="object-cover rounded-full w-full h-full"
              />
            )}
            <button className="absolute bottom-0 right-0 bg-slate-100 border border-slate-300 p-1.5 rounded-full text-slate-700 hover:text-slate-900 transition-colors shadow-lg">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <h2 className="text-2xl font-bold font-space text-slate-900 mb-1 z-10">
            {currentUser.name}
          </h2>
          <p className="text-slate-600 text-sm mb-4 z-10">{currentUser.email}</p>

          {/* Badges */}
          <div className="flex gap-2 z-10 w-full justify-center">
            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Verified Tenant</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/50" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Premium Member</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden flex flex-col mt-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            if (item.id === 'help') {
              return (
                <div key={index} className="flex flex-col">
                  <button 
                    onClick={() => setShowHelp(!showHelp)}
                    className={`w-full flex items-center p-4 hover:bg-slate-100/80 transition-colors ${
                      index !== menuItems.length - 1 && !showHelp ? 'border-b border-slate-200/50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-semibold text-slate-800 text-left">{item.label}</span>
                    <ChevronRight className={`w-5 h-5 text-slate-600 transition-transform ${showHelp ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {/* Expanded Help Content */}
                  {showHelp && (
                    <div className="bg-slate-50 border-t border-slate-200/50 p-4 px-6 flex flex-col gap-4 shadow-inner">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thông tin liên hệ Công ty TNHH Thuê Phòng</div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-rose-100 p-2.5 rounded-full text-rose-500"><Mail className="w-5 h-5" /></div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-semibold text-slate-400">Email doanh nghiệp</p>
                          <p className="font-bold text-slate-700">contact@thuephong.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-500"><Phone className="w-5 h-5" /></div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-semibold text-slate-400">Số điện thoại Hotline</p>
                          <p className="font-bold text-slate-700">1900 6868</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2.5 rounded-full text-blue-500"><MessageCircle className="w-5 h-5" /></div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-semibold text-slate-400">Zalo CSKH 24/7</p>
                          <p className="font-bold text-slate-700">0901 234 567</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link 
                key={index}
                href={item.href}
                className={`flex items-center p-4 hover:bg-slate-100/80 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-slate-200/50' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 font-semibold text-slate-800">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        {session ? (
          <button 
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        ) : (
          <Link 
            href="/login"
            className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Đăng nhập
          </Link>
        )}
      </main>
    </div>
  );
}
