export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
      <div className="h-40 w-full bg-zinc-200" />
      <div className="p-3 space-y-2">
        <div className="h-5 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-6 bg-zinc-200 rounded w-28 mt-3" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-[320px,1fr] gap-6 items-start animate-pulse">
      <div className="w-full max-w-[320px] aspect-square bg-zinc-200 rounded-xl border" />
      <div className="space-y-3">
        <div className="h-8 bg-zinc-200 rounded w-2/3" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-5 bg-zinc-200 rounded" />
          <div className="h-5 bg-zinc-200 rounded" />
          <div className="h-5 bg-zinc-200 rounded" />
          <div className="h-5 bg-zinc-200 rounded" />
        </div>
        <div className="h-10 bg-zinc-200 rounded w-44" />
      </div>
    </div>
  );
}
