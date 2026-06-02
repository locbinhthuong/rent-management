'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import { revalidatePath } from 'next/cache';

export async function toggleWishlistAction(postId: string): Promise<{ success: boolean; isLiked: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, isLiked: false, message: 'Vui lòng đăng nhập để lưu tin' };
    }

    if (!postId) {
      return { success: false, isLiked: false, message: 'Thiếu postId' };
    }

    await connectDB();
    
    const existing = await Wishlist.findOne({ user_id: session.user.id, post_id: postId });
    if (existing) {
      // Toggle off (remove)
      await Wishlist.deleteOne({ _id: existing._id });
      revalidatePath('/saved');
      return { success: true, isLiked: false, message: 'Đã bỏ lưu tin' };
    } else {
      // Toggle on (add)
      await Wishlist.create({ user_id: session.user.id, post_id: postId });
      revalidatePath('/saved');
      return { success: true, isLiked: true, message: 'Đã lưu tin thành công' };
    }
  } catch (error: any) {
    console.error('Wishlist error:', error);
    return { success: false, isLiked: false, message: 'Lỗi hệ thống' };
  }
}
