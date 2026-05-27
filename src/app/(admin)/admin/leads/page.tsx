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
          <Link href="/admin/posts" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <FileText className="w-5 h-5" /> Duyệt bài đăng
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Users className="w-5 h-5" /> Quản lý CTV
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-lg">
            <MessageCircle className="w-5 h-5" /> Quản lý Khách hàng
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Settings className="w-5 h-5" /> Cấu hình Web
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white p-4 md:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Quản lý Khách hàng (Leads)</h2>
        </header>

        <div className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" /> Tất cả khách hàng trong hệ thống ({leads.length})
              </h3>
            </div>

            <LeadsTable initialLeads={serializedLeads} isAdmin={true} />
          </div>
        </div>
      </main>
    </div>
  );
}
