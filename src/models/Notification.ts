import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  is_read: boolean;
  link?: string; // Đường dẫn khi click vào thông báo
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'], default: 'INFO' },
    is_read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

// Tự động index để query theo user nhanh hơn
NotificationSchema.index({ user_id: 1, is_read: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
