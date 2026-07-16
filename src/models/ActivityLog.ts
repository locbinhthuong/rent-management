import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user_id: mongoose.Types.ObjectId;
  action: string;
  target_collection: string;
  target_id?: mongoose.Types.ObjectId;
  ip_address?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE_POST', 'UPDATE_STATUS'
    target_collection: { type: String, required: true }, // e.g., 'Post', 'User'
    target_id: { type: Schema.Types.ObjectId },
    ip_address: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
