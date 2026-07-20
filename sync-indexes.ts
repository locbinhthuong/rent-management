import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

async function sync() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Define Schema exactly as in Post.ts to trigger index creation
  const PostSchema = new mongoose.Schema({
    approval_status: String,
    rental_status: String,
    is_vip: Boolean,
    bumped_at: Date,
    createdAt: Date,
    city: String,
    district: String,
    ward: String,
    price: Number,
    title: String,
    description: String,
    address: String,
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }
    }
  });

  PostSchema.index({ location: '2dsphere' });
  PostSchema.index({ approval_status: 1, rental_status: 1, is_vip: -1, bumped_at: -1, createdAt: -1 });
  PostSchema.index({ city: 1, district: 1 });
  PostSchema.index({ price: 1 });
  PostSchema.index({ 
    title: 'text', 
    description: 'text', 
    address: 'text', 
    ward: 'text', 
    district: 'text', 
    city: 'text' 
  });

  const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

  console.log('Syncing indexes for Post collection...');
  try {
    await Post.syncIndexes();
    console.log('Indexes synced successfully!');
  } catch (error) {
    console.error('Error syncing indexes:', error);
  }

  await mongoose.disconnect();
}

sync();
