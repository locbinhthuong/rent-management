import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Heart, Home } from 'lucide-react';
import Image from 'next/image';

// Client components
import FuturisticHero from '@/components/FuturisticHero';
import MapSearchClient from '@/components/MapSearchClient';

export const revalidate = 60;

async function getActivePosts(searchParams?: { [key: string]: string | string[] | undefined }) {
  await connectDB();
  User.init(); // Ensure user model is registered

  const query: any = { status: 'Active' };

  if (searchParams) {
    if (searchParams.city) query.city = searchParams.city;
    if (searchParams.district) query.district = searchParams.district;
    if (searchParams.property_type) query.property_type = searchParams.property_type;
    if (searchParams.q) {
      query.$or = [
        { title: { $regex: searchParams.q, $options: 'i' } },
        { address: { $regex: searchParams.q, $options: 'i' } },
        { description: { $regex: searchParams.q, $options: 'i' } }
      ];
    }
    
    // 3. Xử lý Lọc theo Giá (Price)
    const minPrice = searchParams.min_price;
    const maxPrice = searchParams.max_price;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // 4. Xử lý GPS (near)
    if (searchParams.lat && searchParams.lng) {
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
    
    total = await Post.countDocuments(query);
    posts = await mongooseQuery.skip(skip).limit(limit).lean() as any[];
  } catch (error) {
    console.error("GeoQuery failed, falling back to normal query:", error);
    // Fallback: nếu query bị lỗi (ví dụ thiếu 2dsphere index), bỏ qua lọc vị trí
    delete query.location;
    let fallbackQuery = Post.find(query).populate('ctv_id', 'name phone').sort({ is_vip: -1, bumped_at: -1, createdAt: -1 });
    total = await Post.countDocuments(query);
    posts = await fallbackQuery.skip(skip).limit(limit).lean() as any[];
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
  const { posts, pagination } = await getActivePosts(searchParams);
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full flex flex-col bg-slate-950 overflow-x-hidden text-slate-100">
      {/* Glassmorphism Header (Fixed) */}
      <header className="fixed top-0 inset-x-0 h-16 bg-slate-950/50 backdrop-blur-xl z-50 border-b border-white/10 shadow-lg flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30 group-hover:glow-cyan transition-all">
              <Home className="w-5 h-5 text-cyan-400" />
            </div>
            {/* If there's a dark mode logo, use it. Otherwise use text */}
            <span className="font-space font-bold text-xl tracking-tight text-white hidden sm:block">thuenhatro<span className="text-cyan-400">.com</span></span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/saved" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm">
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">Đã lưu</span>
          </Link>
          
          <div className="w-px h-5 bg-white/20 mx-1"></div>
          
          {session ? (
            <div className="flex items-center gap-3">
              <Link 
                href={session.user?.role === 'Admin' ? '/admin' : session.user?.role === 'CTV' ? '/ctv' : '/'}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-white/20 hover:scale-105 transition-transform"
                title="Bảng điều khiển"
              >
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </Link>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] text-sm"
            >
              Đăng Nhập
            </Link>
          )}
        </nav>
      </header>

      {/* Futuristic Hero Section */}
      <main className="pt-16">
        <FuturisticHero />
        
        {/* Split Content: Map & List */}
        <section id="explore" className="w-full h-[90vh] relative flex flex-col border-t border-white/10 shadow-[0_-20px_50px_rgba(6,182,212,0.1)]">
          <MapSearchClient posts={posts} />
        </section>
      </main>
    </div>
  );
}
