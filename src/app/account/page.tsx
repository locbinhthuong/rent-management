'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Clock, Settings, HelpCircle, LogOut, ChevronRight, ShieldCheck, Star, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const user = session?.user || {
    name: 'Khách hàng',
    email: 'Vui lòng đăng nhập để xem thông tin',
    image: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'
  };

  const menuItems = [
    { icon: User, label: 'Thông tin cá nhân', color: 'text-blue-400 bg-blue-500/10', href: '#' },
    { icon: Clock, label: 'Lịch sử thuê', color: 'text-emerald-400 bg-emerald-500/10', href: '#' },
    { icon: Settings, label: 'Cài đặt', color: 'text-violet-400 bg-violet-500/10', href: '#' },
    { icon: HelpCircle, label: 'Trợ giúp', color: 'text-amber-400 bg-amber-500/10', href: '#' },
  ];

  const handleLogout = async () => {
    router.push('/api/auth/signout');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-center px-4">
        <h1 className="text-lg font-space font-bold tracking-wide">Tài khoản</h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none"></div>
          
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl z-10 mb-4 bg-slate-800">
            {user.image && (
              <Image 
                src={user.image} 
                alt="Avatar" 
                fill 
                className="object-cover rounded-full"
              />
            )}
            <button className="absolute bottom-0 right-0 bg-slate-800 border border-slate-700 p-1.5 rounded-full text-slate-300 hover:text-white transition-colors shadow-lg">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <h2 className="text-2xl font-bold font-space text-white mb-1 z-10">
            {user.name}
          </h2>
          <p className="text-slate-400 text-sm mb-4 z-10">{user.email}</p>

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
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden flex flex-col mt-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={index}
                href={item.href}
                className={`flex items-center p-4 hover:bg-slate-800/50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-slate-800/50' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 font-semibold text-slate-200">{item.label}</span>
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
