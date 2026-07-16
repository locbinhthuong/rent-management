import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  property_id: mongoose.Types.ObjectId;
  agent_id: mongoose.Types.ObjectId;
  customer_id?: mongoose.Types.ObjectId;
  customer_name: string;
  customer_phone: string;
  start_date: Date;
  end_date?: Date;
  deposit_amount: number;
  rent_amount: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  notes?: string;
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
    end_date: { type: Date },
    deposit_amount: { type: Number, required: true, default: 0 },
    rent_amount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);
