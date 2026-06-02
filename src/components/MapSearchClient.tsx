'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import GlassPropertyCard from '@/components/GlassPropertyCard';

// Dynamically import the MapComponent so Leaflet doesn't break SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function MapSearchClient({ posts }: { posts: any[] }) {
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Left side: Map (Hidden on mobile, uses bottom sheet or tabs ideally, but we hide it for simplicity or make it 100% height and float cards) */}
      <div className="hidden md:block w-full md:w-3/5 h-full relative z-0">
        <MapComponent posts={posts} hoveredPostId={hoveredPostId} />
      </div>

      {/* Right side: Glassmorphism List */}
      {/* On mobile, this takes full width. On desktop, it takes the right 2/5 */}
      <div className="w-full md:w-2/5 h-full overflow-y-auto bg-slate-50/50 relative z-10 custom-scrollbar">
        
        {/* Subtle glass effect behind the list */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] pointer-events-none z-[-1]"></div>
        
        <div className="p-4 md:p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-slate-800">Kết quả tìm kiếm</h1>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {posts.length} phòng
            </span>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
              <p className="text-slate-500">Không tìm thấy phòng trống nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
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
