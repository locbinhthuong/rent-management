import Image from 'next/image';
import { MapPin, Phone, Home, Filter, Search, Bolt, FileText, Users, Heart, ShieldCheck, DollarSign } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import SystemConfig from '@/models/SystemConfig';
import ContactButton from '@/components/ContactButton';
import FilterSearch from '@/components/FilterSearch';
import WishlistButton from '@/components/WishlistButton';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LogOut, LayoutDashboard } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds to improve load times

async function getActivePosts(filters: any) {
  await connectDB();
  User.init(); // Ensure user model is registered

  const query: any = { status: 'Active' };

  if (filters.type) {
    query.property_type = filters.type;
  }

  if (filters.district) {
    query.$or = query.$or || [];
    query.$or.push(
      { district: filters.district },
      { address: { $regex: filters.district, $options: 'i' } }
    );
  }

  if (filters.priceMin || filters.priceMax) {
    query.price = {};
    if (filters.priceMin) query.price.$gte = filters.priceMin;
    if (filters.priceMax) query.price.$lte = filters.priceMax;
  }

  if (filters.keyword) {
    query.$or = [
      { title: { $regex: filters.keyword, $options: 'i' } },
      { address: { $regex: filters.keyword, $options: 'i' } }
    ];
  }

  const posts = await Post.find(query)
    .populate('ctv_id', 'name phone')
    .sort({ is_vip: -1, bumped_at: -1, createdAt: -1 })
    .lean() as any[];

  return posts;
}

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CustomerHome(props: Props) {
  const resolvedParams = props.searchParams ? await props.searchParams : {};
  
  const keyword = typeof resolvedParams.keyword === 'string' ? resolvedParams.keyword : undefined;
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
  const district = typeof resolvedParams.district === 'string' ? resolvedParams.district : undefined;
  const priceMin = typeof resolvedParams.priceMin === 'string' ? parseInt(resolvedParams.priceMin) : undefined;
  const priceMax = typeof resolvedParams.priceMax === 'string' ? parseInt(resolvedParams.priceMax) : undefined;

  const posts = await getActivePosts({ keyword, type, district, priceMin, priceMax });
  const session = await getServerSession(authOptions);

  // Fetch SystemConfig
  let config = await SystemConfig.findOne().lean() as any;
  if (!config) {
    config = {
      announcement: { isActive: false, text: '' },
      propertyTypes: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn'],
      locations: []
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Announcement Banner */}
      {config.announcement?.isActive && config.announcement?.text && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-center text-sm font-medium animate-in slide-in-from-top-full">
          {config.announcement.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Image src="/logo.png" alt="thuenhatro.com" width={220} height={60} className="h-10 w-auto object-contain" />
          </div>
          <nav className="flex items-center gap-3 md:gap-6 text-sm font-semibold text-slate-600">
            <Link href="/saved" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Heart className="w-6 h-6 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Đã lưu</span>
            </Link>
            
            <div className="w-px h-6 bg-slate-200 mx-1 md:mx-2"></div>
            
            {session ? (
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-base md:text-lg shadow-md border-2 border-white">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-bold text-slate-800">{session.user?.name}</div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {session.user?.role === 'Admin' ? 'Quản Trị Viên' : session.user?.role === 'CTV' ? 'Cộng Tác Viên' : 'Khách Hàng'}
                    </div>
                  </div>
                </div>
                <Link 
                  href={session.user?.role === 'Admin' ? '/admin' : session.user?.role === 'CTV' ? '/ctv' : '/'}
                  className="px-3 py-2 md:px-4 md:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-medium flex items-center gap-2"
                  title="Bảng điều khiển"
                >
                  <LayoutDashboard className="w-5 h-5 md:hidden" />
                  <span className="hidden md:inline">Bảng điều khiển</span>
                </Link>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden group text-xs md:text-sm"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">Đăng Nhập</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="relative py-24 px-4 md:py-32 flex flex-col items-center justify-center min-h-[500px] overflow-hidden border-b border-slate-200">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
            alt="Phòng trọ đẹp" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
              thuenhatro<span className="text-indigo-400">.com</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow">
              Hệ thống tìm thuê nhà trọ nhanh chóng, uy tín
            </p>
          </div>
          <FilterSearch 
            propertyTypes={config.propertyTypes || []} 
            locations={config.locations || []} 
          />
        </div>
      </section>

      {/* Main Content 2 Columns */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Post Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Phòng trọ mới nhất</h2>
            <span className="text-slate-500 font-medium text-sm bg-slate-100 px-3 py-1 rounded-full">{posts.length} kết quả</span>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Hiện tại chưa có phòng trống nào phù hợp.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const price = post.price || 0;
                const address = post.address || 'Chưa cập nhật địa chỉ';
                const imageUrl = post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                const ctvPhone = post.ctv_id?.phone || '';

                return (
                  <div key={post._id.toString()} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-slate-200 flex flex-col sm:flex-row relative">
                    <WishlistButton post={{ ...post, _id: post._id.toString() }} />
                    
                    {/* Thumbnail */}
                    <Link prefetch={true} href={`/p/${post._id}`} className="sm:w-64 shrink-0 relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100 block">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-semibold">
                        {post.property_type || 'Phòng trọ'}
                      </div>
                    </Link>
                    
                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <Link prefetch={true} href={`/p/${post._id}`} className="block">
                          <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition mb-2 text-lg uppercase flex items-start gap-1">
                            {post.is_verified && <span title="Đã xác thực" className="shrink-0 mt-0.5"><ShieldCheck className="w-5 h-5 text-emerald-500" /></span>}
                            {post.title}
                          </h3>
                        </Link>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
                          <div className="font-extrabold text-emerald-600 text-lg">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}/tháng
                          </div>
                          {post.area_sqm && (
                            <div className="text-slate-600 font-medium text-sm bg-slate-100 px-2 py-0.5 rounded">
                              {post.area_sqm} m²
                            </div>
                          )}
                        </div>

                        <div className="flex items-start gap-2 text-slate-500 text-sm mb-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-2">{address}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {post.ctv_id?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium">{post.ctv_id?.name || 'Ẩn danh'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {ctvPhone && (
                            <a 
                              href={`https://zalo.me/${ctvPhone}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md font-bold hover:bg-blue-600 hover:text-white transition text-sm border border-blue-100 hover:border-blue-600"
                            >
                              Zalo
                            </a>
                          )}
                          <ContactButton 
                            postId={post._id.toString()} 
                            ctvId={post.ctv_id?._id?.toString() || ''}
                            postTitle={post.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Banner Ads Placeholder */}
          <div className="bg-slate-100 rounded-xl border border-slate-200 h-[400px] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition"></div>
            Banner Quảng Cáo
          </div>
        </aside>
      </main>
    </div>
  );
}
