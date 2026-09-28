import { TypeBadge, LinkBadge, DownloadBadge } from "./Badges.jsx";

export default function DataTable({ records, pagination, loading, selected, onToggleSelect, onToggleAll, onEdit, onDelete, deletingId }) {
  const allSelected = records.length > 0 && records.every((r) => selected.has(r._id));
  const someSelected = records.some((r) => selected.has(r._id));

  if (loading) {
    return (
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-100 border-b" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 border-b last:border-0">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <p className="p-4 text-center text-sm text-gray-500">Loading records...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-[1100px] w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
          <tr>
            <th className="w-10 px-3 py-2.5 border-b">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = !allSelected && someSelected;
                }}
                onChange={(e) => onToggleAll(e.target.checked)}
                className="rounded"
              />
            </th>
            <th className="px-2 py-2.5 border-b">S.N.</th>
            <th className="px-3 py-2.5 border-b">Name</th>
            <th className="px-3 py-2.5 border-b">Email</th>
            <th className="px-3 py-2.5 border-b">Phone No.</th>
            <th className="px-3 py-2.5 border-b">Address</th>
            <th className="px-3 py-2.5 border-b">Organisation</th>
            <th className="px-3 py-2.5 border-b">Type</th>
            <th className="px-3 py-2.5 border-b">Link Status</th>
            <th className="px-3 py-2.5 border-b">Download Status</th>
            <th className="px-3 py-2.5 border-b">Added On</th>
            <th className="px-3 py-2.5 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, idx) => {
            const sn = (pagination.page - 1) * pagination.limit + idx + 1;
            return (
              <tr key={r._id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(r._id)}
                    onChange={() => onToggleSelect(r._id)}
                    className="rounded"
                  />
                </td>
                <td className="px-2 py-2 text-gray-500">{sn}</td>
                <td className="px-3 py-2 font-medium max-w-[150px] truncate" title={r.name}>
                  {r.name}
                </td>
                <td className="px-3 py-2 max-w-[170px] truncate" title={r.email}>
                  {r.email}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{r.phone}</td>
                <td className="px-3 py-2 max-w-[140px] truncate" title={r.address}>
                  {r.address || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-3 py-2 max-w-[140px] truncate" title={r.organisation}>
                  {r.organisation || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-3 py-2">
                  <TypeBadge value={r.type} />
                </td>
                <td className="px-3 py-2">
                  <LinkBadge value={r.linkStatus} />
                </td>
                <td className="px-3 py-2">
                  <DownloadBadge value={r.downloadStatus} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                  {new Date(r.dateAdded).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(r)}
                      disabled={deletingId === r._id}
                      className="rounded border bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                      title="Edit record"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      disabled={deletingId === r._id}
                      className="rounded border bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
  );
}
