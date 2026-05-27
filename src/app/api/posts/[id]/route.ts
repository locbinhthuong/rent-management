import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    const data = await req.json();
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check permissions: Must be Admin or the owner CTV
    if (session.user.role !== 'Admin' && post.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update fields
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: 'Cập nhật thành công', post: updatedPost });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check permissions: Must be Admin or the owner CTV
    if (session.user.role !== 'Admin' && post.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Xóa bài đăng thành công' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
