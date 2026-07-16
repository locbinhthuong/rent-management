import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image_url: string;
  link?: string;
  is_active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image_url: { type: String, required: true },
    link: { type: String },
    is_active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
