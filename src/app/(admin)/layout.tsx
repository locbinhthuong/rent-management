import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex pb-[env(safe-area-inset-bottom)] md:pb-0 relative overflow-hidden font-sans selection:bg-cyan-500/30">
       {/* Background ambient light */}
       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
       <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
       
       <AdminSidebar />
       <div className="flex-1 pb-16 md:pb-0 relative z-10 h-screen overflow-hidden flex flex-col">
         {children}
       </div>
       <AdminMobileNav />
    </div>
  );
}
