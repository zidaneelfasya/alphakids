export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-6 w-44 rounded-full bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-8 w-72 rounded-2xl bg-slate-200/90 dark:bg-slate-800" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/80" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-36 rounded-full bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-9 w-32 rounded-full bg-slate-200/80 dark:bg-slate-800" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-slate-200/80 dark:bg-slate-800" />
              <div className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-28 rounded-lg bg-slate-200/90 dark:bg-slate-800" />
              <div className="h-3 w-36 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area / Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-lg bg-slate-200/90 dark:bg-slate-800" />
            <div className="h-3.5 w-64 rounded bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
          <div className="h-9 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* Placeholder Rows */}
        <div className="space-y-3.5">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-slate-200/90 dark:bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 rounded-full bg-slate-200/70 dark:bg-slate-800" />
                <div className="h-8 w-16 rounded-lg bg-slate-200/80 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
