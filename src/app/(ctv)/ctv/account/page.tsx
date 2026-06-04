import Link from 'next/link';
import { User, Bell, HelpCircle, Star, LogOut, ChevronRight, FileText, MessageSquare } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import Post from '@/models/Post';
import Lead from '@/models/Lead';
import { redirect } from 'next/navigation';

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
    <main className="flex-1 bg-slate-950 min-h-screen overflow-y-auto pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-space tracking-wide">Hồ sơ</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý thông tin cá nhân và tài khoản của bạn.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20 border-2 border-white/10">
              {initial}
            </div>
            <h2 className="text-xl font-bold text-slate-100">{session.user.name}</h2>
            <div className="mt-2 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Cộng tác viên Bạc
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
            <div className="text-center">
              <p className="text-slate-400 text-xs font-medium mb-1">Bài đăng</p>
              <p className="text-xl font-bold text-slate-100 font-space">{totalPosts}</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">Đánh giá <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></p>
              <p className="text-xl font-bold text-slate-100 font-space">4.8</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs font-medium mb-1">Lượt tư vấn</p>
              <p className="text-xl font-bold text-slate-100 font-space">{totalLeads}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-sm">
          <Link href="#" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200 text-sm">Thông tin cá nhân</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>
          
          <Link href="#" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200 text-sm">Cài đặt thông báo</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>

          <Link href="#" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200 text-sm">Hướng dẫn CTV</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>

          <Link href="#" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-purple-400">
                <Star className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200 text-sm">Nâng cấp hạng</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>
          
          <Link href="/api/auth/signout" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-red-500 text-sm">Đăng xuất</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </Link>
        </div>
      </div>
    </main>
  );
}
