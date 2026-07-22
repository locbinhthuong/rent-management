import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SupportRequest from '@/models/SupportRequest';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, phone, email, content } = await req.json();

    if (!name || !phone || !content) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc' }, { status: 400 });
    }

    // Save support request
    const supportReq = await SupportRequest.create({
      name,
      phone,
      email,
      content,
    });

    // Notify all admins
    const admins = await User.find({ role: 'Admin' }).select('_id');
    const adminIds = admins.map(a => a._id);

    if (adminIds.length > 0) {
      const notifications = adminIds.map(id => ({
        user_id: id,
        title: 'Yêu cầu hỗ trợ mới',
        content: `Khách hàng ${name} (${phone}) vừa gửi yêu cầu hỗ trợ.`,
        type: 'System',
        link: '/admin/support'
      }));
      await Notification.insertMany(notifications);
    }

    return NextResponse.json({ message: 'Yêu cầu của bạn đã được gửi thành công' }, { status: 201 });
  } catch (error: any) {
    console.error('Lỗi khi gửi yêu cầu hỗ trợ:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' }, { status: 500 });
  }
}
