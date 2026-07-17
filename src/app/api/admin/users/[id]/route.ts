import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import Lead from '@/models/Lead';
import Contract from '@/models/Contract';
import Notification from '@/models/Notification';
import ActivityLog from '@/models/ActivityLog';
import Wishlist from '@/models/Wishlist';
import Transaction from '@/models/Transaction';
import Property from '@/models/Property';
import DepositRequest from '@/models/DepositRequest';
import Room from '@/models/Room';
import News from '@/models/News';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, avatar } = await req.json();
    const { id } = await params;

    await connectDB();
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    // CASCADE DELETE related data
    await Post.deleteMany({ ctv_id: id });
    await Lead.deleteMany({ ctv_id: id });
    await Lead.deleteMany({ customer_id: id });
    await Contract.deleteMany({ agent_id: id });
    await Contract.deleteMany({ customer_id: id });
    await Notification.deleteMany({ user_id: id });
    await ActivityLog.deleteMany({ user_id: id });
    await Wishlist.deleteMany({ user_id: id });
    await Transaction.deleteMany({ ctv_id: id });
    await Property.deleteMany({ owner_id: id });
    await DepositRequest.deleteMany({ tenant_id: id });
    await News.deleteMany({ author_id: id });
    await Room.updateMany({ current_tenant_id: id }, { $unset: { current_tenant_id: "" } });
    
    // Finally delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Đã xóa người dùng và các dữ liệu liên quan thành công' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
