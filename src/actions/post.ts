'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

// No BUMP_FEE anymore

export async function bumpPostAction(postId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return { success: false, message: 'Unauthorized' };
    }

    await connectDB();
    
    // Check user package
    const ctv = await User.findById(session.user.id);
    if (!ctv) {
      return { success: false, message: 'Người dùng không tồn tại' };
    }

    const userPackage = ctv.package || 'Basic';
    if (userPackage === 'Basic') {
      return { success: false, message: 'Gói Cơ bản không hỗ trợ đẩy tin. Vui lòng nâng cấp gói Pro hoặc VIP!' };
    }

    // Cập nhật post
    const post = await Post.findOne({ _id: postId, ctv_id: session.user.id });
    if (!post) {
      return { success: false, message: 'Bài đăng không tồn tại' };
    }

    if (post.approval_status !== 'Approved' || post.rental_status !== 'Available') {
      return { success: false, message: 'Chỉ có thể đẩy bài đăng đang xuất bản' };
    }

    post.bumped_at = new Date();
    if (userPackage === 'VIP') {
      post.is_vip = true;
    }
    
    // Làm mới updatedAt để bài nổi lên đầu (dự phòng)
    post.updatedAt = new Date();
    await post.save();

    revalidatePath('/ctv');
    revalidatePath('/');
    
    return { success: true, message: 'Đã đẩy bài thành công (VIP 7 ngày)' };
  } catch (error: any) {
    console.error('Bump post error:', error);
    return { success: false, message: 'Lỗi hệ thống' };
  }
}

export async function deletePostAction(postId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return { success: false, message: 'Unauthorized' };
    }

    await connectDB();
    const result = await Post.deleteOne({ _id: postId, ctv_id: session.user.id });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Không tìm thấy bài đăng hoặc bạn không có quyền xóa' };
    }

    revalidatePath('/ctv');
    return { success: true, message: 'Xóa bài đăng thành công' };
  } catch (error: any) {
    console.error('Delete post error:', error);
    return { success: false, message: 'Lỗi hệ thống' };
  }
}
