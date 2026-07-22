import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SupportRequest from '@/models/SupportRequest';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { status } = await req.json();
    const params = await context.params;

    const supportReq = await SupportRequest.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!supportReq) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật thành công', request: supportReq }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating support request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;

    await connectDB();
    const supportReq = await SupportRequest.findByIdAndDelete(params.id);

    if (!supportReq) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting support request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
