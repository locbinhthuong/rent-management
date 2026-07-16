import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Contract from '@/models/Contract';
import Post from '@/models/Post';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const contracts = await Contract.find({ agent_id: session.user.id })
      .populate('property_id', 'title price images address')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { property_id, customer_name, customer_phone, start_date, end_date, deposit_amount, monthly_rent } = data;

    if (!property_id || !customer_name || !customer_phone || !start_date || !end_date || !deposit_amount || !monthly_rent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if property belongs to CTV
    const post = await Post.findOne({ _id: property_id, ctv_id: session.user.id });
    if (!post) {
       return NextResponse.json({ error: 'Property not found or unauthorized' }, { status: 403 });
    }

    const contract = await Contract.create({
      property_id,
      agent_id: session.user.id,
      customer_name,
      customer_phone,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      deposit_amount: Number(deposit_amount),
      monthly_rent: Number(monthly_rent),
      status: 'Active',
    });

    // Cập nhật trạng thái phòng thành Đã Thuê (Rented)
    post.rental_status = 'Rented';
    await post.save();

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
