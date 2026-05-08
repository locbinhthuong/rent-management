'use client';

import Link from 'next/link';
import { Home, Users, FileText, Settings, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'T1', revenue: 40000000 },
  { name: 'T2', revenue: 30000000 },
  { name: 'T3', revenue: 20000000 },
  { name: 'T4', revenue: 27800000 },
  { name: 'T5', revenue: 18900000 },
  { name: 'T6', revenue: 23900000 },
  { name: 'T7', revenue: 34900000 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Admin Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 bg-indigo-600 text-white px-3 py-2 rounded-md">
            <Home className="w-4 h-4" /> Tổng quan
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition">
            <FileText className="w-4 h-4" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition">
            <Users className="w-4 h-4" /> Quản lý CTV
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Tổng quan Tài chính</h2>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-indigo-600 border border-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-50 transition">
              Xem trang Khách
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign className="w-4 h-4" /> <span>Tổng doanh thu tháng</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">124.500.000đ</div>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% so với tháng trước</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle className="w-4 h-4" /> <span>Phòng đã thuê</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">45/50</div>
              <div className="text-xs text-slate-500">Tỷ lệ lấp đầy: 90%</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" /> <span>Bài chờ duyệt</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-xs text-orange-500 font-medium">Cần duyệt ngay</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="w-4 h-4" /> <span>Cộng tác viên</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">28</div>
              <div className="text-xs text-slate-500">Đang hoạt động: 20</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Biểu đồ doanh thu 7 tháng gần nhất</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(val) => `${val / 1000000}M`} />
                  <Tooltip 
                    formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
