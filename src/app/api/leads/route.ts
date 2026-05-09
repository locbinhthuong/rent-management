import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.name || !data.phone || !data.post_id || !data.ctv_id) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const newLead = await Lead.create({
      post_id: data.post_id,
      ctv_id: data.ctv_id,
      name: data.name,
      phone: data.phone,
      message: data.message || '',
      status: 'New',
    });

    return NextResponse.json({ message: 'Gửi thành công', lead: newLead }, { status: 201 });
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
