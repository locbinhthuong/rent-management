import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import DepositRequest from '@/models/DepositRequest';
import User from '@/models/User';
import Room from '@/models/Room';
import Property from '@/models/Property';
import Transaction from '@/models/Transaction';
// Make sure to have a database connection utility in a real app, assuming mongoose is connected globally here.

export async function POST(req: Request) {
  try {
    const { depositRequestId, ctvId } = await req.json();

    if (!depositRequestId) {
      return NextResponse.json({ message: 'Missing depositRequestId' }, { status: 400 });
    }

    const deposit = await DepositRequest.findById(depositRequestId).populate('room_id').populate('tenant_id');
    if (!deposit) {
      return NextResponse.json({ message: 'Deposit request not found' }, { status: 404 });
    }

    if (deposit.status !== 'Pending') {
      return NextResponse.json({ message: 'Deposit is not pending' }, { status: 400 });
    }

    const room = await Room.findById(deposit.room_id);
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    const property = await Property.findById(room.property_id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    // --- LOGIC CHIA TIỀN (MANUAL ESCROW) ---
    // Giả sử Sàn thu phí 10% tổng tiền cọc. 
    // Trong 10% đó, chia cho CTV 50% (nếu có CTV), Sàn giữ 50%.
    const PLATFORM_FEE_PERCENT = 0.10; 
    const CTV_REWARD_PERCENT = 0.50; // 50% of the platform fee

    const totalAmount = deposit.amount;
    const platformFee = totalAmount * PLATFORM_FEE_PERCENT;
    const landlordAmount = totalAmount - platformFee;
    
    let ctvAmount = 0;
    if (ctvId) {
       ctvAmount = platformFee * CTV_REWARD_PERCENT;
    }

    // Bắt đầu Session để đảm bảo tính toàn vẹn dữ liệu
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Cập nhật trạng thái Deposit Request
      deposit.status = 'Approved';
      await deposit.save({ session });

      // 2. Cập nhật trạng thái phòng
      room.status = 'Rented';
      room.current_tenant_id = deposit.tenant_id;
      await room.save({ session });

      // 3. Cộng tiền cho Chủ Trọ
      await User.findByIdAndUpdate(property.owner_id, { $inc: { wallet_balance: landlordAmount } }, { session });
      
      // Ghi log Transaction cho Chủ trọ
      await Transaction.create([{
        type: 'PAYOUT',
        amount: landlordAmount,
        property_id: property._id,
        room_id: room._id,
        status: 'Completed',
        description: `Thanh toán tiền cọc phòng ${room.room_number} (Đã trừ phí sàn)`
      }], { session });

      // 4. Cộng tiền cho CTV (nếu có)
      if (ctvId && ctvAmount > 0) {
        await User.findByIdAndUpdate(ctvId, { $inc: { wallet_balance: ctvAmount } }, { session });
        
        // Ghi log Transaction cho CTV
        await Transaction.create([{
          type: 'COMMISSION',
          amount: ctvAmount,
          ctv_id: ctvId,
          property_id: property._id,
          room_id: room._id,
          status: 'Completed',
          description: `Hoa hồng giới thiệu phòng ${room.room_number}`
        }], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({ 
        message: 'Duyệt cọc thành công, tiền đã được chia!', 
        details: { totalAmount, landlordAmount, platformFee, ctvAmount } 
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
