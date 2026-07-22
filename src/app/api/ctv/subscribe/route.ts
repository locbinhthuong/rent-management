import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { PayOS } from '@payos/node';

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID || '',
  process.env.PAYOS_API_KEY || '',
  process.env.PAYOS_CHECKSUM_KEY || ''
);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CTV') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { plan } = await req.json();

    let amount = 0;
    let description = '';
    
    if (plan === 'Pro') {
      amount = 199000;
      description = 'Nâng cấp gói Pro';
    } else if (plan === 'VIP') {
      amount = 499000;
      description = 'Nâng cấp gói VIP';
    } else {
      return NextResponse.json({ message: 'Gói dịch vụ không hợp lệ' }, { status: 400 });
    }

    const orderCode = Number(String(Date.now()).slice(-6));

    // Save transaction
    await Transaction.create({
      type: 'UPGRADE_PACKAGE',
      amount,
      ctv_id: session.user.id,
      status: 'Pending',
      description: `${description} (${plan})`,
      orderCode
    });

    const body = {
      orderCode,
      amount,
      description: description.substring(0, 25), // PayOS limit description length
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ctv/payment-success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bang-gia`,
    };

    const paymentLinkRes = await payos.createPaymentLink(body);

    return NextResponse.json({ checkoutUrl: paymentLinkRes.checkoutUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
