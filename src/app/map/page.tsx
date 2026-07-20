import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MapClientWrapper from '@/components/MapClientWrapper';

export const revalidate = 60;

async function getActivePosts(searchParams?: { [key: string]: string | string[] | undefined }) {
  await connectDB();
  User.init(); 

  const query: any = { approval_status: 'Approved', rental_status: 'Available' };

  if (searchParams) {
    if (searchParams.city) query.city = searchParams.city;
    if (searchParams.district) query.district = searchParams.district;
    if (searchParams.property_type) query.property_type = searchParams.property_type;
    if (searchParams.q) {
      query.$or = [
        { title: { $regex: searchParams.q, $options: 'i' } },
        { address: { $regex: searchParams.q, $options: 'i' } },
        { description: { $regex: searchParams.q, $options: 'i' } },
        { district: { $regex: searchParams.q, $options: 'i' } },
        { city: { $regex: searchParams.q, $options: 'i' } },
        { ward: { $regex: searchParams.q, $options: 'i' } }
      ];
    }
    
    const minPrice = searchParams.min_price;
    const maxPrice = searchParams.max_price;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
  }

  let posts: any[] = [];
  try {
    let mongooseQuery = Post.find(query).populate('ctv_id', 'name phone').sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
    posts = await mongooseQuery.limit(100).lean() as any[]; // Limit map to top 100 for performance
  } catch (error) {
    console.error("Query failed:", error);
  }

  return {
    posts: posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      room_id: post.room_id ? post.room_id.toString() : null,
      ctv_id: post.ctv_id ? { ...post.ctv_id, _id: post.ctv_id._id.toString() } : null,
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      bumped_at: post.bumped_at?.toISOString()
    }))
  };
}

export default async function MapPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { posts } = await getActivePosts(searchParams);

  return (
    <div className="w-full h-screen relative bg-slate-50 overflow-hidden">
      {/* Back button overlay */}
      <Link 
        href={`/?${new URLSearchParams((searchParams as any) || {}).toString()}`}
        className="absolute top-6 left-6 z-[400] bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-full text-slate-900 hover:bg-white hover:scale-110 transition-all flex items-center justify-center border border-slate-300"
      >
        <ArrowLeft className="w-5 h-5 font-bold" />
      </Link>

      <div className="w-full h-full z-0">
        <MapClientWrapper posts={posts} />
      </div>
    </div>
  );
}
