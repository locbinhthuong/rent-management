import { NextResponse } from 'next/server';
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
    const body = await req.json();

    // Verify webhook data
    const webhookData = payos.verifyPaymentWebhookData(body);

    if (webhookData.code === '00' || webhookData.success) {
      await connectDB();
      const orderCode = webhookData.orderCode;

      // Find transaction
      const transaction = await Transaction.findOne({ orderCode });
      
      if (!transaction || transaction.status === 'Completed') {
        return NextResponse.json({ message: 'Transaction not found or already processed' }, { status: 200 });
      }

      // Update transaction status
      transaction.status = 'Completed';
      await transaction.save();

      // Extract plan from description (e.g. "Nâng cấp gói Pro (Pro)")
      const planMatch = transaction.description.match(/\((.*?)\)/);
      const planName = planMatch ? planMatch[1] : 'Basic';

      // Update user package
      if (planName === 'Pro' || planName === 'VIP') {
        const user = await User.findById(transaction.ctv_id);
        if (user) {
          user.package = planName as 'Pro' | 'VIP';
          
          // Add 30 days
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          user.packageExpiresAt = expiresAt;

          await user.save();
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('PayOS Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
