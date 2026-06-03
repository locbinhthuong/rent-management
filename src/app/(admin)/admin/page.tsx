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
    <div className="min-h-screen bg-slate-50 flex pb-16 md:pb-0 relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/50 rounded-full blur-[100px] pointer-events-none opacity-10 z-0" />

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col relative z-20 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black flex items-center gap-3">
            <Settings className="w-7 h-7 text-indigo-400" />
            Admin Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-semibold">
          <Link href="/admin" className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Home className="w-5 h-5" /> Tổng quan
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
            <Users className="w-5 h-5" /> Quản lý CTV
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
            <MessageCircle className="w-5 h-5" /> Quản lý Khách hàng
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" /> Cấu hình Web
          </Link>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 text-slate-400 flex items-center justify-around z-50 px-2 py-3 border-t border-white/10 backdrop-blur-xl bg-slate-900/90 shadow-[0_-10px_30px_rgba(0,0,0,0.2)] pb-safe">
        <Link href="/admin" className="flex flex-col items-center gap-1 text-indigo-400 p-2">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Tổng quan</span>
        </Link>
        <Link href="/admin/posts" className="flex flex-col items-center gap-1 hover:text-white p-2 transition-colors">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Duyệt bài</span>
        </Link>
        <Link href="/admin/users" className="flex flex-col items-center gap-1 hover:text-white p-2 transition-colors">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Quản lý CTV</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center gap-1 hover:text-white p-2 transition-colors">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Cấu hình</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
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
    </div>
  );
}
