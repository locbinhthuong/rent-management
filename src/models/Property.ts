import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  address: string;
  owner_info: {
    name: string;
    phone: string;
  };
  total_rooms: number;
  financial_config: {
    electricity_price: number;
    water_price: number;
    service_fee: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    owner_info: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    total_rooms: { type: Number, required: true },
    financial_config: {
      electricity_price: { type: Number, default: 0 },
      water_price: { type: Number, default: 0 },
      service_fee: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
