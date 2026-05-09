import Link from 'next/link';
import { Home, Users, FileText, Settings, DollarSign, TrendingUp, CheckCircle, Clock, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Room from '@/models/Room';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  await connectDB();
  
  // Fetch stats from DB
  const pendingPostsCount = await Post.countDocuments({ status: 'Pending' });
  const rentedRoomsCount = await Room.countDocuments({ status: 'Rented' });
  const totalRoomsCount = await Room.countDocuments();
  const ctvCount = await User.countDocuments({ role: 'CTV' });
  
  // Doanh thu (Ví dụ: tính tổng các transaction "Thu tiền phòng")
  const revenueTransactions = await Transaction.aggregate([
    { $match: { type: 'Thu tiền phòng', status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = revenueTransactions.length > 0 ? revenueTransactions[0].total : 0;
  
  const occupancyRate = totalRoomsCount > 0 ? Math.round((rentedRoomsCount / totalRoomsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            Admin Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-lg">
            <Home className="w-5 h-5" /> Tổng quan
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <FileText className="w-5 h-5" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Users className="w-5 h-5" /> Quản lý CTV
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Xin chào, Quản trị viên {session.user.name.split(' ')[session.user.name.split(' ').length - 1]}
          </h2>
          <div className="flex gap-4">
            <Link href="/" target="_blank" className="text-sm font-bold text-indigo-600 border-2 border-indigo-100 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition">
              Xem trang Khách
            </Link>
            <Link href="/api/auth/signout" className="text-sm font-bold text-red-600 border-2 border-red-100 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <div className="bg-indigo-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-indigo-600" /></div>
                <span>Doanh thu thu tiền</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
              </div>
              <div className="text-sm text-emerald-600 font-bold flex items-center gap-1"><TrendingUp className="w-4 h-4"/> Đã ghi nhận trong hệ thống</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                <span>Phòng đã thuê</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800">{rentedRoomsCount}/{totalRoomsCount}</div>
              <div className="text-sm text-slate-500 font-medium">Tỷ lệ lấp đầy: <span className="text-emerald-600 font-bold">{occupancyRate}%</span></div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <div className="bg-orange-100 p-2 rounded-lg"><Clock className="w-5 h-5 text-orange-600" /></div>
                <span>Bài chờ duyệt</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800">{pendingPostsCount}</div>
              <div className="text-sm text-orange-500 font-bold">Cần kiểm tra ngay</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <div className="bg-blue-100 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                <span>Cộng tác viên</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800">{ctvCount}</div>
              <div className="text-sm text-slate-500 font-medium">CTV đang hoạt động</div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Thống kê chung</h3>
            <p className="text-slate-500 mb-6">Hệ thống đang hoạt động ổn định. Các dữ liệu được cập nhật theo thời gian thực từ Database.</p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center">
              <p className="text-slate-400">Khu vực hiển thị biểu đồ chi tiết đang được xây dựng thêm.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
