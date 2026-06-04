import Link from 'next/link';
import { Plus, Search, Eye, MessageSquare, Clock, Edit2, Trash2, Rocket, Loader2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Lead from '@/models/Lead';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import BumpButton from '@/components/BumpButton';
import PostActionButtons from '@/components/PostActionButtons';

export const dynamic = 'force-dynamic';

function PostsSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto w-full animate-pulse">
      <div className="h-20 bg-slate-800 rounded-2xl"></div>
      <div className="h-64 bg-slate-800 rounded-2xl"></div>
      <div className="h-64 bg-slate-800 rounded-2xl"></div>
    </div>
  );
}

async function CTVPostsContent({ userId }: { userId: string }) {
  await connectDB();
  const posts = await Post.find({ ctv_id: userId }).sort({ createdAt: -1 }).lean() as any[];
  
  const leads = await Lead.find({ ctv_id: userId }).select('post_id').lean();
  const leadsMap = leads.reduce((acc: any, lead: any) => {
    if (lead.post_id) {
      const postId = lead.post_id.toString();
      acc[postId] = (acc[postId] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 font-space tracking-wide">Quản lý tin đăng</h1>
        <p className="text-slate-400 text-sm mt-1">Xem, chỉnh sửa và cập nhật trạng thái các phòng bạn đã đăng.</p>
      </div>

      <Link 
        href="/ctv/post"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-5 h-5" />
        Đăng tin mới
      </Link>

      {/* Filter and Search Container */}
      <div className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-2xl p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-1.5 bg-orange-400 text-white text-sm font-bold rounded-full whitespace-nowrap">Tất cả</button>
          <button className="px-4 py-1.5 text-slate-400 hover:bg-white/5 text-sm font-bold rounded-full whitespace-nowrap">Đang hoạt động</button>
          <button className="px-4 py-1.5 text-slate-400 hover:bg-white/5 text-sm font-bold rounded-full whitespace-nowrap">Chờ duyệt</button>
          <button className="px-4 py-1.5 text-slate-400 hover:bg-white/5 text-sm font-bold rounded-full whitespace-nowrap">Hết hạn</button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm theo tên đường, quận, mã tin..." 
            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-4 bg-slate-900/50 rounded-2xl border border-white/5">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center"><FileText className="w-8 h-8 text-slate-500" /></div>
            <p className="text-slate-400 font-medium text-sm">Bạn chưa có bài đăng nào.</p>
          </div>
        ) : (
          posts.map((post) => {
            const isExpired = post.status === 'Rejected' || post.status === 'Expired';
            const isPending = post.status === 'Pending';
            const isActive = post.status === 'Active';

            const badgeConfig = isActive 
              ? { bg: 'bg-emerald-500', text: 'ĐÃ XUẤT BẢN' } 
              : isPending 
              ? { bg: 'bg-orange-500', text: 'CHỜ DUYỆT' } 
              : { bg: 'bg-red-500', text: 'ĐÃ HẾT HẠN' };

            return (
              <div key={post._id.toString()} className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                {/* Image */}
                <div className="relative h-48 w-full">
                  <Image 
                    src={post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 ${badgeConfig.bg} text-white text-[10px] font-bold rounded`}>
                    {badgeConfig.text}
                  </div>
                  {isExpired && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="px-4 py-2 bg-red-500/90 text-white font-bold rounded-full text-sm">
                        Đã hết hạn
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-100 text-[15px] line-clamp-1">{post.title}</h3>
                    <p className="text-blue-400 font-bold text-[15px] whitespace-nowrap">
                      {(post.price / 1000000).toString().replace('.', ',')}tr/th
                    </p>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-1">{post.district}, {post.city}</p>
                  
                  <div className="flex gap-4 text-slate-300 text-xs font-medium">
                    <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views || 0} lượt xem</div>
                    <div className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {leadsMap[post._id.toString()] || 0} yêu cầu</div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5" /> 
                    <span>Hết hạn: 30/12/2026</span>
                  </div>

                  {/* Actions */}
                  {isActive ? (
                    <div className="pt-2">
                      <BumpButton postId={post._id.toString()} isVip={post.is_vip} />
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                    <div className="flex gap-2">
                      <Link href={`/ctv/post/${post._id}/edit`} className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 transition">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/20 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {isExpired && (
                      <button className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-500/20">
                        <Rocket className="w-3.5 h-3.5" />
                        Gia hạn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default async function CTVPostsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0 bg-slate-950">
        <Suspense fallback={<PostsSkeleton />}>
          <CTVPostsContent userId={session.user.id} />
        </Suspense>
      </main>
  );
}
