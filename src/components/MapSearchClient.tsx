'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
      <div className="w-full md:w-2/5 h-full overflow-y-auto bg-slate-950/70 relative z-10 custom-scrollbar border-l border-white/5">
        
        {/* Subtle glass effect behind the list */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md pointer-events-none z-[-1]"></div>
        
        <div className="p-4 md:p-6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white font-space tracking-tight">Khu vực Lân Cận</h1>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              {posts.length} kết quả
            </span>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-sm">
              <p className="text-slate-400 font-space">Không tìm thấy không gian sống nào.</p>
            </div>
          ) : (
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
