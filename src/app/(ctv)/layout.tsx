import React from 'react';
import CTVSidebar from '@/components/ctv/CTVSidebar';
import CTVMobileNav from '@/components/ctv/CTVMobileNav';

export default function CTVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex pb-[env(safe-area-inset-bottom)] md:pb-0 relative overflow-hidden font-sans selection:bg-cyan-500/30">
       {/* Ambient background glows */}
       <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
       <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
       
       <CTVSidebar />
       <div className="flex-1 pb-16 md:pb-0 relative z-10 h-screen overflow-hidden flex flex-col">
         {children}
       </div>
       <CTVMobileNav />
    </div>
  );
}
