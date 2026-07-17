import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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

    // Check phone exists for the same role
    const existingPhone = await User.findOne({ phone, role });
    if (existingPhone) {
      return NextResponse.json({ message: `Số điện thoại đã được đăng ký cho tài khoản ${role === 'CTV' ? 'Môi giới' : 'Khách'}` }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define status based on role
    const initialStatus = role === 'CTV' ? 'Pending' : 'Active';

    // Generate verification code if role is CTV
    let verificationCode = undefined;
    let verificationCodeExpires = undefined;
    
    if (role === 'CTV') {
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role,
      status: initialStatus,
      wallet_balance: 0,
      verificationCode,
      verificationCodeExpires,
      isEmailVerified: role !== 'CTV', // Customer doesn't need email verification right now
    });

    if (role === 'CTV' && verificationCode) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Xác thực tài khoản Cộng Tác Viên - Quản lý Nhà trọ',
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #111827;">Xin chào ${name},</h2>
            <p style="color: #4b5563; line-height: 1.6;">Cảm ơn bạn đã đăng ký tài khoản Cộng Tác Viên. Vui lòng sử dụng mã bên dưới để xác thực email của bạn:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #4f46e5; letter-spacing: 5px; margin: 0; font-size: 32px;">${verificationCode}</h1>
            </div>
            <p style="color: #4b5563; font-size: 14px;">Mã này có hiệu lực trong vòng 15 phút.</p>
            <p style="color: #4b5563; line-height: 1.6;">Trân trọng,<br>Đội ngũ Quản lý Nhà trọ</p>
          </div>`,
        };

        await transporter.sendMail(mailOptions);
        
        return NextResponse.json(
          { 
            message: `Mã xác thực đã được gửi đến email ${email}`,
            requiresVerification: true,
            email: email
          },
          { status: 201 }
        );
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return NextResponse.json(
          { message: 'Đăng ký thành công nhưng không thể gửi email xác thực. Vui lòng liên hệ hỗ trợ.' },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(
      { message: `Đăng ký tài khoản ${role} thành công` },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi trong quá trình đăng ký' }, { status: 500 });
  }
}
