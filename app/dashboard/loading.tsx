export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="space-y-2.5">
          <div className="h-6 w-36 rounded-full bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-8 w-64 rounded-2xl bg-slate-200/90 dark:bg-slate-800" />
          <div className="h-4 w-80 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/80" />
        </div>
      </div>

      {/* Stats / Quick Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-slate-200/80 dark:bg-slate-800" />
              <div className="size-9 rounded-2xl bg-slate-100 dark:bg-slate-800/80" />
            </div>
            <div className="h-6 w-24 rounded-lg bg-slate-200/90 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Grid Content / Program Cards Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded-xl bg-slate-200/90 dark:bg-slate-800" />
          <div className="h-4 w-20 rounded bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="h-44 w-full bg-slate-100 dark:bg-slate-800/60" />
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded-lg bg-slate-200/90 dark:bg-slate-800" />
                  <div className="h-3.5 w-full rounded bg-slate-200/60 dark:bg-slate-800/60" />
                  <div className="h-3.5 w-2/3 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-slate-200/70 dark:bg-slate-800" />
                  <div className="h-8 w-24 rounded-full bg-slate-200/80 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
