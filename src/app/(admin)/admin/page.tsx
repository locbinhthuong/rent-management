import Link from 'next/link';
import { Home, Users, FileText, Settings, DollarSign, TrendingUp, CheckCircle, Clock, LogOut, MessageCircle } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Room from '@/models/Room';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Lead from '@/models/Lead';
import DepositRequest from '@/models/DepositRequest';
import { redirect } from 'next/navigation';
import AdminCharts from './AdminCharts';

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
  
  const approvedDeposits = await DepositRequest.aggregate([
    { $match: { status: 'Approved' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = approvedDeposits.length > 0 ? approvedDeposits[0].total : 0;
  
  const leadStats = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const occupancyRate = totalRoomsCount > 0 ? Math.round((rentedRoomsCount / totalRoomsCount) * 100) : 0;

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md p-4 md:px-8 md:py-6 border-b border-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30">
          <h2 className="text-lg md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Xin chào, {session?.user?.name?.split(' ').pop() || 'Admin'}
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-sm font-bold text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-sm font-bold text-red-600 bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm border border-red-100">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-lg flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Doanh thu thu tiền</span>
                <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100"><DollarSign className="w-5 h-5 text-indigo-600" /></div>
              </div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
              </div>
              <div className="text-sm text-emerald-600 font-bold flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Đã ghi nhận</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-lg flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Phòng đã thuê</span>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
              </div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">{rentedRoomsCount}/{totalRoomsCount}</div>
              <div className="text-sm text-slate-500 font-medium">Tỷ lệ lấp đầy: <span className="text-emerald-600 font-bold">{occupancyRate}%</span></div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-lg flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Bài chờ duyệt</span>
                <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100"><Clock className="w-5 h-5 text-orange-600" /></div>
              </div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">{pendingPostsCount}</div>
              <div className="text-sm text-orange-500 font-bold">Cần kiểm tra ngay</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-lg flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Cộng tác viên</span>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100"><Users className="w-5 h-5 text-blue-600" /></div>
              </div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">{ctvCount}</div>
              <div className="text-sm text-slate-500 font-medium">Đang hoạt động</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-lg">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6">Thống kê dữ liệu</h3>
            {leadStats.length > 0 ? (
              <AdminCharts leadStats={leadStats} />
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <FileText className="w-12 h-12 text-slate-300" />
                <p className="text-slate-500 font-medium">Chưa có dữ liệu Khách hàng để hiển thị biểu đồ.</p>
              </div>
            )}
          </div>
        </div>
      </main>
}
