import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const wishlists = await Wishlist.find({ user_id: session.user.id })
      .populate('post_id')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ wishlists });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Vui lòng đăng nhập để lưu tin' }, { status: 401 });
    }

    const { post_id } = await req.json();
    if (!post_id) {
      return NextResponse.json({ message: 'Thiếu post_id' }, { status: 400 });
    }

    await connectDB();
    
    const existing = await Wishlist.findOne({ user_id: session.user.id, post_id });
    if (existing) {
      // Toggle off (remove)
      await Wishlist.deleteOne({ _id: existing._id });
      return NextResponse.json({ message: 'Đã bỏ lưu tin', isLiked: false });
    } else {
      // Toggle on (add)
      await Wishlist.create({ user_id: session.user.id, post_id });
      return NextResponse.json({ message: 'Đã lưu tin thành công', isLiked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
