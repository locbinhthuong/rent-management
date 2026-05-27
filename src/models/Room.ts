import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  property_id: mongoose.Types.ObjectId;
  room_number: string;
  room_type?: string;
  area_sqm?: number;
  price: number;
  images?: string[];
  amenities?: string[];
  status: 'Available' | 'Rented';
  current_tenant_id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    room_number: { type: String, required: true },
    room_type: { type: String }, // e.g. 'Phòng trọ', 'Chung cư mini'
    area_sqm: { type: Number },
    price: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    status: { type: String, enum: ['Available', 'Rented'], default: 'Available' },
    current_tenant_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
