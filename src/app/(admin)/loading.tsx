import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-sm p-8 rounded-3xl">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}
