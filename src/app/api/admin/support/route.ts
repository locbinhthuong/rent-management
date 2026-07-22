import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SupportRequest from '@/models/SupportRequest';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const requests = await SupportRequest.find().sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
