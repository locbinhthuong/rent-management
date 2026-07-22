import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';

const BUMP_FEE = 10000; // 10,000 VNĐ cho mỗi lần đẩy tin

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const resolvedParams = await params;
    const postId = resolvedParams.id;

    // Check user package
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userPackage = user.package || 'Basic';
    if (userPackage === 'Basic') {
      return NextResponse.json({ message: 'Gói Cơ bản không hỗ trợ đẩy tin. Vui lòng nâng cấp gói Pro hoặc VIP!' }, { status: 403 });
    }

    // Verify post belongs to this CTV
    const post = await Post.findById(postId);
    if (!post || post.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Cập nhật thời gian đẩy tin
    post.bumped_at = new Date();
    if (userPackage === 'VIP') {
      post.is_vip = true;
    }
    await post.save();

    return NextResponse.json({ message: 'Đẩy tin thành công!' }, { status: 200 });
  } catch (error: any) {
    console.error('Bump post error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
