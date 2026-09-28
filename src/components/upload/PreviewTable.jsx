export default function PreviewTable({ records, maxRows = 20 }) {
  if (!records || records.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-500">No valid records to preview.</p>;
  }

  const display = records.slice(0, maxRows);
  const remaining = records.length - display.length;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <div className="max-h-[340px] overflow-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-gray-50 text-left">
            <tr>
              <th className="px-2 py-1.5 font-medium border-b">#</th>
              <th className="px-2 py-1.5 font-medium border-b">Name</th>
              <th className="px-2 py-1.5 font-medium border-b">Email</th>
              <th className="px-2 py-1.5 font-medium border-b">Phone</th>
              <th className="px-2 py-1.5 font-medium border-b">Type</th>
              <th className="px-2 py-1.5 font-medium border-b">Link</th>
              <th className="px-2 py-1.5 font-medium border-b">Download</th>
              <th className="px-2 py-1.5 font-medium border-b">Date Added</th>
            </tr>
          </thead>
          <tbody>
            {display.map((r, idx) => (
              <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-2 py-1.5 text-gray-500">{idx + 1}</td>
                <td className="px-2 py-1.5 truncate max-w-[140px]" title={r.name}>{r.name}</td>
                <td className="px-2 py-1.5 truncate max-w-[160px]" title={r.email}>{r.email}</td>
                <td className="px-2 py-1.5">{r.phone}</td>
                <td className="px-2 py-1.5"><span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">{r.type}</span></td>
                <td className="px-2 py-1.5">{r.linkStatus}</td>
                <td className="px-2 py-1.5">{r.downloadStatus}</td>
                <td className="px-2 py-1.5">{new Date(r.dateAdded).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <p className="border-t bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          Showing {display.length} of {records.length} valid records. {remaining} more will be imported.
        </p>
      )}
    </div>
  );
}
