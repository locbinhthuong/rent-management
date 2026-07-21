import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Vui lòng đăng nhập để thực hiện' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    if (!data.post_id || !data.ctv_id) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Lấy thông tin khách hàng từ DB
    const customer = await User.findById(session.user.id).select('name phone');
    if (!customer) {
      return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
    }

    let isNewLead = false;
    let lead = await Lead.findOne({
      post_id: data.post_id,
      ctv_id: data.ctv_id,
      customer_id: session.user.id
    });

    if (!lead) {
      isNewLead = true;
      lead = await Lead.create({
        post_id: data.post_id,
        ctv_id: data.ctv_id,
        customer_id: session.user.id,
        name: customer.name,
        phone: customer.phone || 'Chưa cập nhật',
        message: data.message || '', // Keep for legacy
        status: 'New',
        last_message: data.message,
        last_message_at: new Date()
      });
    } else if (data.message) {
      lead.last_message = data.message;
      lead.last_message_at = new Date();
      await lead.save();
    }

    if (data.message) {
      const ChatMessage = (await import('@/models/ChatMessage')).default;
      await ChatMessage.create({
        lead_id: lead._id,
        sender_id: session.user.id,
        content: data.message
      });
    }

    const ctv = await User.findById(data.ctv_id).select('phone name email email_notifications');

    // Create Notification in DB
    if (data.message || isNewLead) {
      const Notification = (await import('@/models/Notification')).default;
      await Notification.create({
        user_id: data.ctv_id,
        title: isNewLead ? 'Yêu cầu tư vấn mới' : 'Tin nhắn mới',
        content: `Khách hàng ${customer.name} vừa gửi cho bạn một ${isNewLead ? 'yêu cầu tư vấn' : 'tin nhắn'}.`,
        type: 'Lead',
        link: `/messages/${lead._id}`
      });

      // Send Email if enabled
      if (ctv && ctv.email && ctv.email_notifications !== false) {
        const { sendEmail } = await import('@/lib/mailer');
        // Send email asynchronously without blocking the response
        sendEmail({
          to: ctv.email,
          subject: isNewLead ? 'Bạn có khách hàng mới trên LocusHome' : 'Bạn có tin nhắn mới trên LocusHome',
          html: `<p>Chào <b>${ctv.name}</b>,</p>
                 <p>Khách hàng <b>${customer.name}</b> vừa liên hệ với bạn trên hệ thống LocusHome.</p>
                 <p>Lời nhắn: <i>"${data.message || 'Xin chào, mình muốn thuê phòng này!'}"</i></p>
                 <p>Vui lòng đăng nhập vào trang quản lý của LocusHome để phản hồi lại khách hàng ngay nhé!</p>
                 <br>
                 <p><i>Bạn có thể tắt thông báo qua email trong phần Cài đặt Hồ sơ.</i></p>`
        }).catch(err => console.error('Error sending email:', err));
      }
    }

    return NextResponse.json({ 
      message: 'Gửi thành công', 
      lead: lead,
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
