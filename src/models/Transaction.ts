import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  type: 'Thu tiền phòng' | 'Chi hoa hồng' | 'Chi sửa chữa';
  amount: number;
  property_id: mongoose.Types.ObjectId;
  ctv_id?: mongoose.Types.ObjectId;
  room_id?: mongoose.Types.ObjectId;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['Thu tiền phòng', 'Chi hoa hồng', 'Chi sửa chữa'], required: true },
    amount: { type: Number, required: true },
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User' },
    room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
