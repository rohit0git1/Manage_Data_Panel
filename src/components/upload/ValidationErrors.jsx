export default function ValidationErrors({ errors, maxShow = 30 }) {
  if (!errors || errors.length === 0) return null;

  const display = errors.slice(0, maxShow);
  const remaining = errors.length - display.length;

  // Group by row for nicer display
  const byRow = {};
  display.forEach((e) => {
    const key = `Row ${e.row}`;
    if (!byRow[key]) byRow[key] = [];
    byRow[key].push(e);
  });

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
      <h4 className="text-sm font-semibold text-red-800">Invalid rows: {errors.length}</h4>
      <div className="mt-2 max-h-[220px] overflow-auto space-y-2 pr-1">
        {Object.entries(byRow).map(([rowLabel, rowErrors]) => (
          <div key={rowLabel} className="rounded bg-white px-2 py-1.5 text-xs">
            <span className="font-semibold text-red-700">{rowLabel}:</span>
            <ul className="ml-2 list-disc pl-4">
              {rowErrors.map((e, idx) => (
                <li key={idx} className="text-gray-700">
                  <span className="font-medium">{e.field}</span> — {e.reason}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <p className="mt-2 text-xs text-red-700">+ {remaining} more errors not shown. Fix and re-upload.</p>
      )}
      <p className="mt-2 text-xs text-gray-600">Fix the spreadsheet and re-upload. Invalid rows are not sent to the server.</p>
    </div>
  );
}
