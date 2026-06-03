import mongoose from 'mongoose';

const URI = 'mongodb+srv://tanlocdepzai123_db_user:5vNx0ETQ5iqa9jWc@cluster0.vioomkk.mongodb.net/rent_management?appName=Cluster0';

async function test() {
  await mongoose.connect(URI);
  console.log('Connected to DB');
  
  const postsCollection = mongoose.connection.collection('posts');
  const allPosts = await postsCollection.find({}).toArray();
  console.log('Total posts:', allPosts.length);
  
  const activePosts = await postsCollection.find({ status: 'Active' }).toArray();
  console.log('Active posts:', activePosts.length);
  activePosts.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`City: ${p.city}, District: ${p.district}`);
    console.log(`Address: ${p.address}`);
    console.log(`Property Type: ${p.property_type}`);
  });
  
  mongoose.disconnect();
}
test().catch(console.error);
