import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Lead from '@/models/Lead';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'CTV' && session.user.role !== 'Admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const resolvedParams = await params;
    const postId = resolvedParams.id;

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Không tìm thấy bài đăng' }, { status: 404 });
    }

    // Nếu là CTV thì chỉ được xóa bài của chính mình
    if (session.user.role === 'CTV' && post.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Xóa bài viết
    await Post.findByIdAndDelete(postId);

    // Xóa SẠCH toàn bộ Leads liên quan đến bài viết này (theo đúng yêu cầu của User)
    await Lead.deleteMany({ post_id: postId });

    return NextResponse.json({ message: 'Đã xóa bài viết và toàn bộ dữ liệu khách hàng liên quan' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}

// API duyệt bài cho Admin
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const { status, is_verified } = await req.json();
    
    const updateData: any = {};
    if (status && ['Active', 'Rejected', 'Pending'].includes(status)) {
      updateData.status = status;
    }
    if (typeof is_verified === 'boolean') {
      updateData.is_verified = is_verified;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'Không có dữ liệu cập nhật hợp lệ' }, { status: 400 });
    }

    const post = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    return NextResponse.json({ message: 'Cập nhật thành công', post }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
