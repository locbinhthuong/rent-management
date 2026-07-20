import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-slate-50">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-10 w-48 bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-slate-200/50" />
        ))}
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Skeleton className="h-[400px] w-full rounded-xl bg-slate-200/50" />
      </div>
    </div>
  );
}
