import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import ChatMessage from '@/models/ChatMessage';
import User from '@/models/User';
import Post from '@/models/Post';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium animate-pulse">Đang kết nối phòng chat...</p>
        </div>
      }>
        <ChatContent leadId={params.id} userId={session.user.id} role={session.user.role} />
      </Suspense>
    </div>
  );
}

async function ChatContent({ leadId, userId, role }: { leadId: string, userId: string, role: string }) {
  await connectDB();
  User.init();
  Post.init();

  const lead = await Lead.findById(leadId)
    .populate('post_id', 'title images')
    .populate('ctv_id', 'name avatar phone')
    .populate('customer_id', 'name avatar phone')
    .lean() as any;

  if (!lead) {
    redirect('/messages');
  }

  // Verify permission safely
  const ctvIdStr = lead.ctv_id?._id?.toString() || lead.ctv_id?.toString();
  const customerIdStr = lead.customer_id?._id?.toString() || lead.customer_id?.toString();

  if (role !== 'Admin') {
    if (role === 'CTV' && ctvIdStr !== userId) redirect('/messages');
    if (role === 'Customer' && customerIdStr !== userId) redirect('/messages');
  }

  // Fetch messages
  const rawMessages = await ChatMessage.find({ lead_id: leadId })
    .sort({ createdAt: 1 })
    .lean() as any[];

  // Map messages to flat format
  const messages = rawMessages.map(m => ({
    id: m._id.toString(),
    content: m.content,
    senderId: m.sender_id.toString(),
    isMine: m.sender_id.toString() === userId,
    createdAt: m.createdAt.toISOString()
  }));

  // Append initial lead message if it exists to give context
  if (lead.message) {
    messages.unshift({
      id: 'initial',
      content: lead.message,
      senderId: lead.customer_id ? lead.customer_id._id.toString() : 'guest',
      isMine: role === 'Customer',
      createdAt: lead.createdAt.toISOString()
    });
  }

  // Identify who we are chatting with
  let otherPerson = {
    name: 'Khách hàng',
    avatar: null,
    phone: lead.phone
  };

  if (role === 'Customer') {
    otherPerson = {
      name: lead.ctv_id?.name || 'Cộng tác viên',
      avatar: lead.ctv_id?.avatar || null,
      phone: lead.ctv_id?.phone
    };
  } else {
    // We are CTV or Admin, chatting with Customer
    otherPerson = {
      name: lead.customer_id ? lead.customer_id.name : lead.name,
      avatar: lead.customer_id ? lead.customer_id.avatar : null,
      phone: lead.phone
    };
  }

  const post = lead.post_id || {};

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4 shrink-0">
        <Link href="/messages" className="mr-4 p-2 -ml-2 rounded-full hover:bg-slate-200/50 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 flex flex-col">
          <h1 className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">{otherPerson.name}</h1>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium line-clamp-1">Về: {post.title || 'Tin đăng'}</p>
        </div>
      </header>
      
      <ChatClient 
        leadId={leadId} 
        initialMessages={messages} 
        currentUserId={userId} 
      />
    </>
  );
}
