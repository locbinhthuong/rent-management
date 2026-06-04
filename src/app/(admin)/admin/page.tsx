import Link from 'next/link';
import { Home, Users, FileText, Settings, DollarSign, TrendingUp, CheckCircle, Clock, LogOut, MessageCircle, Loader2 } from 'lucide-react';
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
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 shadow-sm h-36 flex flex-col justify-between">
            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            <div className="h-8 bg-slate-700/50 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900/50 h-[400px] rounded-3xl border border-white/10 shadow-sm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    </div>
  );
}

async function AdminDashboardContent() {
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
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-4 hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span>Doanh thu thu tiền</span>
            <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20"><DollarSign className="w-5 h-5 text-cyan-400" /></div>
          </div>
          <div className="text-3xl font-black text-slate-100 tracking-tight">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </div>
          <div className="text-sm text-cyan-400 font-bold flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Đã ghi nhận</div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-4 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span>Phòng đã thuê</span>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <div className="text-3xl font-black text-slate-100 tracking-tight">{rentedRoomsCount}/{totalRoomsCount}</div>
          <div className="text-sm text-slate-400 font-medium">Tỷ lệ lấp đầy: <span className="text-emerald-400 font-bold">{occupancyRate}%</span></div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-4 hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span>Bài chờ duyệt</span>
            <div className="bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20"><Clock className="w-5 h-5 text-orange-400" /></div>
          </div>
          <div className="text-3xl font-black text-slate-100 tracking-tight">{pendingPostsCount}</div>
          <div className="text-sm text-orange-400 font-bold">Cần kiểm tra ngay</div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-4 hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span>Cộng tác viên</span>
            <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20"><Users className="w-5 h-5 text-blue-400" /></div>
          </div>
          <div className="text-3xl font-black text-slate-100 tracking-tight">{ctvCount}</div>
          <div className="text-sm text-slate-400 font-medium">Đang hoạt động</div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h3 className="text-xl font-extrabold text-slate-100 mb-6">Thống kê dữ liệu</h3>
        {leadStats.length > 0 ? (
          <AdminCharts leadStats={leadStats} />
        ) : (
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
            <FileText className="w-12 h-12 text-slate-600" />
            <p className="text-slate-400 font-medium">Chưa có dữ liệu Khách hàng để hiển thị biểu đồ.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-md p-4 md:px-8 md:py-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30">
          <h2 className="text-lg md:text-2xl font-extrabold text-slate-100 tracking-tight">
            Xin chào, {session?.user?.name?.split(' ').pop() || 'Admin'}
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-sm font-bold text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-sm font-bold text-red-400 bg-red-500/10 px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2 border border-red-500/20">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Link>
          </div>
        </header>

        <Suspense fallback={<DashboardSkeleton />}>
          <AdminDashboardContent />
        </Suspense>
      </main>
  );
}
