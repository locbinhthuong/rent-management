import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: 'System' | 'Lead' | 'Post';
  is_read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['System', 'Lead', 'Post'], default: 'System' },
    is_read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
