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
  console.log('Active post property types:', activePosts.map(p => p.property_type));
  
  mongoose.disconnect();
}
test().catch(console.error);
