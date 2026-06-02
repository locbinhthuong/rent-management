import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="w-full flex flex-col bg-slate-950 overflow-hidden min-h-screen">
      {/* Navbar Skeleton */}
      <header className="h-16 bg-slate-950/50 backdrop-blur-xl z-50 border-b border-white/10 flex items-center justify-between px-4 lg:px-8">
        <Skeleton className="h-8 w-40 bg-white/10" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 bg-white/10" />
          <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="pt-16 flex-1 flex flex-col">
        {/* Hero Skeleton */}
        <div className="w-full h-[40vh] flex flex-col items-center justify-center p-4">
          <Skeleton className="h-16 w-3/4 md:w-1/2 bg-white/5 mb-8" />
          <Skeleton className="h-14 w-full md:w-2/3 rounded-full bg-white/10" />
        </div>

        {/* List Skeleton */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-48 w-full rounded-2xl bg-white/5" />
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
