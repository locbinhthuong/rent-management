import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Home, Filter, Search } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Room from '@/models/Room';
import Property from '@/models/Property';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function getActivePosts() {
  await connectDB();
  // Ensure models are registered
  Room.init();
  Property.init();
  User.init();

  const posts = await Post.find({ status: 'Active' })
    .populate({
      path: 'room_id',
      populate: {
        path: 'property_id',
        model: 'Property'
      }
    })
    .populate('ctv_id', 'name phone')
    .sort({ createdAt: -1 })
    .lean() as any[];

  return posts;
}

export default async function CustomerHome() {
  const posts = await getActivePosts();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">RentHome</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="text-indigo-600 font-bold">Trang chủ</Link>
            <Link href="/login" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
              Đăng nhập / Quản lý
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
          <div className="bg-white rounded-2xl p-2 flex items-center shadow-2xl">
            <div className="flex-1 flex items-center px-4 border-r border-slate-200 gap-3 text-slate-500">
              <Search className="w-5 h-5 text-indigo-500" />
              <input type="text" placeholder="Tìm theo khu vực, tên đường..." className="w-full bg-transparent outline-none text-slate-800 font-medium placeholder:font-normal" />
            </div>
            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => {
              const price = post.room_id?.price || 0;
              const address = post.room_id?.property_id?.address || 'Chưa cập nhật địa chỉ';
              const imageUrl = post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
              const ctvPhone = post.ctv_id?.phone || '';

              return (
                <div key={post._id.toString()} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col">
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
                  </div>
                  
                  <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-start gap-2 text-slate-500 text-sm flex-1">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">{address}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-xs text-slate-500 font-medium">
                        CTV: <span className="text-slate-800">{post.ctv_id?.name?.split(' ')[0] || 'Ẩn danh'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ctvPhone && (
                          <>
                            <a 
                              href={`tel:${ctvPhone}`}
                              className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition tooltip"
                              title="Gọi điện"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a 
                              href={`https://zalo.me/${ctvPhone}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-600 hover:text-white transition"
                            >
                              Zalo
                            </a>
                          </>
                        )}
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
