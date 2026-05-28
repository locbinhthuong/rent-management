import { MapPin, Bolt, FileText, Users, Calendar } from 'lucide-react';

export default function LoadingPostDetail() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm h-16 flex items-center px-4">
        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
        <div className="ml-4 w-32 h-6 bg-slate-200 rounded-md"></div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Skeleton */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
              <div className="w-full h-[400px] bg-slate-200 rounded-2xl"></div>
            </div>

            {/* Title & Info Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex gap-2 mb-4">
                <div className="w-24 h-6 bg-slate-200 rounded-lg"></div>
                <div className="w-24 h-6 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="w-3/4 h-8 bg-slate-200 rounded-lg mb-4"></div>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-slate-300" />
                <div className="w-1/2 h-5 bg-slate-200 rounded-md"></div>
              </div>
              <div className="w-40 h-8 bg-slate-200 rounded-lg"></div>
            </div>

            {/* Details Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="w-48 h-6 bg-slate-200 rounded-md mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                    <div className="w-full">
                      <div className="w-24 h-4 bg-slate-200 rounded-md mb-2"></div>
                      <div className="w-full h-4 bg-slate-200 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-3"></div>
              <div className="w-32 h-5 bg-slate-200 rounded-md mx-auto mb-2"></div>
              <div className="w-24 h-4 bg-slate-200 rounded-md mx-auto mb-6"></div>
              
              <div className="space-y-3">
                <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-full h-12 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
