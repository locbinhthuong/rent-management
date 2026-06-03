import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Home, Bolt, FileText, Users, Calendar, ShieldCheck, ChevronLeft, ArrowRight, Bath, Maximize } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import ContactButton from '@/components/ContactButton';
import WishlistButton from '@/components/WishlistButton';
import { notFound } from 'next/navigation';
import GlassPropertyCard from '@/components/GlassPropertyCard';
import PostImageGallery from '@/components/PostImageGallery';

export const revalidate = 60; // Cache for 60 seconds to improve load times

async function getPostDetail(id: string) {
  try {
    await connectDB();
    User.init();
    
    const post = await Post.findById(id).populate('ctv_id', 'name phone').lean();
    
    // Tăng views bất đồng bộ (không block quá trình render)
    Post.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec().catch(() => {});
    
    if (!post) return null;
    
    // Tìm các phòng tương tự cùng loại hoặc cùng khu vực
    const similarPosts = await Post.find({
      _id: { $ne: post._id },
      status: 'Active',
      $or: [
        { property_type: post.property_type },
        // Lấy 1 phần của địa chỉ để tìm (ví dụ: Quận 1)
        { address: { $regex: (post.address || '').split(',').pop()?.trim() || '', $options: 'i' } }
      ]
    }).limit(4).lean() as any[];
    
    return { post, similarPosts };
  } catch (err) {
    return null;
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getPostDetail(resolvedParams.id);
  
  if (!data || !data.post) {
    notFound();
  }
  
  const { post, similarPosts } = data as any;
  const price = post.price || 0;
  const fullAddress = [post.address, post.district, post.city].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ';
  const ctvPhone = post.ctv_id?.phone || '';
  const isVerified = post.is_verified || false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative overflow-hidden font-sans">
      {/* Ambient glowing background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-cyan-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                <Home className="w-5 h-5 text-cyan-400 hidden sm:block" />
              </div>
              <span className="font-space font-bold text-xl tracking-tight text-white">thuenhatro<span className="text-cyan-400">.com</span></span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery (Glassmorphism & Carousel) */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/10 relative">
                <div className="absolute top-5 right-5 z-20">
                  <WishlistButton post={{ ...post, _id: post._id.toString() }} />
                </div>
                
                {isVerified && (
                  <div className="absolute top-5 left-5 z-20 bg-emerald-500/20 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-4 h-4" /> Đã xác thực
                  </div>
                )}
                
                <PostImageGallery images={post.images || []} />
              </div>

            {/* Title & Info */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 relative overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex flex-wrap gap-3 mb-6">
                {post.property_type && (
                  <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-bold border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    {post.property_type}
                  </span>
                )}
                <span className="px-4 py-1.5 bg-slate-800/50 text-slate-400 rounded-full text-sm font-medium border border-white/5">
                  Đăng ngày {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-5 font-space tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-start gap-3 text-slate-300 mb-8 pb-8 border-b border-white/10">
                <MapPin className="w-6 h-6 mt-0.5 shrink-0 text-violet-400" />
                <span className="text-lg leading-relaxed">{fullAddress}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <div className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-widest">Mức giá thuê</div>
                  <div className="flex items-end gap-2">
                    <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 font-space glow-cyan-text">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                    </div>
                    <span className="text-lg font-medium text-slate-500 mb-1">/tháng</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-300">
                   {post.area_sqm && (
                     <div className="flex flex-col items-center gap-1">
                       <Maximize className="w-6 h-6 text-slate-400" />
                       <span className="font-semibold">{post.area_sqm} m²</span>
                     </div>
                   )}
                   <div className="flex flex-col items-center gap-1">
                     <Home className="w-6 h-6 text-slate-400" />
                     <span className="font-semibold">1 PN</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                     <Bath className="w-6 h-6 text-slate-400" />
                     <span className="font-semibold">1 WC</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Thông số kỹ thuật / Tiện ích */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 relative overflow-hidden">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-space">
                <FileText className="w-6 h-6 text-cyan-400" /> Thông tin chi tiết
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {post.utility_costs && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                      <Bolt className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Chi phí dịch vụ</div>
                      <div className="text-slate-400 leading-relaxed">{post.utility_costs}</div>
                    </div>
                  </div>
                )}
                
                {post.contract_terms && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Điều kiện hợp đồng</div>
                      <div className="text-slate-400 leading-relaxed">{post.contract_terms}</div>
                    </div>
                  </div>
                )}

                {post.target_audience && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Đối tượng phù hợp</div>
                      <div className="text-slate-400 leading-relaxed">{post.target_audience}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 font-space">Mô tả phòng</h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="whitespace-pre-line text-slate-300 leading-relaxed text-lg">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Contact Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
              {/* Highlight gradient at the top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"></div>

              <div className="text-center mb-6 pb-6 border-b border-white/10 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] p-1">
                   <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-white">
                      {post.ctv_id?.name?.charAt(0) || 'U'}
                   </div>
                </div>
                <h3 className="font-space font-bold text-xl text-white tracking-wide">{post.ctv_id?.name || 'Ẩn danh'}</h3>
                <p className="text-cyan-400 text-sm mt-1 font-medium">Chuyên viên tư vấn</p>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="[&>button]:w-full [&>button]:py-4 [&>button]:rounded-xl [&>button]:font-bold [&>button]:text-lg">
                  <ContactButton 
                    postId={post._id.toString()} 
                    ctvId={post.ctv_id?._id?.toString() || ''}
                    postTitle={post.title}
                  />
                </div>
                
                {ctvPhone && (
                  <a 
                    href={`tel:${ctvPhone}`} 
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-lg">{ctvPhone}</span>
                  </a>
                )}
                
                {ctvPhone && (
                  <a 
                    href={`https://zalo.me/${ctvPhone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-blue-500/10 text-blue-400 rounded-xl font-bold hover:bg-blue-500/20 transition-all border border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  >
                    <span className="font-black text-xl leading-none">Zalo</span>
                    <span className="text-lg">Nhắn tin Zalo</span>
                  </a>
                )}
              </div>
              
              <div className="mt-8 pt-5 border-t border-white/10 flex items-start gap-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 relative z-10">
                <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  <span className="font-bold text-amber-400">Lưu ý an toàn:</span> Không bao giờ chuyển khoản đặt cọc trước khi đến xem phòng trực tiếp và ký hợp đồng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Posts */}
        {similarPosts && similarPosts.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-space tracking-tight">Gợi ý tương tự</h2>
              <Link href="/" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-2 group bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPosts.map((p: any) => {
                 p._id = p._id.toString(); // Ensure ID is string for client component
                 return <GlassPropertyCard key={p._id} post={p} />
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
