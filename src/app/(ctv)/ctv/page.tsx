import Link from 'next/link';
import { Home, PlusCircle, Users, Wallet, UploadCloud, MessageCircle, LogOut, Eye, CreditCard, Loader2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Lead from '@/models/Lead';
import Wishlist from '@/models/Wishlist';
import { redirect } from 'next/navigation';
import BumpButton from '@/components/BumpButton';
import PostActionButtons from '@/components/PostActionButtons';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto w-full animate-pulse">
      <div className="bg-slate-900/50 h-[200px] rounded-3xl border border-white/10 shadow-sm flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
      <div className="bg-slate-900/50 h-[400px] rounded-3xl border border-white/10 shadow-sm"></div>
    </div>
  );
}

async function CTVDashboardContent({ userId }: { userId: string }) {
  await connectDB();
  const posts = await Post.find({ ctv_id: userId }).sort({ createdAt: -1 }).lean() as any[];
  
  const leads = await Lead.find({ ctv_id: userId }).select('post_id').lean();
  const leadsMap = leads.reduce((acc: any, lead: any) => {
    const postId = lead.post_id.toString();
    acc[postId] = (acc[postId] || 0) + 1;
    return acc;
  }, {});

  const postIds = posts.map(p => p._id);
  const wishlists = await Wishlist.find({ post_id: { $in: postIds } }).select('post_id').lean();
  const wishlistsMap = wishlists.reduce((acc: any, w: any) => {
    const postId = w.post_id.toString();
    acc[postId] = (acc[postId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto w-full">
      {/* Quick Action - Futuristic Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-800 rounded-3xl p-8 md:p-10 text-white shadow-[0_20px_50px_rgba(6,182,212,0.3)] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Đăng phòng trọ siêu tốc</h3>
          <p className="text-blue-100 font-medium text-lg">Cập nhật thông tin phòng trống và tìm khách ngay.</p>
        </div>
        <Link href="/ctv/post" className="relative z-10 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <UploadCloud className="w-6 h-6" />
          Đăng tin ngay
        </Link>
      </div>

      {/* Posts List */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-100 text-xl">Bài đăng gần đây</h3>
          <div className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-full text-sm font-bold border border-white/5">{posts.length} bài</div>
        </div>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center"><PlusCircle className="w-8 h-8 text-slate-500" /></div>
            <p className="text-slate-400 font-medium">Bạn chưa có bài đăng nào. Hãy đăng tin mới nhé!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <div id={`post-${post._id.toString()}`} key={post._id.toString()} className="p-6 flex flex-col xl:flex-row xl:items-center justify-between hover:bg-white/5 transition-colors gap-6">
                <div className="flex-1">
                  <div className="font-bold text-slate-100 text-lg mb-2 flex items-center gap-3">
                    {post.title}
                    {post.status === 'Active' && (
                      <Link href={`/p/${post._id}`} target="_blank" className="text-slate-400 hover:text-cyan-400 transition-colors bg-slate-800 hover:bg-cyan-500/10 p-1.5 rounded-md border border-transparent hover:border-cyan-500/30" title="Xem bài đăng">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-white/5 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> {post.views || 0} lượt xem</div>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5"/> {leadsMap[post._id.toString()] || 0} khách liên hệ</div>
                    <div className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20 flex items-center gap-1.5"><span className="text-rose-500">❤️</span> {wishlistsMap[post._id.toString()] || 0} lượt lưu</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border shadow-sm ${
                    post.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : post.status === 'Rejected'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {post.status === 'Active' ? 'Đang hiển thị' : post.status === 'Rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                  </div>
                  
                  {post.status === 'Active' && (
                    <BumpButton postId={post._id.toString()} isVip={post.is_vip} />
                  )}
                  
                  <div className="h-8 w-px bg-white/10 hidden sm:block mx-1"></div>
                  <PostActionButtons postId={post._id.toString()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CTVDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-xl p-4 md:px-8 md:py-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight">
            Xin chào, {session?.user?.name?.split(' ').pop() || 'CTV'}
          </h2>
          <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 flex-1 md:flex-none justify-center shadow-sm">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400 text-sm">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.wallet_balance || 0)}
              </span>
            </div>
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-sm font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 rounded-xl hover:bg-cyan-500/20 transition shadow-sm">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-sm font-bold text-red-400 border border-red-500/20 bg-red-500/10 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition flex items-center gap-2 shadow-sm">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng xuất</span>
            </Link>
          </div>
        </header>

        <Suspense fallback={<DashboardSkeleton />}>
          <CTVDashboardContent userId={session.user.id} />
        </Suspense>
      </main>
  );
}
