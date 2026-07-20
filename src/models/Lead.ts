import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  post_id: mongoose.Types.ObjectId;
  ctv_id: mongoose.Types.ObjectId;
  customer_id?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  message?: string;
  note?: string; // Ghi chú nội bộ của CTV/Admin
  status: 'New' | 'Contacted' | 'Success' | 'Failed';
  last_message?: string;
  last_message_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    note: { type: String }, // Thêm field ghi chú
    status: { type: String, enum: ['New', 'Contacted', 'Success', 'Failed'], default: 'New' },
    last_message: { type: String },
    last_message_at: { type: Date },
  },
  { timestamps: true }
);

// Performance indexes for faster Dashboard loading
LeadSchema.index({ ctv_id: 1, status: 1 });
LeadSchema.index({ customer_id: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
