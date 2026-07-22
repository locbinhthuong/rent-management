import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Heart, Home, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';

// Client components
import FuturisticHero from '@/components/FuturisticHero';
import MapSearchClient from '@/components/MapSearchClient';
import MapClientWrapper from '@/components/MapClientWrapper';
import UserMenu from '@/components/UserMenu';
import LocusLogo from '@/components/LocusLogo';
import MainHeader from '@/components/MainHeader';

export const revalidate = 60;

async function getActivePosts(searchParams?: { [key: string]: string | string[] | undefined }) {
  await connectDB();
  User.init(); // Ensure user model is registered
  const query: any = { 
    approval_status: 'Approved',
    rental_status: 'Available'
  };

  if (searchParams) {
    if (searchParams.city) query.city = searchParams.city;
    if (searchParams.district) query.district = searchParams.district;
    if (searchParams.property_type) query.property_type = searchParams.property_type;
    
    // Exact match instead of heavy regex for dropdown fields
    if (searchParams.ward) query.ward = searchParams.ward;
    
    if (searchParams.street) {
      query.address = { $regex: searchParams.street as string, $options: 'i' };
    }
    
    if (searchParams.max_electricity) {
      query.electricity_price = { $lte: Number(searchParams.max_electricity) };
    }
    if (searchParams.max_water) {
      query.water_price = { $lte: Number(searchParams.max_water) };
    }
    
    if (searchParams.q) {
      // Use native MongoDB text search (requires Text Index on fields)
      query.$text = { $search: searchParams.q as string };
    }
    
    // 3. Xử lý Lọc theo Giá (Price)
    const minPrice = searchParams.min_price;
    const maxPrice = searchParams.max_price;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // 4. Xử lý Lọc quanh Trường Đại học (Bán kính 3km)
    if (searchParams.uni_lat && searchParams.uni_lng) {
      const lat = parseFloat(searchParams.uni_lat as string);
      const lng = parseFloat(searchParams.uni_lng as string);
      if (!isNaN(lat) && !isNaN(lng)) {
        query.location = {
          $geoWithin: {
            $centerSphere: [[lng, lat], 3 / 6378.1] // 3km in radians
          }
        };
      }
    }

    // 5. Xử lý GPS (near)
    if (searchParams.lat && searchParams.lng && !query.location) {
      const lat = parseFloat(searchParams.lat as string);
      const lng = parseFloat(searchParams.lng as string);
      if (!isNaN(lat) && !isNaN(lng)) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat] // [longitude, latitude]
            },
            $maxDistance: 10000 // 10km radius
          }
        };
      }
    }
  }

  // Phân trang
  const page = parseInt((searchParams?.page as string) || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  let total = 0;
  let posts: any[] = [];

  try {
    // Nếu có GPS ($near) thì Mongoose sẽ tự động sort theo khoảng cách.
    let mongooseQuery = Post.find(query).populate('ctv_id', 'name phone');
    if (!query.location) {
      mongooseQuery = mongooseQuery.sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
    }
    
    [total, posts] = await Promise.all([
      Post.countDocuments(query),
      mongooseQuery.skip(skip).limit(limit).lean() as Promise<any[]>
    ]);
  } catch (error) {
    console.error("GeoQuery failed, falling back to normal query:", error);
    // Fallback: nếu query bị lỗi (ví dụ thiếu 2dsphere index), bỏ qua lọc vị trí
    delete query.location;
    let fallbackQuery = Post.find(query).populate('ctv_id', 'name phone').sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
    [total, posts] = await Promise.all([
      Post.countDocuments(query),
      fallbackQuery.skip(skip).limit(limit).lean() as Promise<any[]>
    ]);
  }

  // Convert ObjectIds to strings to pass to client components safely
  return {
    posts: posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      room_id: post.room_id ? post.room_id.toString() : null,
      ctv_id: post.ctv_id ? { ...post.ctv_id, _id: post.ctv_id._id.toString() } : null,
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      bumped_at: post.bumped_at?.toISOString()
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export default async function CustomerHome(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full flex flex-col bg-slate-50 overflow-x-hidden text-slate-900">
      {/* Glassmorphism Header (Fixed) */}
      <MainHeader user={session?.user} />

      {/* Futuristic Hero Section */}
      <main className="pt-16">
        <FuturisticHero />
        
        <Suspense fallback={
          <div className="w-full flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Đang tải không gian sống...</p>
          </div>
        }>
          <PostsSection searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function PostsSection({ searchParams }: { searchParams: any }) {
  const { posts, pagination } = await getActivePosts(searchParams);

  return (
    <>
      {/* Featured Content: Posts List */}
      <section id="explore" className="w-full relative flex flex-col mt-4 z-20">
        <MapSearchClient posts={posts} pagination={pagination} />
      </section>

      {/* Map Section (Bottom) */}
      <section id="map-view" className="w-full max-w-[1400px] mx-auto px-4 mb-20 relative z-10 h-[500px] mt-8">
        <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden relative group">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 rounded-3xl transition-colors duration-500 z-50 pointer-events-none"></div>
          <MapClientWrapper posts={posts} />
          
          {posts && posts.length === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-[400] pointer-events-none">
              <span className="text-slate-700 font-space font-medium bg-white shadow-lg px-6 py-3 rounded-full border border-slate-200">
                Không tìm thấy phòng ở khu vực này
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
