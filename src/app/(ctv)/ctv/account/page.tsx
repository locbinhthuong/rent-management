import Link from 'next/link';
import { User, Bell, HelpCircle, Star, LogOut, ChevronRight, FileText, MessageSquare, Home, CheckCircle, Wallet, Shield } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import Post from '@/models/Post';
import Lead from '@/models/Lead';
import { redirect } from 'next/navigation';
import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';

export const dynamic = 'force-dynamic';

export default async function CTVAccountPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  const dbUser = await UserModel.findById(session.user.id).lean();
  
  // Real stats
  const totalPosts = await Post.countDocuments({ ctv_id: session.user.id });
  const totalLeads = await Lead.countDocuments({ ctv_id: session.user.id });
  
  const initial = session.user.name ? session.user.name.charAt(0).toUpperCase() : 'C';

  return (
    <main className="flex-1 bg-slate-50 min-h-screen overflow-y-auto pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <CTVMobileHeader title="Hồ sơ CTV" />
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Hồ sơ</h1>
          <p className="text-slate-600 text-sm mt-1">Quản lý thông tin cá nhân và tài khoản của bạn.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-slate-200 overflow-hidden bg-slate-100">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-900 text-slate-900">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{session.user.name}</h2>
          <p className="text-slate-600 text-sm mb-3">ID CTV: UD-84920</p>
          
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-8">
            <CheckCircle className="w-3.5 h-3.5" />
            CTV Xác Thực
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center h-[90px]">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 mb-2" />
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-space leading-tight">{totalPosts}</p>
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-600 mt-1 uppercase leading-tight">Tổng bài đăng</p>
            </div>
            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center h-[90px]">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mb-2" />
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-space leading-tight">{totalLeads}</p>
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-600 mt-1 uppercase leading-tight">Yêu cầu chờ</p>
            </div>
            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center h-[90px]">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mb-2" />
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-space leading-tight">{(dbUser?.rating || 5.0).toFixed(1)}</p>
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-600 mt-1 uppercase leading-tight">Đánh giá</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <Link href="/ctv/account/profile" className="flex items-center justify-between p-4 hover:bg-slate-100/80 transition-colors border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block">Thông tin cá nhân</span>
                <span className="text-xs text-slate-600">Cập nhật liên hệ, Mật khẩu</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>
          


          <Link href="#" className="flex items-center justify-between p-4 hover:bg-slate-100/80 transition-colors border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block">Cài đặt thông báo</span>
                <span className="text-xs text-slate-600">Lead mới, thông báo hệ thống</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>

          <Link href="#" className="flex items-center justify-between p-4 hover:bg-slate-100/80 transition-colors border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block">Bảo mật & Đăng nhập</span>
                <span className="text-xs text-slate-600">Mật khẩu, 2FA</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>

          <Link href="#" className="flex items-center justify-between p-4 hover:bg-slate-100/80 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block">Trợ giúp & Hướng dẫn CTV</span>
                <span className="text-xs text-slate-600">FAQ, Hỗ trợ trực tuyến</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>
        </div>

        <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 p-4 mt-6 bg-white/80 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-500 text-sm">Đăng xuất</span>
        </Link>
      </div>
    </main>
  );
}
