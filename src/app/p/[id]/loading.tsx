import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-48 mb-6 bg-white/5" />
      
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-3/4 mb-4 bg-white/10" />
      <Skeleton className="h-6 w-1/3 mb-6 bg-white/5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <Skeleton className="w-full aspect-[4/3] rounded-2xl bg-white/10" />
          
          {/* Thumbnails */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-lg bg-white/5" />
            ))}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-40 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5" />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
