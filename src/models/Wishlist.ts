import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId;
  post_id: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

// Ensure a user can only wishlist a specific post once
WishlistSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
