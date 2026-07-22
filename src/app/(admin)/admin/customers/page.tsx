import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Settings, Search, FileText, MessageCircle } from 'lucide-react';
import UserActionButtons from '../users/UserActionButtons';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

async function UsersDataWrapper() {
  await connectDB();
  const customers = await User.find({ role: 'Customer' }).sort({ createdAt: -1 }).lean();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">Họ và Tên</th>
            <th className="px-6 py-4 font-medium">Liên hệ</th>
            <th className="px-6 py-4 font-medium">Ngày tham gia</th>
            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {customers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-600">
                Chưa có Khách hàng nào đăng ký tài khoản trong hệ thống.
              </td>
            </tr>
          ) : (
            customers.map((customer: any) => (
              <tr key={customer._id.toString()} className="hover:bg-slate-200/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{customer.name}</div>
                  <div className="text-xs text-slate-600 mt-1">ID: {customer._id.toString().slice(-6)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{customer.phone || 'Chưa cập nhật'}</div>
                  <div className="text-slate-600 text-xs">{customer.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <UserActionButtons user={{
                    _id: customer._id.toString(),
                    name: customer.name,
                    phone: customer.phone || '',
                    avatar: customer.avatar || '',
                    role: customer.role,
                    status: customer.status || 'active'
                  }} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="bg-white/80 backdrop-blur-xl p-4 md:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Quản lý Khách hàng</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-slate-100/80">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Danh sách Khách hàng
              </h3>
              <div className="relative w-full md:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type="text" placeholder="Tìm kiếm Khách hàng..." className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-full md:w-64 placeholder:text-slate-500" />
              </div>
            </div>

            <Suspense fallback={
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <span className="ml-3 text-slate-500 font-medium">Đang tải dữ liệu...</span>
              </div>
            }>
              <UsersDataWrapper />
            </Suspense>
          </div>
        </div>
      </main>
  );
}
