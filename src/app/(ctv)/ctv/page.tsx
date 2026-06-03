import Link from 'next/link';
import { Home, PlusCircle, Users, Wallet, UploadCloud, MessageCircle, LogOut, Eye, CreditCard } from 'lucide-react';
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

export const dynamic = 'force-dynamic';

export default async function CTVDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  const posts = await Post.find({ ctv_id: session.user.id }).sort({ createdAt: -1 }).lean() as any[];
  
  const leads = await Lead.find({ ctv_id: session.user.id }).select('post_id').lean();
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
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-xl p-4 md:px-8 md:py-6 border-b border-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Xin chào, {session?.user?.name?.split(' ').pop() || 'CTV'}
          </h2>
          <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex-1 md:flex-none justify-center shadow-sm">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700 text-sm">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.wallet_balance || 0)}
              </span>
            </div>
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-sm font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition shadow-sm">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-sm font-bold text-red-600 border border-red-100 bg-red-50 px-4 py-2.5 rounded-xl hover:bg-red-100 transition flex items-center gap-2 shadow-sm">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng xuất</span>
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto w-full">
          {/* Quick Action - Futuristic Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 md:p-10 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Đăng phòng trọ siêu tốc</h3>
              <p className="text-indigo-100/90 font-medium text-lg">Cập nhật thông tin phòng trống và tìm khách ngay.</p>
            </div>
            <Link href="/ctv/post" className="relative z-10 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <UploadCloud className="w-6 h-6" />
              Đăng tin ngay
            </Link>
          </div>

          {/* Posts List */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-xl">Bài đăng gần đây</h3>
              <div className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">{posts.length} bài</div>
            </div>
            
            {posts.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><PlusCircle className="w-8 h-8 text-slate-300" /></div>
                <p className="text-slate-500 font-medium">Bạn chưa có bài đăng nào. Hãy đăng tin mới nhé!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/60">
                {posts.map((post) => (
                  <div key={post._id.toString()} className="p-6 flex flex-col xl:flex-row xl:items-center justify-between hover:bg-slate-50/50 transition-colors gap-6">
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-3">
                        {post.title}
                        {post.status === 'Active' && (
                          <Link href={`/p/${post._id}`} target="_blank" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 p-1.5 rounded-md" title="Xem bài đăng">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> {post.views || 0} lượt xem</div>
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5"/> {leadsMap[post._id.toString()] || 0} khách liên hệ</div>
                        <div className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100 flex items-center gap-1.5"><span className="text-rose-500">❤️</span> {wishlistsMap[post._id.toString()] || 0} lượt lưu</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold border shadow-sm ${
                        post.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : post.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {post.status === 'Active' ? 'Đang hiển thị' : post.status === 'Rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                      </div>
                      
                      {post.status === 'Active' && (
                        <BumpButton postId={post._id.toString()} isVip={post.is_vip} />
                      )}
                      
                      <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>
                      <PostActionButtons postId={post._id.toString()} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
