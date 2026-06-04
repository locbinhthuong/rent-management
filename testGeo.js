import mongoose from 'mongoose';
import connectDB from './src/lib/db.js';
import Post from './src/models/Post.js';

async function testGeo() {
  await connectDB();
  try {
    const lat = 10.042949385594378;
    const lng = 105.7709595656964;
    const query = { status: 'Active', location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: 10000
      }
    }};
    console.log("Running query...");
    const posts = await Post.find(query).lean();
    console.log("Success! Found:", posts.length);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
}
testGeo();
