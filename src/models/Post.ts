import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  room_id: mongoose.Types.ObjectId;
  ctv_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  status: 'Pending' | 'Active' | 'Rejected';
  commission_rate?: number; // % hoa hồng (tùy chọn, nếu admin muốn ghi đè)
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    room_id: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Active', 'Rejected'], default: 'Pending' },
    commission_rate: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
