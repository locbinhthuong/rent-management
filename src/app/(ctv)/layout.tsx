import React from 'react';
import CTVSidebar from '@/components/ctv/CTVSidebar';

export default function CTVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex pb-16 md:pb-0 relative overflow-hidden font-sans">
       {/* Ambient background glows */}
       <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
       <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
       
       <CTVSidebar />
       {children}
    </div>
  );
}
