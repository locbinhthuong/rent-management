import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import ChatMessage from '@/models/ChatMessage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get('post_id');
    const ctv_id = searchParams.get('ctv_id');

    if (!post_id || !ctv_id) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    await connectDB();
    const lead = await Lead.findOne({
      post_id,
      ctv_id,
      customer_id: session.user.id
    });

    if (!lead) {
      return NextResponse.json({ lead: null, messages: [] });
    }

    const messages = await ChatMessage.find({ lead_id: lead._id }).sort({ createdAt: 1 });
    return NextResponse.json({ lead, messages });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
