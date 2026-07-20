import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import { redirect } from 'next/navigation';
import MessagesClient from './MessagesClient';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/messages');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4">
        <Link href="/" className="mr-4 p-2 -ml-2 rounded-full hover:bg-slate-200/50 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-space font-bold tracking-wide mx-auto pr-9">Danh sách tư vấn</h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-slate-500 text-sm font-medium animate-pulse">Đang tải yêu cầu tư vấn...</p>
          </div>
        }>
          <MessagesContent userId={session.user.id} role={session.user.role} />
        </Suspense>
      </main>
    </div>
  );
}

async function MessagesContent({ userId, role }: { userId: string, role: string }) {
  await connectDB();
  Post.init();

  let query = {};
  if (role === 'CTV') {
    query = { ctv_id: userId };
  } else if (role === 'User') {
    query = { customer_id: userId };
  } else if (role === 'Admin') {
    query = {}; // Admin sees all? Let's say yes for now, or maybe they shouldn't use this view.
  }

  const rawLeads = await Lead.find(query)
    .populate('post_id', 'title images')
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Map to Client props
  const leads = rawLeads.map(l => {
    let statusColor = 'text-amber-400 bg-amber-400/20 border-amber-400/30'; // Pending
    if (l.status === 'Contacted' || l.status === 'Success') {
      statusColor = 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'; // Responded
    }

    const post = l.post_id || {};
    let imageUrl = '';
    if (post.images && post.images.length > 0) {
      imageUrl = post.images[0];
    }

    // Format date beautifully
    const date = new Date(l.createdAt);
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}, ${date.getDate()}/${date.getMonth() + 1}`;

    return {
      id: l._id.toString(),
      title: post.title || 'Tin đăng đã xóa',
      image: imageUrl,
      time: timeStr,
      content: l.message || 'Không có nội dung lời nhắn.',
      status: l.status,
      statusColor: statusColor,
      customerName: role === 'CTV' || role === 'Admin' ? l.name : undefined
    };
  });

  return <MessagesClient leads={leads} />;
}
