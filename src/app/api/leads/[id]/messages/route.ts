import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
import Lead from '@/models/Lead';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const lead = await Lead.findById(resolvedParams.id);
    if (!lead) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // Validate if user has access to this lead
    if (session.user.role === 'User' && lead.customer_id?.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (session.user.role === 'CTV' && lead.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const messages = await ChatMessage.find({ lead_id: resolvedParams.id }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    if (!data.content) return NextResponse.json({ message: 'Missing content' }, { status: 400 });

    const lead = await Lead.findById(resolvedParams.id);
    if (!lead) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const newMessage = await ChatMessage.create({
      lead_id: resolvedParams.id,
      sender_id: session.user.id,
      content: data.content
    });

    lead.last_message = data.content;
    lead.last_message_at = new Date();
    await lead.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
