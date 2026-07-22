import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportRequest extends Document {
  name: string;
  phone: string;
  email: string;
  content: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: Date;
  updatedAt: Date;
}

const SupportRequestSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SupportRequest || mongoose.model<ISupportRequest>('SupportRequest', SupportRequestSchema);
