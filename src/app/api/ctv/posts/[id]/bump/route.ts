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

    // Check user wallet
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if ((user.wallet_balance || 0) < BUMP_FEE) {
      return NextResponse.json({ message: `Số dư không đủ. Phí đẩy tin là ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(BUMP_FEE)}` }, { status: 400 });
    }

    // Verify post belongs to this CTV and is Active
    const post = await Post.findById(postId);
    if (!post || post.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (post.status !== 'Active') {
      return NextResponse.json({ message: 'Chỉ có thể đẩy các tin đang hoạt động' }, { status: 400 });
    }

    // Deduct fee and update post
    user.wallet_balance -= BUMP_FEE;
    await user.save();

    post.bumped_at = new Date();
    post.is_vip = true; // Có thể set VIP nếu muốn, hoặc chỉ cập nhật bumped_at
    await post.save();

    return NextResponse.json({ message: 'Đẩy tin thành công', balance: user.wallet_balance }, { status: 200 });
  } catch (error: any) {
    console.error('Bump post error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
