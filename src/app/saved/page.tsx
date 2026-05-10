'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Heart, MapPin } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      const posts = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setSavedPosts(posts);
    };

    loadWishlist();
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => window.removeEventListener('wishlist-updated', loadWishlist);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">RentHome</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Heart className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline">Phòng đã lưu ({savedPosts.length})</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Phòng trọ đã lưu</h1>
            <p className="text-slate-500 text-sm mt-1">Danh sách các phòng bạn đã quan tâm</p>
          </div>
        </div>

        {savedPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Bạn chưa lưu phòng nào.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
              Quay lại trang chủ tìm phòng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-200 flex flex-col relative">
                <WishlistButton post={post} />
                
                <Link href={`/p/${post._id}`} className="flex-1 flex flex-col cursor-pointer block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-extrabold text-indigo-600 shadow-md">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price || 0)}/tháng
                    </div>
                    {post.property_type && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">
                        {post.property_type}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition mb-3 text-lg">
                      {post.title}
                    </h3>
                    <div className="flex items-start gap-2 text-slate-600 text-sm mt-auto">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">{post.address}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
