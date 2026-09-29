export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;

  if (total === 0) return null;

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-xs text-slate-500 shadow-sm">
        <span>
          Showing <span className="font-semibold text-slate-700">{total}</span> record{total !== 1 ? "s" : ""}
        </span>
        <span className="hidden sm:inline">Page {page} of {totalPages}</span>
      </div>
    );
  }

  const pages = [];
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2.5 shadow-sm">
      <span className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
        <span className="hidden sm:inline"> • Page {page} of {totalPages}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {start > 1 && <span className="px-1 text-xs text-slate-400">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold border shadow-sm ${
              p === page
                ? "bg-slate-900 text-white border-slate-900 shadow"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="px-1 text-xs text-slate-400">…</span>}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
