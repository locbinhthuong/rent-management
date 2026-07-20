import Link from 'next/link';
import { Home, PlusCircle, Users, Wallet, UploadCloud, MessageCircle, LogOut, Eye, CreditCard, Loader2, List, CheckCircle, MessageSquare, Plus, FileText, Megaphone, HelpCircle, BarChart2, TrendingUp, Bell } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Lead from '@/models/Lead';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';

export const dynamic = 'force-dynamic';

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto w-full animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-32 bg-slate-100 rounded mb-2"></div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-blue-600/50 rounded-full"></div>
      </div>
      <div className="space-y-4">
        <div className="h-28 bg-slate-100 rounded-2xl"></div>
        <div className="h-28 bg-slate-100 rounded-2xl"></div>
        <div className="h-28 bg-slate-100 rounded-2xl"></div>
      </div>
    </div>
  );
}

async function CTVDashboardContent({ userId }: { userId: string }) {
  await connectDB();
  
  // Real stats using Promise.all for parallel execution
  const [totalPosts, activePosts, pendingLeads, totalLeads, postsForViews] = await Promise.all([
    Post.countDocuments({ ctv_id: userId }),
    Post.countDocuments({ ctv_id: userId, status: 'Active' }),
    Lead.countDocuments({ ctv_id: userId, status: 'New' }),
    Lead.countDocuments({ ctv_id: userId }),
    Post.find({ ctv_id: userId }).select('views').lean()
  ]);
  
  const totalViews = postsForViews.reduce((sum, post: any) => sum + (post.views || 0), 0);

  // Get current date formatted
  const today = new Date();
  const dateString = `Số liệu hôm nay, ${today.getDate()} Thg ${today.getMonth() + 1}`;
  
  const session = await getServerSession(authOptions);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto w-full">
      {/* Mobile Top Header */}
      <CTVMobileHeader title={session?.user?.name || 'CTV Admin'} avatarUrl={session?.user?.image} />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Tổng quan</h1>
          <p className="text-slate-600 text-sm mt-1">{dateString}</p>
        </div>
        <Link 
          href="/ctv/post"
          className="bg-blue-600 hover:bg-blue-500 text-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Đăng Phòng Mới
        </Link>
      </div>

      {/* Main Stats Cards */}
      <div className="space-y-4">
        {/* Total Posts */}
        <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="bg-slate-100/80 p-2 rounded-lg border border-slate-200">
              <List className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">+12%</div>
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Tổng số bài đăng</p>
            <p className="text-3xl font-bold text-slate-900 font-space">{totalPosts}</p>
          </div>
        </div>

        {/* Active Posts */}
        <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">+5%</div>
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Đang hoạt động</p>
            <p className="text-3xl font-bold text-slate-900 font-space">{activePosts}</p>
          </div>
        </div>

        {/* Pending Consults */}
        <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div className="bg-rose-500/10 text-rose-400 text-xs font-bold px-2 py-1 rounded-full">Cần xử lý</div>
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Yêu cầu tư vấn</p>
            <p className="text-3xl font-bold text-slate-900 font-space">{pendingLeads}</p>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-space mb-4">Hiệu suất hôm nay</h2>
        <div className="space-y-4">
          {/* Views */}
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Lượt xem</p>
              <p className="text-2xl font-bold text-slate-900 font-space">{new Intl.NumberFormat('vi-VN').format(totalViews)}</p>
            </div>
            <BarChart2 className="w-8 h-8 text-blue-500" />
          </div>

          {/* Potential Customers */}
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Khách hàng tiềm năng</p>
              <p className="text-2xl font-bold text-slate-900 font-space">{new Intl.NumberFormat('vi-VN').format(totalLeads)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-space mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/ctv/post" className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <PlusCircle className="w-6 h-6 text-slate-700" />
            <span className="text-xs font-medium text-slate-700">Đăng bài</span>
          </Link>
          <Link href="/ctv/customers" className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <MessageSquare className="w-6 h-6 text-orange-400" />
            <span className="text-xs font-medium text-slate-700">Tư vấn</span>
          </Link>
          <Link href="/ctv/posts" className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <Megaphone className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-medium text-slate-700">Quảng bá</span>
          </Link>
          <Link href="#" className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <HelpCircle className="w-6 h-6 text-slate-500" />
            <span className="text-xs font-medium text-slate-700">Hỗ trợ</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default async function CTVDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0 bg-slate-50">
        <Suspense fallback={<DashboardSkeleton />}>
          <CTVDashboardContent userId={session.user.id} />
        </Suspense>
      </main>
  );
}
