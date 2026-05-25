import mongoose, { Schema, Document } from 'mongoose';

export interface IDepositRequest extends Document {
  tenant_id: mongoose.Types.ObjectId;
  room_id: mongoose.Types.ObjectId;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  proof_image?: string; // Optional image URL if they upload a screenshot of transfer
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepositRequestSchema: Schema = new Schema(
  {
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room_id: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    proof_image: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.DepositRequest || mongoose.model<IDepositRequest>('DepositRequest', DepositRequestSchema);
