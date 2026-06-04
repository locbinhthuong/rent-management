import { Bell } from 'lucide-react';
import Image from 'next/image';

export default function CTVMobileHeader({ title = 'Urban Dwelling Admin' }: { title?: string }) {
  return (
    <header className="flex md:hidden items-center justify-between mb-4 mt-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-slate-800">
          <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <h2 className="font-bold text-slate-100 text-[15px]">{title}</h2>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 bg-slate-900/50 border border-white/5 relative">
        <Bell className="w-5 h-5" />
      </div>
    </header>
  );
}
