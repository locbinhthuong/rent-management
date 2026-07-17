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
    <div className="w-full max-w-5xl mx-auto px-4 pb-8 pt-0 flex flex-col gap-4 relative z-10">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-space tracking-tight">Kết quả nổi bật</h2>
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
