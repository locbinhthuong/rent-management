import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Vui lòng cung cấp email' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Email chưa được đăng ký trong hệ thống' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save to user document
    user.verificationCode = otp;
    user.verificationCodeExpires = otpExpires;
    await user.save();

    // Send email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Khôi phục mật khẩu LocusHome</h2>
        <p>Xin chào ${user.name},</p>
        <p>Bạn vừa yêu cầu khôi phục mật khẩu. Dưới đây là mã xác nhận (OTP) gồm 6 chữ số của bạn:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #06b6d4; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p>Mã này sẽ hết hạn trong vòng 15 phút.</p>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
        <br/>
        <p>Trân trọng,<br/>Đội ngũ LocusHome</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Mã xác nhận khôi phục mật khẩu - LocusHome',
      html: emailHtml
    });

    return NextResponse.json({ message: 'Mã xác nhận đã được gửi đến email của bạn' }, { status: 200 });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
