import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  property_id: mongoose.Types.ObjectId;
  agent_id: mongoose.Types.ObjectId;
  customer_id?: mongoose.Types.ObjectId;
  customer_name: string;
  customer_phone: string;
  start_date: Date;
  end_date: Date;
  deposit_amount: number;
  monthly_rent: number;
  status: 'Active' | 'Expired' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    agent_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    deposit_amount: { type: Number, required: true },
    monthly_rent: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);
