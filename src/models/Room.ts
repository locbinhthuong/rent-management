import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  property_id: mongoose.Types.ObjectId;
  room_number: string;
  price: number;
  status: 'Available' | 'Rented';
  current_tenant_id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    room_number: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Rented'], default: 'Available' },
    current_tenant_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
