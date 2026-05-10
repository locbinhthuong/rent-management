import Image from 'next/image';
import { MapPin, Phone, Home, Filter, Search, Bolt, FileText, Users, Heart, ShieldCheck } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import ContactButton from '@/components/ContactButton';
import FilterSearch from '@/components/FilterSearch';
import WishlistButton from '@/components/WishlistButton';
import Link from 'next/link';

export const revalidate = 60; // Cache for 60 seconds to improve load times

async function getActivePosts(filters: any) {
  await connectDB();
  User.init(); // Ensure user model is registered

  const query: any = { status: 'Active' };

  if (filters.type) {
    query.property_type = filters.type;
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
  const priceMin = typeof resolvedParams.priceMin === 'string' ? parseInt(resolvedParams.priceMin) : undefined;
  const priceMax = typeof resolvedParams.priceMax === 'string' ? parseInt(resolvedParams.priceMax) : undefined;

  const posts = await getActivePosts({ keyword, type, priceMin, priceMax });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">RentHome</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/saved" className="flex items-center gap-2 hover:text-indigo-600 transition">
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Phòng đã lưu</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center leading-tight">
            Tìm phòng trọ ưng ý <br className="hidden md:block" />ngay hôm nay
          </h1>
          <FilterSearch />
        </div>
      </section>

      {/* Masonry Grid List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Phòng trọ mới nhất</h2>
          <span className="text-slate-500 font-medium text-sm">{posts.length} kết quả</span>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Hiện tại chưa có phòng trống nào được đăng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => {
              const price = post.price || 0;
              const address = post.address || 'Chưa cập nhật địa chỉ';
              const imageUrl = post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
              const ctvPhone = post.ctv_id?.phone || '';

              return (
                <div key={post._id.toString()} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-200 flex flex-col relative">
                  <WishlistButton post={{ ...post, _id: post._id.toString() }} />
                  
                  <Link href={`/p/${post._id}`} className="flex-1 flex flex-col cursor-pointer block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-extrabold text-indigo-600 shadow-md">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}/tháng
                      </div>
                      {post.property_type && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">
                          {post.property_type}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition mb-3 text-lg flex items-start gap-1">
                        {post.is_verified && <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" title="Đã xác thực" />}
                        {post.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-start gap-2 text-slate-600 text-sm">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-2">{address}</span>
                        </div>
                        
                        {post.utility_costs && (
                          <div className="flex items-start gap-2 text-slate-600 text-sm">
                            <Bolt className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                            <span className="line-clamp-1" title={post.utility_costs}>{post.utility_costs}</span>
                          </div>
                        )}
                        
                        {post.contract_terms && (
                          <div className="flex items-start gap-2 text-slate-600 text-sm">
                            <FileText className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                            <span className="line-clamp-1" title={post.contract_terms}>{post.contract_terms}</span>
                          </div>
                        )}
                        
                        {post.target_audience && (
                          <div className="flex items-start gap-2 text-slate-600 text-sm">
                            <Users className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                            <span className="line-clamp-1" title={post.target_audience}>Phù hợp: {post.target_audience}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                    
                  <div className="p-5 pt-0 mt-auto">
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <ContactButton 
                          postId={post._id.toString()} 
                          ctvId={post.ctv_id?._id?.toString() || ''}
                          postTitle={post.title}
                        />
                        
                        {ctvPhone && (
                          <a 
                            href={`https://zalo.me/${ctvPhone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100 hover:border-blue-600"
                            title="Nhắn Zalo"
                          >
                            Zalo
                          </a>
                        )}
                      </div>
                      <div className="text-center mt-3 text-xs text-slate-400 font-medium">
                        CTV: {post.ctv_id?.name || 'Ẩn danh'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
