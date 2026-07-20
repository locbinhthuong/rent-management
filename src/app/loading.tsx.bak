import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="w-full flex flex-col bg-slate-50 overflow-hidden min-h-screen">
      {/* Navbar Skeleton */}
      <header className="h-16 bg-slate-50/50 backdrop-blur-xl z-50 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
        <Skeleton className="h-8 w-40 bg-slate-200" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 bg-slate-200" />
          <Skeleton className="h-10 w-10 rounded-xl bg-slate-200" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="pt-16 flex-1 flex flex-col">
        {/* Hero Skeleton */}
        <div className="w-full h-[40vh] flex flex-col items-center justify-center p-4">
          <Skeleton className="h-16 w-3/4 md:w-1/2 bg-slate-200/50 mb-8" />
          <Skeleton className="h-14 w-full md:w-2/3 rounded-full bg-slate-200" />
        </div>

        {/* List Skeleton */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-48 w-full rounded-2xl bg-slate-200/50" />
              <Skeleton className="h-6 w-3/4 bg-slate-200/50" />
              <Skeleton className="h-4 w-1/2 bg-slate-200/50" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
