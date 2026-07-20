import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: 'Vui lòng cung cấp email và mã xác thực' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy tài khoản' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Tài khoản đã được xác thực trước đó' }, { status: 400 });
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json({ message: 'Mã xác thực không hợp lệ' }, { status: 400 });
    }

    if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires) {
      return NextResponse.json({ message: 'Mã xác thực đã hết hạn' }, { status: 400 });
    }

    // Verify successfully
    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    
    // Auto-approve account once email is verified
    user.status = 'Active';
    
    await user.save();

    return NextResponse.json(
      { message: 'Xác thực email thành công' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi trong quá trình xác thực' }, { status: 500 });
  }
}
