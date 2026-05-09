import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const resolvedParams = await params;
    const leadId = resolvedParams.id;
    const { status } = await req.json();

    if (!['New', 'Contacted'].includes(status)) {
      return NextResponse.json({ message: 'Trạng thái không hợp lệ' }, { status: 400 });
    }

    // Verify lead belongs to this CTV
    const lead = await Lead.findById(leadId);
    if (!lead || lead.ctv_id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    lead.status = status;
    await lead.save();

    return NextResponse.json({ message: 'Cập nhật thành công', lead }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
