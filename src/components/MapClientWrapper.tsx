'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4 glow-cyan"></div>
      <p className="text-cyan-400 font-medium font-space">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function MapClientWrapper({ posts }: { posts: any[] }) {
  return <MapComponent posts={posts} hoveredPostId={null} />;
}
