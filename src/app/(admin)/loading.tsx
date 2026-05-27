import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  );
}
