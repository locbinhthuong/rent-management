'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import GlassPropertyCard from '@/components/GlassPropertyCard';

// Dynamically import the MapComponent so Leaflet doesn't break SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4 glow-cyan"></div>
      <p className="text-cyan-400 font-medium font-space">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function MapSearchClient({ posts, pagination }: { posts: any[], pagination?: any }) {
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}#explore`);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Left side: Map */}
      <div className="hidden md:block w-full md:w-3/5 h-full relative z-0">
        <MapComponent posts={posts} hoveredPostId={hoveredPostId} />
      </div>

      {/* Right side: Glassmorphism List */}
      <div className="w-full md:w-2/5 h-full overflow-y-auto bg-slate-950/70 relative z-10 custom-scrollbar border-l border-white/5">
        
        {/* Subtle glass effect behind the list */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md pointer-events-none z-[-1]"></div>
        
        <div className="p-4 md:p-6 space-y-5">
          <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white font-space tracking-tight">Khu vực Lân Cận</h1>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] whitespace-nowrap">
                {pagination ? `${pagination.total} kết quả` : `${posts.length} kết quả`}
              </span>
            </div>
            
            {/* Quick Filter inside the list */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <span className="text-sm font-medium text-slate-400 whitespace-nowrap">Lọc nhanh:</span>
              <select 
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer focus:border-cyan-400 transition-colors"
                value={searchParams.get('property_type') || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (e.target.value) {
                    params.set('property_type', e.target.value);
                  } else {
                    params.delete('property_type');
                  }
                  params.set('page', '1'); // Reset page on filter change
                  router.push(`/?${params.toString()}#explore`);
                }}
              >
                <option value="" className="bg-slate-800">Tất cả loại phòng</option>
                <option value="Phòng trọ" className="bg-slate-800">Phòng trọ</option>
                <option value="Chung cư mini" className="bg-slate-800">Chung cư mini</option>
                <option value="Nhà nguyên căn" className="bg-slate-800">Nhà nguyên căn</option>
                <option value="Căn hộ dịch vụ" className="bg-slate-800">Căn hộ dịch vụ</option>
                <option value="Ký túc xá" className="bg-slate-800">Ký túc xá</option>
                <option value="Mặt bằng kinh doanh" className="bg-slate-800">Mặt bằng kinh doanh</option>
              </select>
            </div>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-sm">
              <p className="text-slate-400 font-space">Không tìm thấy không gian sống nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <GlassPropertyCard 
                    key={post._id} 
                    post={post} 
                    isActive={hoveredPostId === post._id}
                    onMouseEnter={() => setHoveredPostId(post._id)}
                    onMouseLeave={() => setHoveredPostId(null)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition"
                  >
                    Trước
                  </button>
                  <span className="text-slate-400 font-medium">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-700 transition"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* CSS for custom scrollbar in the list */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
}
