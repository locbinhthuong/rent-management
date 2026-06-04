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

export default async function AdminPostsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  await connectDB();
  User.init();
  
  const query: any = {};
  if (searchParams?.q) {
    query.$or = [
      { title: { $regex: searchParams.q, $options: 'i' } },
      { address: { $regex: searchParams.q, $options: 'i' } }
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

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="bg-slate-900/50 backdrop-blur-xl p-4 md:p-5 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-100">Duyệt bài đăng Cộng tác viên</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8 space-y-6">
          <FilterBar />

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Quản lý tất cả Bài đăng
              </h3>
            </div>
            
            <PostsTable initialPosts={serializedPosts} />
          </div>
        </div>
      </main>
  );
}
