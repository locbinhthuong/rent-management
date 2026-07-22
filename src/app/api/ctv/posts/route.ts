import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { postService } from '@/services/post.service';

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
      area_sqm: data.area_sqm ? Number(data.area_sqm) : undefined,
      electricity_price: data.electricity_price ? Number(data.electricity_price) : undefined,
      water_price: data.water_price ? Number(data.water_price) : undefined,
      service_price: data.service_price ? Number(data.service_price) : undefined,
      contract_terms: data.contract_terms,
      target_audience: data.target_audience,
      images: Array.isArray(data.images) ? data.images : [data.images].filter(Boolean),
      amenities: data.amenities || [],
      approval_status: 'Pending', // Mặc định phải chờ Admin duyệt
      rental_status: 'Available',
    };

    if (data.location && Array.isArray(data.location.coordinates)) {
      postPayload.location = data.location;
    }

    // Tạo Post mới thông qua Service
    const newPost = await postService.createPost(postPayload);

    // Thông báo cho tất cả Admin
    if (session.user.role === 'CTV') {
      const User = (await import('@/models/User')).default;
      const Notification = (await import('@/models/Notification')).default;
      const admins = await User.find({ role: 'Admin' });
      if (admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin._id,
          title: 'Bài đăng mới cần duyệt',
          content: `Cộng tác viên ${session.user.name || 'ẩn danh'} vừa gửi yêu cầu đăng phòng mới.`,
          type: 'Post',
          link: `/admin/posts`
        }));
        await Notification.insertMany(notifications);
      }
    }

    return NextResponse.json({ message: 'Tạo bài đăng thành công', post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ message: 'Lỗi server khi tạo bài đăng' }, { status: 500 });
  }
}
