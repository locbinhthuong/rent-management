import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import Post from '@/models/Post';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, Settings, FileText, MessageCircle } from 'lucide-react';
import LeadsTable from '@/app/(ctv)/ctv/customers/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'Admin') {
    redirect('/login');
  }

  await connectDB();
  User.init();
  Post.init();
  
  const leads = await Lead.find()
    .populate('post_id', 'title')
    .populate('ctv_id', 'name phone')
    .sort({ createdAt: -1 })
    .lean();

  const serializedLeads = leads.map((lead: any) => ({
    ...lead,
    _id: lead._id.toString(),
    post_id: lead.post_id ? { ...lead.post_id, _id: lead.post_id._id.toString() } : null,
    ctv_id: lead.ctv_id ? { ...lead.ctv_id, _id: lead.ctv_id._id.toString() } : null,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt?.toISOString(),
  }));

  return (
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="bg-white/80 backdrop-blur-xl p-4 md:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Quản lý Khách hàng (Leads)</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-100/80">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" /> Tất cả khách hàng trong hệ thống ({leads.length})
              </h3>
            </div>

            <LeadsTable initialLeads={serializedLeads} isAdmin={true} />
          </div>
        </div>
      </main>
  );
}
