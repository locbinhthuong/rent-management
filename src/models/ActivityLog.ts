import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user_id: mongoose.Types.ObjectId;
  action: string;
  entity_type: string;
  entity_id?: mongoose.Types.ObjectId;
  details?: any;
  ip_address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE_POST', 'UPDATE_POST', 'DELETE_POST', 'LOGIN'
    entity_type: { type: String, required: true }, // e.g., 'Post', 'User', 'Contract'
    entity_id: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed }, // JSON lưu thay đổi (before/after)
    ip_address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
