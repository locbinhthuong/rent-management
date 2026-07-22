import Link from 'next/link';
import { Plus, Search, Eye, MessageSquare, Clock, Edit2, Trash2, Rocket, Loader2, FileText } from 'lucide-react';
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
import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';
import CTVPostsFilter from '@/components/ctv/CTVPostsFilter';
import CTVPostActions from '@/components/ctv/CTVPostActions';

export const dynamic = 'force-dynamic';

function PostsSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto w-full animate-pulse">
      <CTVMobileHeader />
      <div className="h-20 bg-slate-100 rounded-2xl"></div>
      <div className="h-64 bg-slate-100 rounded-2xl"></div>
      <div className="h-64 bg-slate-100 rounded-2xl"></div>
    </div>
  );
}

async function CTVPostsContent({ userId, searchParams }: { userId: string, searchParams: any }) {
  await connectDB();
  
  const resolvedParams = await searchParams;
  let query: any = { ctv_id: userId };
  
  if (resolvedParams?.status && resolvedParams.status !== 'All') {
    if (resolvedParams.status === 'Active') {
      query.approval_status = 'Approved';
      query.rental_status = 'Available';
    }
    else if (resolvedParams.status === 'Pending') query.approval_status = 'Pending';
    else if (resolvedParams.status === 'Expired') query.approval_status = 'Rejected';
  }
  
  if (resolvedParams?.q) {
    query.$or = [
      { title: { $regex: resolvedParams.q, $options: 'i' } },
      { address: { $regex: resolvedParams.q, $options: 'i' } },
      { description: { $regex: resolvedParams.q, $options: 'i' } },
      { district: { $regex: resolvedParams.q, $options: 'i' } },
      { city: { $regex: resolvedParams.q, $options: 'i' } },
      { ward: { $regex: resolvedParams.q, $options: 'i' } }
    ];
  }

  const posts = await Post.find(query).sort({ createdAt: -1 }).lean() as any[];
  
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
        <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Quản lý tin đăng</h1>
        <p className="text-slate-600 text-sm mt-1">Xem, chỉnh sửa và cập nhật trạng thái các phòng bạn đã đăng.</p>
      </div>

      <Link 
        href="/ctv/post"
        className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-5 h-5" />
        Đăng tin mới
      </Link>

      {/* Filter and Search Container */}
      <CTVPostsFilter />

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-4 bg-white/80 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><FileText className="w-8 h-8 text-slate-500" /></div>
            <p className="text-slate-600 font-medium text-sm">Bạn chưa có bài đăng nào.</p>
          </div>
        ) : (
          posts.map((post) => {
            const isExpired = post.approval_status === 'Rejected' || post.rental_status === 'Maintenance';
            const isPending = post.approval_status === 'Pending';
            const isActive = post.approval_status === 'Approved' && post.rental_status === 'Available';

            const badgeConfig = isActive 
              ? { bg: 'bg-emerald-500', text: 'ĐÃ XUẤT BẢN' } 
              : isPending 
              ? { bg: 'bg-orange-500', text: 'CHỜ DUYỆT' } 
              : { bg: 'bg-red-500', text: 'ĐÃ HẾT HẠN' };

            return (
              <div key={post._id.toString()} className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Image */}
                <div className="relative h-48 w-full">
                  <Image 
                    src={post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 ${badgeConfig.bg} text-slate-900 text-[10px] font-bold rounded`}>
                    {badgeConfig.text}
                  </div>
                  {isExpired && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="px-4 py-2 bg-red-500/90 text-slate-900 font-bold rounded-full text-sm">
                        Đã hết hạn
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 text-[15px] line-clamp-1">{post.title}</h3>
                    <p className="text-blue-400 font-bold text-[15px] whitespace-nowrap">
                      {(post.price / 1000000).toString().replace('.', ',')}tr/th
                    </p>
                  </div>
                  <p className="text-slate-600 text-xs line-clamp-1">{post.district}, {post.city}</p>
                  
                  <div className="flex gap-4 text-slate-700 text-xs font-medium">
                    <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views || 0} lượt xem</div>
                    <div className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {leadsMap[post._id.toString()] || 0} yêu cầu</div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Clock className="w-3.5 h-3.5" /> 
                    <span>Hết hạn: 30/12/2026</span>
                  </div>

                  {/* Actions */}
                  {isActive ? (
                    <div className="pt-2">
                      <BumpButton postId={post._id.toString()} isVip={post.is_vip} />
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
                    <div className="flex gap-2">
                      <Link href={`/ctv/post/${post._id}/edit`} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-700 transition">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <CTVPostActions postId={post._id.toString()} isExpired={isExpired} />
                    </div>
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

export default async function CTVPostsPage({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const suspenseKey = JSON.stringify(resolvedParams || {});

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0 bg-slate-50">
        <Suspense key={suspenseKey} fallback={<PostsSkeleton />}>
          <CTVPostsContent userId={session.user.id} searchParams={searchParams} />
        </Suspense>
      </main>
  );
}
