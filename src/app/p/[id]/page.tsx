import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Home, Bolt, FileText, Users, Calendar, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import ContactButton from '@/components/ContactButton';
import WishlistButton from '@/components/WishlistButton';
import { notFound } from 'next/navigation';

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
    }).limit(4).lean();
    
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
  const address = post.address || 'Chưa cập nhật địa chỉ';
  const ctvPhone = post.ctv_id?.phone || '';
  const isVerified = post.is_verified || false;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 hover:text-indigo-600 transition p-2 -ml-2 rounded-lg hover:bg-slate-50">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-indigo-600 hidden sm:block" />
              <span className="font-bold text-xl text-slate-800">RentHome</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 relative">
              <WishlistButton post={{ ...post, _id: post._id.toString() }} />
              {isVerified && (
                <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" /> Đã xác thực
                </div>
              )}
              
              {post.images && post.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 h-[400px]">
                  <div className="col-span-4 md:col-span-3 row-span-2 relative rounded-2xl overflow-hidden group">
                    <Image src={post.images[0]} alt="Phòng" fill className="object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  {post.images.slice(1, 3).map((img: string, idx: number) => (
                    <div key={idx} className="hidden md:block col-span-1 relative rounded-2xl overflow-hidden group">
                      <Image src={img} alt="Phòng" fill className="object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center">
                  <span className="text-slate-400">Không có hình ảnh</span>
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.property_type && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100">
                    {post.property_type}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-snug mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-start gap-3 text-slate-600 mb-6 pb-6 border-b border-slate-100">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-slate-400" />
                <span className="text-lg leading-relaxed">{address}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-sm font-medium mb-1">Mức giá thuê</div>
                  <div className="text-2xl font-extrabold text-indigo-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}<span className="text-sm font-medium text-slate-500">/tháng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông số kỹ thuật / Tiện ích */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Thông tin chi tiết
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {post.utility_costs && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <Bolt className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">Chi phí dịch vụ</div>
                      <div className="text-slate-600 text-sm mt-1">{post.utility_costs}</div>
                    </div>
                  </div>
                )}
                
                {post.contract_terms && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">Điều kiện hợp đồng</div>
                      <div className="text-slate-600 text-sm mt-1">{post.contract_terms}</div>
                    </div>
                  </div>
                )}

                {post.target_audience && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">Đối tượng phù hợp</div>
                      <div className="text-slate-600 text-sm mt-1">{post.target_audience}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Mô tả phòng</h2>
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Contact Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <div className="text-center mb-6 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-black">{post.ctv_id?.name?.charAt(0) || 'U'}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800">{post.ctv_id?.name || 'Ẩn danh'}</h3>
                <p className="text-slate-500 text-sm mt-1">Cộng tác viên tư vấn</p>
              </div>
              
              <div className="space-y-3">
                <ContactButton 
                  postId={post._id.toString()} 
                  ctvId={post.ctv_id?._id?.toString() || ''}
                  postTitle={post.title}
                />
                
                {ctvPhone && (
                  <a 
                    href={`tel:${ctvPhone}`} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition shadow-sm border border-emerald-100 hover:border-emerald-600"
                  >
                    <Phone className="w-5 h-5" />
                    {ctvPhone}
                  </a>
                )}
                
                {ctvPhone && (
                  <a 
                    href={`https://zalo.me/${ctvPhone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100 hover:border-blue-600"
                  >
                    <span className="font-black text-lg leading-none">Zalo</span>
                    Nhắn tin Zalo
                  </a>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-3 bg-amber-50 p-3 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <span className="font-bold">Lưu ý an toàn:</span> Không bao giờ chuyển khoản đặt cọc trước khi đến xem phòng trực tiếp và ký hợp đồng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Posts */}
        {similarPosts && similarPosts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Phòng trọ tương tự</h2>
              <Link href="/" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPosts.map((p: any) => {
                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                return (
                  <Link href={`/p/${p._id}`} key={p._id.toString()} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-slate-200">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-extrabold text-indigo-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price || 0)}/th
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition text-sm">{p.title}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{p.address}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
