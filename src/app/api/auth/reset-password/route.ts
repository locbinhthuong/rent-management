import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: 'Vui lòng cung cấp đủ thông tin' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Mã xác nhận không chính xác' }, { status: 400 });
    }

    if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires) {
      return NextResponse.json({ message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    
    // Also set isEmailVerified to true if not already, just as a bonus since they verified ownership
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    await user.save();

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' }, { status: 200 });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
