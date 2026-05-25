import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !password || !phone || !role) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    if (role !== 'Customer' && role !== 'CTV') {
      return NextResponse.json({ message: 'Quyền không hợp lệ' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email đã được đăng ký trong hệ thống' }, { status: 400 });
    }

    // Check phone exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json({ message: 'Số điện thoại đã được sử dụng' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role,
      wallet_balance: 0,
    });

    return NextResponse.json(
      { message: `Đăng ký tài khoản ${role} thành công` },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi trong quá trình đăng ký' }, { status: 500 });
  }
}
