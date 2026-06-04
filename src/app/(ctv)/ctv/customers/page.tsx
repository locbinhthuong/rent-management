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
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        <header className="bg-slate-900/50 backdrop-blur-xl p-4 md:p-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-100">Khách liên hệ</h2>
          <div className="flex gap-2 w-full md:w-auto items-center flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl md:rounded-full border border-emerald-500/20 flex-1 md:flex-none justify-center">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400 text-sm">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.wallet_balance || 0)}
              </span>
            </div>
            <Link href="/" target="_blank" className="flex-1 md:flex-none text-center text-xs md:text-sm font-bold text-cyan-400 border-2 border-cyan-500/20 bg-cyan-500/10 px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition">
              Trang Khách
            </Link>
            <Link href="/api/auth/signout" className="flex-1 md:flex-none justify-center text-xs md:text-sm font-bold text-red-400 border-2 border-red-500/20 bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng xuất</span>
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8 max-w-5xl mx-auto w-full">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 bg-slate-800/50">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" /> Danh sách Khách hàng quan tâm
              </h3>
            </div>
            
            <LeadsTable initialLeads={serializedLeads} />
          </div>
        </div>
      </main>
    </div>
  );
}
