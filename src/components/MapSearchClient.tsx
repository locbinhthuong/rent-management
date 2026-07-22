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

  // Tính toán Quận phổ biến
  const districtCounts: Record<string, number> = {};
  posts.forEach(p => {
    if (p.district) districtCounts[p.district] = (districtCounts[p.district] || 0) + 1;
  });
  let mostPopularDistrict = '';
  let maxCount = 0;
  Object.entries(districtCounts).forEach(([district, count]) => {
    if (count > maxCount) {
      mostPopularDistrict = district;
      maxCount = count;
    }
  });

  const popularDistrictPosts = mostPopularDistrict 
    ? posts.filter(p => p.district === mostPopularDistrict) 
    : [];

  // Tính toán danh sách theo Giá từ thấp đến cao
  const priceSortedPosts = [...posts].sort((a, b) => (a.price || 0) - (b.price || 0));

  const renderPostCarousel = (title: string, displayPosts: any[]) => {
    if (!displayPosts || displayPosts.length === 0) return null;
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-space tracking-tight">{title}</h2>
        </div>
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {displayPosts.map((post) => (
            <div key={post._id} className="w-[46vw] sm:w-[250px] md:w-auto md:min-w-0 snap-start shrink-0">
              <GlassPropertyCard 
                post={post} 
                isActive={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-8 pt-0 flex flex-col relative z-10">
      
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm mt-4">
          <p className="text-slate-600 font-space">Không tìm thấy không gian sống nào phù hợp.</p>
        </div>
      ) : (
        <>
          {renderPostCarousel('Kết quả nổi bật', posts)}
          
          {popularDistrictPosts.length > 0 && renderPostCarousel(mostPopularDistrict ? `Phổ biến tại ${mostPopularDistrict}` : 'Khu vực phổ biến', popularDistrictPosts)}
          
          {priceSortedPosts.length > 0 && renderPostCarousel('Giá tốt nhất', priceSortedPosts)}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 bg-slate-100/80 text-slate-700 font-medium rounded-xl disabled:opacity-50 hover:bg-slate-200 transition"
              >
                Trước
              </button>
              <span className="text-slate-600 font-medium text-sm px-2">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-slate-100/80 text-slate-700 font-medium rounded-xl disabled:opacity-50 hover:bg-slate-200 transition"
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
