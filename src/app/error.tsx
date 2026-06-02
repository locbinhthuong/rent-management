'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="flex flex-col items-center space-y-6 max-w-md text-center p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-space text-white">Đã xảy ra lỗi!</h2>
          <p className="text-slate-400">
            Hệ thống gặp sự cố ngoài ý muốn. Vui lòng thử lại sau.
          </p>
        </div>
        <Button
          onClick={() => reset()}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
        >
          Thử Lại Ngay
        </Button>
      </div>
    </div>
  );
}
