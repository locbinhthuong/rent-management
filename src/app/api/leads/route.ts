import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    const data = await req.json();

    if (!data.post_id || !data.ctv_id || !data.name || !data.phone) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const newLead = await Lead.create({
      post_id: data.post_id,
      ctv_id: data.ctv_id,
      customer_id: session?.user?.id || null,
      name: data.name,
      phone: data.phone,
      message: data.message || '',
      status: 'New',
    });

    const ctv = await User.findById(data.ctv_id).select('phone name');

    return NextResponse.json({ 
      message: 'Gửi thành công', 
      lead: newLead,
      ctvPhone: ctv?.phone || 'Đang cập nhật',
      ctvName: ctv?.name || 'Cộng tác viên'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['CTV', 'Admin'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    let query = {};
    if (session.user.role === 'CTV') {
      query = { ctv_id: session.user.id };
    }

    const leads = await Lead.find(query)
      .populate('post_id', 'title')
      .populate('ctv_id', 'name phone')
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
