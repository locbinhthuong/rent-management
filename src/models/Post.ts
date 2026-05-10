import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  room_id?: mongoose.Types.ObjectId;
  ctv_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  status: 'Pending' | 'Active' | 'Rejected';
  commission_rate?: number; // % hoa hồng
  
  // Các trường mới cho bài đăng chi tiết (Rao vặt)
  address?: string;
  price?: number;
  property_type?: string;
  utility_costs?: string;
  contract_terms?: string;
  target_audience?: string;
  is_vip?: boolean;
  bumped_at?: Date;
  is_verified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    room_id: { type: Schema.Types.ObjectId, ref: 'Room' }, // Không còn bắt buộc
    ctv_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Active', 'Rejected'], default: 'Pending' },
    commission_rate: { type: Number },
    
    // Thêm các trường mới
    address: { type: String },
    price: { type: Number },
    property_type: { type: String },
    utility_costs: { type: String },
    contract_terms: { type: String },
    target_audience: { type: String },
    is_vip: { type: Boolean, default: false },
    bumped_at: { type: Date },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
