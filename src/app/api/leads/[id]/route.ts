import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['CTV', 'Admin'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const resolvedParams = await params;
    const leadId = resolvedParams.id;
    const { status, note } = await req.json();

    if (status && !['New', 'Contacted', 'Success', 'Failed'].includes(status)) {
      return NextResponse.json({ message: 'Trạng thái không hợp lệ' }, { status: 400 });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ message: 'Không tìm thấy Lead' }, { status: 404 });
    }
    
    if (session.user.role !== 'Admin' && lead.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (status) lead.status = status;
    if (note !== undefined) lead.note = note;
    await lead.save();

    return NextResponse.json({ message: 'Cập nhật thành công', lead }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
