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
  city?: string;
  district?: string;
  ward?: string;
  price?: number;
  property_type?: string; // Loại phòng (Phòng trọ, Chung cư mini, etc.)
  area_sqm?: number;
  amenities?: string[];
  utility_costs?: string;
  contract_terms?: string;
  target_audience?: string;
  is_vip?: boolean;
  bumped_at?: Date;
  is_verified?: boolean;
  views?: number;
  location?: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  };

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
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    price: { type: Number },
    property_type: { type: String },
    area_sqm: { type: Number },
    amenities: [{ type: String }],
    utility_costs: { type: String },
    contract_terms: { type: String },
    target_audience: { type: String },
    is_vip: { type: Boolean, default: false },
    bumped_at: { type: Date },
    is_verified: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    
    // GeoJSON cho định vị bản đồ
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  { timestamps: true }
);

// Tạo 2dsphere index trên trường location
PostSchema.index({ location: '2dsphere' });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
