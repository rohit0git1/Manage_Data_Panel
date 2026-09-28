export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;

  if (total === 0) return null;
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-1 py-3 text-xs text-gray-500">
        <span>
          Showing {total} record{total !== 1 ? "s" : ""} • Page {page} of {totalPages}
        </span>
      </div>
    );
  }

  const pages = [];
  // Show up to 5 pages around current
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3">
      <span className="text-xs text-gray-500">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} • Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border bg-white px-2 py-1 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {start > 1 && <span className="px-1 text-xs text-gray-400">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`rounded px-2 py-1 text-xs font-medium border ${
              p === page ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="px-1 text-xs text-gray-400">…</span>}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border bg-white px-2 py-1 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
