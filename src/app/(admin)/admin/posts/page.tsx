import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Settings, Search, FileText, MessageCircle } from 'lucide-react';
import PostsTable from './PostsTable';
import FilterBar from '@/components/admin/FilterBar';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

async function PostsDataWrapper({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  await connectDB();
  User.init();
  
  const query: any = {};
  if (searchParams?.q) {
    query.$or = [
      { title: { $regex: searchParams.q, $options: 'i' } },
      { address: { $regex: searchParams.q, $options: 'i' } },
      { description: { $regex: searchParams.q, $options: 'i' } },
      { district: { $regex: searchParams.q, $options: 'i' } },
      { city: { $regex: searchParams.q, $options: 'i' } },
      { ward: { $regex: searchParams.q, $options: 'i' } }
    ];
  }
  if (searchParams?.room_type) {
    query.property_type = searchParams.room_type;
  }
  if (searchParams?.district) {
    query.$or = query.$or || [];
    query.$or.push(
      { district: searchParams.district },
      { address: { $regex: searchParams.district, $options: 'i' } }
    );
  }
  if (searchParams?.priceRange) {
    if (searchParams.priceRange === 'under_2m') query.price = { $lt: 2000000 };
    if (searchParams.priceRange === '2m_to_4m') query.price = { $gte: 2000000, $lte: 4000000 };
    if (searchParams.priceRange === 'over_4m') query.price = { $gt: 4000000 };
  }

  // Fetch Posts
  const posts = await Post.find(query)
    .populate('ctv_id', 'name phone email')
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Convert ObjectIds to strings to pass to Client Component
  const serializedPosts = posts.map(p => ({
    ...p,
    _id: p._id.toString(),
    room_id: p.room_id ? p.room_id.toString() : null,
    ctv_id: p.ctv_id ? { ...p.ctv_id, _id: p.ctv_id._id.toString() } : null,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
    bumped_at: p.bumped_at?.toISOString()
  }));

  return <PostsTable initialPosts={serializedPosts} />;
}

export default async function AdminPostsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="bg-white/80 backdrop-blur-xl p-4 md:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Duyệt bài đăng Cộng tác viên</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8 space-y-6">
          <FilterBar />

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-100/80">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Quản lý tất cả Bài đăng
              </h3>
            </div>
            
            <Suspense fallback={
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <span className="ml-3 text-slate-500 font-medium">Đang tải dữ liệu...</span>
              </div>
            }>
              <PostsDataWrapper searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
  );
}
