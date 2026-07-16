import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  author_id: mongoose.Types.ObjectId;
  is_published: boolean;
  published_at?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_published: { type: Boolean, default: false },
    published_at: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
