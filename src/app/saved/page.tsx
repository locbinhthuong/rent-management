'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import GlassPropertyCard from '@/components/GlassPropertyCard';
import { useSession } from 'next-auth/react';

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const loadWishlist = () => {
      if (session) {
        fetch('/api/wishlist')
          .then(res => res.json())
          .then(data => {
            if (data.wishlists) {
              setSavedPosts(data.wishlists.map((w: any) => {
                const p = w.post_id || {};
                return {
                  _id: p._id,
                  title: p.title,
                  price: p.price,
                  address: p.address,
                  images: p.images || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
                  property_type: p.property_type,
                  area_sqm: p.area_sqm,
                  is_verified: p.is_verified
                };
              }).filter((p: any) => p._id));
            }
          });
      } else {
        const posts = JSON.parse(localStorage.getItem('wishlist') || '[]');
        // map local storage format to match GlassPropertyCard expected format
        setSavedPosts(posts.map((p: any) => ({
          ...p,
          images: [p.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop']
        })));
      }
    };

    loadWishlist();
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => window.removeEventListener('wishlist-updated', loadWishlist);
  }, [session]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-center px-4">
        <h1 className="text-lg font-space font-bold tracking-wide">Yêu thích</h1>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4">
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold font-space">Đã lưu ({savedPosts.length})</h2>
        </div>

        {savedPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-60">
            <Heart className="w-16 h-16 text-slate-600 mb-4 stroke-[1.5]" />
            <p className="text-slate-400 font-medium">Bạn chưa lưu không gian sống nào</p>
            <Link href="/" className="mt-6 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-6 py-2 rounded-full font-bold transition-all border border-cyan-500/30">
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {savedPosts.map((post) => (
              <div key={post._id} className="relative">
                <GlassPropertyCard post={post} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
