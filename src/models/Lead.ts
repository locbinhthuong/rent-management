import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  post_id: mongoose.Types.ObjectId;
  ctv_id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  message?: string;
  status: 'New' | 'Contacted';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['New', 'Contacted'], default: 'New' },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
