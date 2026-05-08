'use client';

import Link from 'next/link';
import { Home, PlusCircle, Users, Wallet, UploadCloud, MessageCircle, MapPin } from 'lucide-react';

const mockPosts = [
  { id: 1, title: 'Phòng trọ ban công Quận 7', status: 'Active', views: 124, contacts: 5 },
  { id: 2, title: 'Studio mini Nguyễn Thị Thập', status: 'Pending', views: 0, contacts: 0 },
];

export default function CTVDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
            <Users className="w-5 h-5" />
            CTV Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/ctv" className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md">
            <Home className="w-4 h-4" /> Bảng điều khiển
          </Link>
          <Link href="/ctv/post" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <PlusCircle className="w-4 h-4" /> Đăng tin mới
          </Link>
          <Link href="/ctv/customers" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <MessageCircle className="w-4 h-4" /> Khách liên hệ (CRM)
          </Link>
          <Link href="/ctv/wallet" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <Wallet className="w-4 h-4" /> Ví thu nhập
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Bảng điều khiển CTV</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700">1.500.000đ</span>
            </div>
            <Link href="/" className="text-sm font-medium text-slate-600 border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition">
              Về Trang chủ
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          
          {/* Quick Action */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Đăng phòng trọ siêu tốc</h3>
              <p className="text-indigo-100 mt-1">Kéo thả ảnh và điền thông tin chỉ trong 1 phút.</p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-50 transition shadow-sm">
              <UploadCloud className="w-5 h-5" />
              Đăng tin ngay
            </button>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Bài đăng gần đây của bạn</h3>
              <button className="text-sm text-indigo-600 font-medium hover:underline">Xem tất cả</button>
            </div>
            <div className="divide-y divide-slate-100">
              {mockPosts.map((post) => (
                <div key={post.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="font-semibold text-slate-800">{post.title}</div>
                    <div className="text-sm text-slate-500 flex gap-4 mt-1">
                      <span>Lượt xem: {post.views}</span>
                      <span>Lượt liên hệ Zalo: {post.contacts}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {post.status === 'Active' ? 'Đang hiển thị' : 'Chờ duyệt'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
