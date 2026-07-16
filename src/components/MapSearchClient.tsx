'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GlassPropertyCard from '@/components/GlassPropertyCard';
import { Map, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function MapSearchClient({ posts, pagination }: { posts: any[], pagination?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 relative z-10">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-space tracking-tight">Kết quả nổi bật</h2>
        <Link 
          href={`/map?${searchParams.toString()}`}
          className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
        >
          <Map className="w-4 h-4" />
          <span>Xem bản đồ</span>
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 font-space">Không tìm thấy không gian sống nào.</p>
        </div>
      ) : (
        <>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {posts.map((post) => (
              <div key={post._id} className="min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center shrink-0">
                <GlassPropertyCard 
                  post={post} 
                  isActive={false}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 bg-slate-100/80 text-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition"
              >
                Trước
              </button>
              <span className="text-slate-600 font-medium text-sm">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-slate-100/80 text-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Map Banner */}
      <Link href={`/map?${searchParams.toString()}`} className="mt-8 block relative rounded-3xl overflow-hidden group cursor-pointer border border-slate-200 shadow-lg h-40 md:h-48">
        <div className="absolute inset-0 bg-white">
          {/* A dark stylized map background image */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-transform group-hover:scale-105 duration-500">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(6,182,212,0.5)] glow-cyan">
            <MapPin className="w-6 h-6 text-slate-950" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 font-space tracking-wide">Khám phá trên bản đồ</h3>
        </div>
      </Link>
      
      {/* CSS for custom scrollbar in the list */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 0px; /* Hide scrollbar on mobile for cleaner look */
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
}
