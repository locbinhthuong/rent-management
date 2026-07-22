import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  type: 'DEPOSIT' | 'PAYOUT' | 'COMMISSION' | 'REFUND' | 'UPGRADE_PACKAGE';
  amount: number;
  property_id?: mongoose.Types.ObjectId;
  ctv_id?: mongoose.Types.ObjectId;
  room_id?: mongoose.Types.ObjectId;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
  orderCode?: number; // PayOS orderCode
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['DEPOSIT', 'PAYOUT', 'COMMISSION', 'REFUND', 'UPGRADE_PACKAGE'], required: true },
    amount: { type: Number, required: true },
    property_id: { type: Schema.Types.ObjectId, ref: 'Property' },
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User' },
    room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
    description: { type: String },
    orderCode: { type: Number, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
