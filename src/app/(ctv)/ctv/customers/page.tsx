import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Wallet, MessageCircle, PlusCircle, LogOut, MessageSquare, CheckCircle } from 'lucide-react';
import LeadsTable from './LeadsTable';
import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';

export const dynamic = 'force-dynamic';

export default async function CTVCustomersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  await connectDB();
  Post.init();

  const leads = await Lead.find({ ctv_id: session.user.id })
    .populate('post_id', 'title property_type')
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

  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const successLeads = leads.filter(l => l.status === 'Success').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-slate-950">
      <main className="flex-1 flex flex-col h-full pb-24 md:pb-0">
        <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
          <CTVMobileHeader />
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-100 font-space tracking-wide">Yêu cầu Tư vấn</h1>
            <p className="text-slate-400 text-sm mt-1">Quản lý và phản hồi các yêu cầu từ khách hàng cho các bài đăng của bạn.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-blue-600 rounded-2xl p-2 sm:p-4 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <div className="flex flex-col items-center gap-1 mb-1">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-center leading-tight">Mới</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-space">{newLeads}</span>
            </div>
            
            <div className="bg-slate-800 rounded-2xl p-2 sm:p-4 flex flex-col items-center justify-center text-slate-300">
              <div className="flex flex-col items-center gap-1 mb-1">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-center leading-tight text-slate-400">Đã xử lý</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-space text-white">{contactedLeads}</span>
            </div>

            <div className="bg-slate-900/50 border border-emerald-500/30 rounded-2xl p-2 sm:p-4 flex flex-col items-center justify-center text-emerald-400">
              <div className="flex flex-col items-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-center leading-tight">Xong</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-space text-emerald-400">{successLeads}</span>
            </div>
          </div>

          {/* Leads List Component */}
          <LeadsTable initialLeads={serializedLeads} />
        </div>
      </main>
    </div>
  );
}
