import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Wallet, MessageCircle, PlusCircle, LogOut } from 'lucide-react';
import LeadsTable from './LeadsTable';

export const dynamic = 'force-dynamic';

export default async function CTVCustomersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  Post.init();
  const user = await User.findById(session.user.id).lean();

  const leads = await Lead.find({ ctv_id: session.user.id })
    .populate('post_id', 'title')
    .sort({ createdAt: -1 })
    .lean() as any[];

  const serializedLeads = leads.map(l => ({
    ...l,
    _id: l._id.toString(),
    post_id: l.post_id ? { ...l.post_id, _id: l.post_id._id.toString() } : null,
    ctv_id: l.ctv_id.toString(),
    createdAt: l.createdAt?.toISOString(),
    updatedAt: l.updatedAt?.toISOString()
  }));

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
          <Link href="/ctv" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <Home className="w-4 h-4" /> Bảng điều khiển
          </Link>
          <Link href="/ctv/post" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <PlusCircle className="w-4 h-4" /> Đăng tin mới
          </Link>
          <Link href="/ctv/customers" className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md">
            <MessageCircle className="w-4 h-4" /> Khách liên hệ
          </Link>
          <Link href="/ctv/wallet" className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition">
            <Wallet className="w-4 h-4" /> Ví thu nhập
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-4 md:p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Khách liên hệ</h2>
          <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl md:rounded-full border border-emerald-100 flex-1 md:flex-none justify-center">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700 text-sm">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.wallet_balance || 0)}
              </span>
            </div>
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-xs md:text-sm font-bold text-indigo-600 border-2 border-indigo-100 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-xs md:text-sm font-bold text-red-600 border-2 border-red-100 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng xuất</span>
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" /> Danh sách Khách hàng quan tâm
              </h3>
            </div>
            
            <LeadsTable initialLeads={serializedLeads} />
          </div>
        </div>
      </main>
    </div>
  );
}
