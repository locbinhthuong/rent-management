import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Settings, Search, FileText } from 'lucide-react';
import UserActionButtons from './UserActionButtons';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  await connectDB();
  
  // Fetch CTVs
  const ctvs = await User.find({ role: 'CTV' }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Same as admin/page.tsx */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            Admin Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Home className="w-5 h-5" /> Tổng quan
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <FileText className="w-5 h-5" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-lg">
            <Users className="w-5 h-5" /> Quản lý CTV
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Quản lý Cộng tác viên</h2>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" /> Danh sách CTV ({ctvs.length})
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Tìm kiếm CTV..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none w-64" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Họ và Tên</th>
                    <th className="px-6 py-4 font-medium">Liên hệ</th>
                    <th className="px-6 py-4 font-medium">Số dư ví</th>
                    <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ctvs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Chưa có Cộng tác viên nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    ctvs.map((ctv: any) => (
                      <tr key={ctv._id.toString()} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{ctv.name}</div>
                          <div className="text-xs text-slate-500 mt-1">ID: {ctv._id.toString().slice(-6)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-800">{ctv.phone || 'Chưa cập nhật'}</div>
                          <div className="text-slate-500 text-xs">{ctv.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ctv.wallet_balance || 0)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(ctv.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <UserActionButtons userId={ctv._id.toString()} currentStatus={ctv.status || 'Active'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
