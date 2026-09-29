import { TypeBadge, LinkBadge, DownloadBadge } from "./Badges.jsx";

export default function DataTable({ records, pagination, loading, selected, onToggleSelect, onToggleAll, onEdit, onDelete, deletingId }) {
  const allSelected = records.length > 0 && records.every((r) => selected.has(r._id));
  const someSelected = records.some((r) => selected.has(r._id));

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-11 bg-slate-50 border-b" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 border-b last:border-0">
              <div className="h-4 w-4 bg-slate-100 rounded" />
              <div className="h-4 w-8 bg-slate-100 rounded" />
              <div className="h-4 flex-1 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <p className="p-4 text-center text-sm font-medium text-slate-500">Loading records...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1150px] w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold tracking-wider text-slate-500">
              <th className="w-10 px-3 py-3 border-b border-slate-200">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
              </th>
              <th className="px-2 py-3 border-b border-slate-200 font-semibold">S.N.</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Name</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Email</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Phone No.</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Address</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Organisation</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Type</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Link Status</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Download Status</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Added On</th>
              <th className="px-3 py-3 border-b border-slate-200 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r, idx) => {
              const sn = (pagination.page - 1) * pagination.limit + idx + 1;
              return (
                <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(r._id)}
                      onChange={() => onToggleSelect(r._id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                  </td>
                  <td className="px-2 py-3 text-slate-400 font-medium text-xs">{sn}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900 max-w-[150px] truncate" title={r.name}>
                    {r.name}
                  </td>
                  <td className="px-3 py-3 text-slate-600 max-w-[170px] truncate" title={r.email}>
                    {r.email}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-700 font-medium">{r.phone}</td>
                  <td className="px-3 py-3 max-w-[140px] truncate text-slate-600" title={r.address}>
                    {r.address || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-3 max-w-[140px] truncate text-slate-600" title={r.organisation}>
                    {r.organisation || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <TypeBadge value={r.type} />
                  </td>
                  <td className="px-3 py-3">
                    <LinkBadge value={r.linkStatus} />
                  </td>
                  <td className="px-3 py-3">
                    <DownloadBadge value={r.downloadStatus} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-slate-500">
                    {new Date(r.dateAdded).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onEdit(r)}
                        disabled={deletingId === r._id}
                        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        disabled={deletingId === r._id}
                        className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deletingId === r._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
