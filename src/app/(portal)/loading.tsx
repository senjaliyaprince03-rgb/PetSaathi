export default function PortalLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="luxury-grid relative overflow-hidden rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff1e8] p-7 shadow-soft sm:p-10 xl:p-12">
        <div className="max-w-3xl">
          <div className="h-3 w-40 animate-pulse rounded-full bg-indigo/15" />
          <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-ink/10" />
          <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded-full bg-ink/10" />
          <div className="mt-3 h-4 w-3/4 max-w-md animate-pulse rounded-full bg-ink/10" />
          <div className="mt-7 h-12 w-48 animate-pulse rounded-2xl bg-indigo/20" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2" aria-hidden="true">
        <div className="h-44 animate-pulse rounded-[2rem] border border-indigo/10 bg-paper/80 md:col-span-2 md:row-span-2" />
        <div className="h-40 animate-pulse rounded-[2rem] border border-indigo/10 bg-paper/80" />
        <div className="h-40 animate-pulse rounded-[2rem] border border-indigo/10 bg-paper/80" />
      </div>

      <span className="sr-only">Loading your workspace…</span>
    </div>
  );
}
