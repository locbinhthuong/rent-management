import { Loader2, ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoadingPostDetail() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 hover:text-indigo-600 transition p-2 -ml-2 rounded-lg hover:bg-slate-50">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-indigo-600 hidden sm:block" />
              <span className="font-bold text-xl text-slate-800">RentHome</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </main>
    </div>
  );
}
