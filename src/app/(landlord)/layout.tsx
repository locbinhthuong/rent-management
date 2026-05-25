import React from 'react';

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar giả định */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800">Landlord Portal</h2>
        </div>
        <nav className="px-4 space-y-2">
          <a href="/dashboard" className="block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">Tổng quan</a>
          <a href="/properties" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Phòng trọ của tôi</a>
          <a href="/transactions" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Lịch sử giao dịch</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Bảng điều khiển</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Chủ trọ VIP</span>
            <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
