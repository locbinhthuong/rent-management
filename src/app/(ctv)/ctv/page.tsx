import Link from 'next/link';
import { Home, PlusCircle, Users, Wallet, UploadCloud, MessageCircle, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Lead from '@/models/Lead';
import { redirect } from 'next/navigation';
import BumpButton from '@/components/BumpButton';
import { Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CTVDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  const posts = await Post.find({ ctv_id: session.user.id }).sort({ createdAt: -1 }).lean() as any[];
  
  // Tính số lượng leads (khách liên hệ) cho mỗi bài đăng
  const leads = await Lead.find({ ctv_id: session.user.id }).select('post_id').lean();
  const leadsMap = leads.reduce((acc: any, lead: any) => {
    const postId = lead.post_id.toString();
    acc[postId] = (acc[postId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
            <Users className="w-5 h-5" />
            CTV Portal
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link href="/ctv" className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md">
            <Home className="w-4 h-4" /> Bảng điều khiển
          </Link>
          <Link href="/ctv/post" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <PlusCircle className="w-4 h-4" /> Đăng tin mới
          </Link>
          <Link href="/ctv/customers" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <MessageCircle className="w-4 h-4" /> Khách liên hệ
          </Link>
          <Link href="/ctv/wallet" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <Wallet className="w-4 h-4" /> Ví thu nhập
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Xin chào, Cộng tác viên {session?.user?.name?.split(' ').pop() || ''}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.wallet_balance || 0)}
              </span>
            </div>
            <Link href="/api/auth/signout" className="text-sm font-medium text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded hover:bg-red-100 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Quick Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Đăng phòng trọ siêu tốc</h3>
              <p className="text-indigo-100">Cập nhật thông tin phòng trống và đăng bài tìm khách ngay.</p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 hover:scale-105 transition shadow-sm">
              <UploadCloud className="w-5 h-5" />
              Đăng tin ngay
            </button>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Bài đăng gần đây của bạn</h3>
              <span className="text-sm text-slate-500 font-medium">{posts.length} bài đăng</span>
            </div>
            
            {posts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Bạn chưa có bài đăng nào. Hãy đăng tin mới để tìm khách nhé!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <div key={post._id.toString()} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <div className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                        {post.title}
                        {post.status === 'Active' && (
                          <Link href={`/p/${post._id}`} target="_blank" className="text-slate-400 hover:text-indigo-600 transition" title="Xem chi tiết bài đăng trên web">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 flex gap-4">
                        <span>Lượt xem: <strong className="text-slate-700">{post.views || 0}</strong></span>
                        <span>Khách liên hệ: <strong className="text-emerald-600">{leadsMap[post._id.toString()] || 0}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
