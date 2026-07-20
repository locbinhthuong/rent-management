import { Bell, User } from 'lucide-react';
import Image from 'next/image';

export default function CTVMobileHeader({ title = 'CTV Admin', avatarUrl }: { title?: string, avatarUrl?: string | null }) {
  return (
    <header className="flex md:hidden items-center justify-between mb-4 mt-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <h2 className="font-bold text-slate-900 text-[15px]">{title}</h2>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 bg-white/80 border border-slate-200 relative">
        <Bell className="w-5 h-5" />
      </div>
    </header>
  );
}
