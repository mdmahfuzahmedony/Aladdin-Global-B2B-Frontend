export default function JustForYouSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between animate-pulse">
      {/* Image Skeleton */}
      <div className="h-44 w-full rounded-xl bg-slate-200 mb-4" />
      
      {/* Title Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>

      {/* Rating & Price Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="h-3 w-10 rounded bg-slate-200" />
        <div className="h-4 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
}