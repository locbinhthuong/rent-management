import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  address: string;
  owner_id: mongoose.Types.ObjectId;
  total_rooms: number;
  financial_config: {
    electricity_price: number;
    water_price: number;
    service_fee: number;
  };
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    total_rooms: { type: Number, required: true },
    financial_config: {
      electricity_price: { type: Number, default: 0 },
      water_price: { type: Number, default: 0 },
      service_fee: { type: Number, default: 0 },
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
