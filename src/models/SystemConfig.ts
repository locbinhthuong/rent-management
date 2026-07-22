import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemConfig extends Document {
  announcement: {
    text: string;
    isActive: boolean;
  };
  propertyTypes: string[];
  locations: string[]; // Danh sách Khu vực (Quận/Huyện)
  contact?: {
    hotline?: string;
    zalo?: string;
    facebook?: string;
    tiktok?: string;
    email?: string;
    address?: string;
  };
  updatedAt: Date;
}

const SystemConfigSchema: Schema = new Schema(
  {
    announcement: {
      text: { type: String, default: '' },
      isActive: { type: Boolean, default: false },
    },
    propertyTypes: [{ type: String }],
    locations: [{ type: String }],
    contact: {
      hotline: { type: String, default: '' },
      zalo: { type: String, default: '' },
      facebook: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
    }
  },
  { timestamps: true }
);

// We only need one config document in the collection
export default mongoose.models.SystemConfig || mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);
