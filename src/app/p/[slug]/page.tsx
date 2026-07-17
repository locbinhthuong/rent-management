import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Home, Bolt, FileText, Users, Calendar, ShieldCheck, ChevronLeft, ArrowRight, Bath, Maximize } from 'lucide-react';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Post from '@/models/Post';
import User from '@/models/User';
import ContactButton from '@/components/ContactButton';
import WishlistButton from '@/components/WishlistButton';
import { notFound } from 'next/navigation';
import GlassPropertyCard from '@/components/GlassPropertyCard';
import PostImageGallery from '@/components/PostImageGallery';

export const revalidate = 60; // Cache for 60 seconds to improve load times

async function getPostDetail(identifier: string) {
  try {
    await connectDB();
    User.init();
    
    const query = mongoose.isValidObjectId(identifier) 
      ? { _id: identifier } 
      : { slug: identifier };
      
    const post = await Post.findOne(query).populate('ctv_id', 'name phone').lean();
    
    if (!post) return null;

    // Tăng views bất đồng bộ (không block quá trình render)
    Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec().catch(() => {});
    
    // Tìm các phòng tương tự cùng loại hoặc cùng khu vực
    const similarPosts = await Post.find({
      _id: { $ne: post._id },
      approval_status: 'Approved',
      rental_status: 'Available',
      $or: [
        { property_type: post.property_type },
        // Lấy 1 phần của địa chỉ để tìm (ví dụ: Quận 1)
        { address: { $regex: (post.address || '').split(',').pop()?.trim() || '', $options: 'i' } }
      ]
    }).limit(4).lean() as any[];
    
    const serializePost = (p: any) => ({
      ...p,
      _id: p._id.toString(),
      room_id: p.room_id ? p.room_id.toString() : null,
      ctv_id: p.ctv_id ? { ...p.ctv_id, _id: p.ctv_id._id.toString() } : null,
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
      bumped_at: p.bumped_at?.toISOString()
    });

    return { 
      post: serializePost(post), 
      similarPosts: similarPosts.map(serializePost) 
    };
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    await connectDB();
    const query = mongoose.isValidObjectId(resolvedParams.slug) ? { _id: resolvedParams.slug } : { slug: resolvedParams.slug };
    const post = await Post.findOne(query).lean();
    if (!post) return { title: 'Không tìm thấy - thuenhatro.com' };
    return {
      title: `${post.title} | thuenhatro.com`,
      description: post.description.slice(0, 150) + '...',
      openGraph: {
        images: post.images && post.images.length > 0 ? [post.images[0]] : [],
      },
    };
  } catch (e) {
    return { title: 'thuenhatro.com' };
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getPostDetail(resolvedParams.slug);
  
  if (!data || !data.post) {
    notFound();
  }
  
  const { post, similarPosts } = data as any;
  const price = post.price || 0;
  const fullAddress = [post.address, post.district, post.city].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ';
  const ctvPhone = post.ctv_id?.phone || '';
  const isVerified = post.is_verified || false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-600 hover:text-cyan-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-200/50">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                <Home className="w-5 h-5 text-cyan-400 hidden sm:block" />
              </div>
              <span className="font-space font-bold text-xl tracking-tight text-slate-900">thuenhatro<span className="text-cyan-400">.com</span></span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200 relative">
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
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="flex flex-wrap gap-3 mb-6">
                {post.property_type && (
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold border border-slate-200">
                    {post.property_type}
                  </span>
                )}
                <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-sm font-medium border border-slate-200">
                  Đăng ngày {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-5 font-space tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-start gap-3 text-slate-700 mb-8 pb-8 border-b border-slate-200">
                <MapPin className="w-6 h-6 mt-0.5 shrink-0 text-violet-400" />
                <span className="text-lg leading-relaxed">{fullAddress}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <div className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-widest">Mức giá thuê</div>
                  <div className="flex items-end gap-2">
                    <div className="text-4xl md:text-5xl font-extrabold text-cyan-500 font-space">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                    </div>
                    <span className="text-lg font-medium text-slate-500 mb-1">/tháng</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-700">
                   {post.area_sqm && (
                     <div className="flex flex-col items-center gap-1">
                       <Maximize className="w-6 h-6 text-slate-600" />
                       <span className="font-semibold">{post.area_sqm} m²</span>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Thông số kỹ thuật / Tiện ích */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 font-space">
                <FileText className="w-6 h-6 text-cyan-500" /> Thông tin chi tiết
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {post.utility_costs && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                      <Bolt className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Chi phí dịch vụ</div>
                      <div className="text-slate-600 leading-relaxed">{post.utility_costs}</div>
                    </div>
                  </div>
                )}
                
                {post.contract_terms && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Điều kiện hợp đồng</div>
                      <div className="text-slate-600 leading-relaxed">{post.contract_terms}</div>
                    </div>
                  </div>
                )}

                {post.target_audience && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Đối tượng phù hợp</div>
                      <div className="text-slate-600 leading-relaxed">{post.target_audience}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tiện ích có sẵn */}
            {post.amenities && post.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-space flex items-center gap-3">
                  <Bolt className="w-6 h-6 text-cyan-500" /> Tiện ích có sẵn
                </h2>
                <div className="flex flex-wrap gap-3">
                  {post.amenities.map((amenity: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mô tả */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-space">Mô tả phòng</h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="whitespace-pre-line text-slate-700 leading-relaxed text-lg">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Contact Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-md border border-slate-200 relative overflow-hidden">
              <div className="text-center mb-6 pb-6 border-b border-slate-200 relative z-10">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200 p-1">
                   <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-black text-slate-800">
                      {post.ctv_id?.name?.charAt(0) || 'U'}
                   </div>
                </div>
                <h3 className="font-space font-bold text-xl text-slate-900 tracking-wide">{post.ctv_id?.name || 'Ẩn danh'}</h3>
                <p className="text-slate-500 text-sm mt-1 font-medium">Chuyên viên tư vấn</p>
              </div>
              
              <div className="space-y-4 relative z-10">
                <ContactButton 
                  postId={post._id.toString()} 
                  ctvId={post.ctv_id?._id?.toString() || ''}
                  postTitle={post.title}
                  ctvPhone={ctvPhone}
                />
              </div>
              
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100 relative z-10">
                <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">Lưu ý an toàn:</span> Không bao giờ chuyển khoản đặt cọc trước khi đến xem phòng trực tiếp và ký hợp đồng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Posts */}
        {similarPosts && similarPosts.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-space tracking-tight">Gợi ý tương tự</h2>
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
