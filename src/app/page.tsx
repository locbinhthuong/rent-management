import Image from 'next/image';
import { MapPin, Phone, Home, Filter, Search, Bolt, FileText, Users, Heart, ShieldCheck } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import ContactButton from '@/components/ContactButton';
import FilterSearch from '@/components/FilterSearch';
import WishlistButton from '@/components/WishlistButton';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LogOut, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
      <section className="relative py-24 px-4 md:py-32 flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
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

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
              thuenhatro<span className="text-primary">.com</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow">
              Hệ thống tìm thuê nhà trọ nhanh chóng, uy tín
            </p>
          </div>
          <FilterSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Tìm kiếm dễ dàng</h3>
            <p className="text-slate-500 text-sm">Hàng ngàn phòng trọ được cập nhật liên tục</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Home className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Phòng đẹp, Giá tốt</h3>
            <p className="text-slate-500 text-sm">Chất lượng phòng được đảm bảo với giá thuê tốt nhất</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Hỗ trợ 24/7</h3>
            <p className="text-slate-500 text-sm">Đội ngũ luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào</p>
          </div>
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
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-extrabold text-primary shadow-lg border border-white/20 transform group-hover:-translate-y-1 transition-transform duration-300">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}/tháng
                      </div>
                      {post.property_type && (
                        <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10">
                          {post.property_type}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition mb-3 text-lg flex items-start gap-1">
                        {post.is_verified && <span title="Đã xác thực" className="shrink-0 mt-0.5 flex items-center"><ShieldCheck className="w-5 h-5 text-primary" /></span>}
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
                            className="flex items-center justify-center px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition shadow-sm border border-primary/20"
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
