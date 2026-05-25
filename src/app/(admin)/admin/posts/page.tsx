import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Settings, Search, FileText } from 'lucide-react';
import PostsTable from './PostsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  await connectDB();
  User.init();
  
  // Fetch Posts
  const posts = await Post.find()
    .populate('ctv_id', 'name phone email')
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Convert ObjectIds to strings to pass to Client Component
  const serializedPosts = posts.map(p => ({
    ...p,
    _id: p._id.toString(),
    ctv_id: p.ctv_id ? { ...p.ctv_id, _id: p.ctv_id._id.toString() } : null,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString()
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            Admin Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Home className="w-5 h-5" /> Tổng quan
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-lg">
            <FileText className="w-5 h-5" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Users className="w-5 h-5" /> Quản lý CTV
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-4 md:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Duyệt bài đăng Cộng tác viên</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Quản lý tất cả Bài đăng
              </h3>
            </div>
            
            <PostsTable initialPosts={serializedPosts} />
          </div>
        </div>
      </main>
    </div>
  );
}
