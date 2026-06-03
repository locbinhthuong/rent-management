import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Cho phép cả Admin và CTV đăng bài
    if (!session || (session.user.role !== 'CTV' && session.user.role !== 'Admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();

    // Bắt buộc một số trường
    if (!data.title || !data.description || !data.price || !data.address) {
      return NextResponse.json({ message: 'Vui lòng điền các trường bắt buộc (Tiêu đề, Mô tả, Giá, Địa chỉ)' }, { status: 400 });
    }

    // Chuẩn bị payload
    const postPayload: any = {
      ctv_id: session.user.id,
      title: data.title,
      description: data.description,
      address: data.address,
      city: data.city,
      district: data.district,
      price: Number(data.price),
      property_type: data.property_type,
      utility_costs: data.utility_costs,
      contract_terms: data.contract_terms,
      target_audience: data.target_audience,
      images: Array.isArray(data.images) ? data.images : [data.images].filter(Boolean),
      status: 'Pending', // Mặc định phải chờ Admin duyệt
    };

    if (data.location && Array.isArray(data.location.coordinates)) {
      postPayload.location = data.location;
    }

    // Tạo Post mới
    const newPost = await Post.create(postPayload);

    return NextResponse.json({ message: 'Tạo bài đăng thành công', post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ message: 'Lỗi server khi tạo bài đăng' }, { status: 500 });
  }
}
