import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LayoutDashboard, ArrowLeft, Heart } from 'lucide-react';
import Image from 'next/image';

// Client component wrapper for split screen state
import MapSearchClient from './MapSearchClient';



export const revalidate = 60;

async function getActivePosts() {
  await connectDB();
  User.init(); // Ensure user model is registered

  const query: any = { status: 'Active' };

  // Just fetch latest 50 posts for the map
  const posts = await Post.find(query)
    .populate('ctv_id', 'name phone')
    .sort({ is_vip: -1, bumped_at: -1, createdAt: -1 })
    .limit(50)
    .lean() as any[];

  // Convert ObjectIds to strings to pass to client components safely
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    ctv_id: post.ctv_id ? { ...post.ctv_id, _id: post.ctv_id._id.toString() } : null
  }));
}

export default async function MapSearchPage() {
  const posts = await getActivePosts();
  const session = await getServerSession(authOptions);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Glassmorphism Header */}
      <header className="h-16 shrink-0 bg-white/70 backdrop-blur-xl z-50 border-b border-white/40 shadow-sm flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-200/50 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="thuenhatro.com" width={160} height={40} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/saved" className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-semibold text-sm text-slate-600">
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">Đã lưu</span>
          </Link>
          
          <div className="w-px h-5 bg-slate-300 mx-1"></div>
          
          {session ? (
            <div className="flex items-center gap-3">
              <Link 
                href={session.user?.role === 'Admin' ? '/admin' : session.user?.role === 'CTV' ? '/ctv' : '/'}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white"
                title="Bảng điều khiển"
              >
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </Link>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow text-sm"
            >
              Đăng Nhập
            </Link>
          )}
        </nav>
      </header>

      {/* Main Split Content */}
      <MapSearchClient posts={posts} />
    </div>
  );
}
