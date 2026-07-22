import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Vui lòng cung cấp email' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = otp;
    user.verificationCodeExpires = otpExpires;
    await user.save();

    // Setup Nodemailer
    const nodemailer = (await import('nodemailer')).default;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[MOCK EMAIL] To: ${user.email}, Verification Code: ${otp}`);
      return NextResponse.json({ message: `(MOCK) Mã xác nhận mới ${otp} đã được gửi đến email của bạn` }, { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = 'Mã xác thực - LocusHome';
    let html = '';

    if (type === 'forgot-password') {
      subject = 'Mã xác nhận khôi phục mật khẩu - LocusHome';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Khôi phục mật khẩu LocusHome</h2>
          <p>Xin chào ${user.name},</p>
          <p>Bạn vừa yêu cầu gửi lại mã khôi phục mật khẩu. Dưới đây là mã xác nhận (OTP) mới của bạn:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #06b6d4; margin: 20px 0; border-radius: 8px;">
            ${otp}
          </div>
          <p>Mã này sẽ hết hạn trong vòng 15 phút.</p>
          <p>Trân trọng,<br/>Đội ngũ LocusHome</p>
        </div>
      `;
    } else {
      subject = 'Xác thực tài khoản - Quản lý Nhà trọ';
      html = `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827;">Xin chào ${user.name},</h2>
        <p style="color: #4b5563; line-height: 1.6;">Bạn vừa yêu cầu gửi lại mã xác thực tài khoản. Vui lòng sử dụng mã bên dưới:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #4f46e5; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #4b5563; font-size: 14px;">Mã này có hiệu lực trong vòng 15 phút.</p>
        <p style="color: #4b5563; line-height: 1.6;">Trân trọng,<br>Đội ngũ Quản lý Nhà trọ</p>
      </div>`;
    }

    await transporter.sendMail({
      from: `"LocusHome" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: html
    });

    return NextResponse.json({ message: 'Mã xác nhận mới đã được gửi' }, { status: 200 });

  } catch (error: any) {
    console.error('Resend code error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
