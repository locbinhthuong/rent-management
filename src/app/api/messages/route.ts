import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
import Lead from '@/models/Lead';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lead_id, content } = await req.json();

    if (!lead_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Verify lead exists and user has access
    const lead = await Lead.findById(lead_id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const role = session.user.role;

    if (role !== 'Admin') {
      if (role === 'CTV' && lead.ctv_id.toString() !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (role === 'User' && (!lead.customer_id || lead.customer_id.toString() !== userId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const newMessage = new ChatMessage({
      lead_id: new mongoose.Types.ObjectId(lead_id),
      sender_id: new mongoose.Types.ObjectId(userId),
      content: content
    });

    await newMessage.save();

    // Update Lead last message
    lead.last_message = content;
    lead.last_message_at = new Date();
    
    // Auto update status if CTV replies to a New lead
    if (role === 'CTV' && lead.status === 'New') {
      lead.status = 'Contacted';
    }

    await lead.save();

    return NextResponse.json({ message: newMessage }, { status: 201 });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
