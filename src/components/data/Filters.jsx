export default function Filters({ filters, onChange, onReset }) {
  const selectClass =
    "h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.linkStatus}
        onChange={(e) => onChange("linkStatus", e.target.value)}
        className={selectClass}
      >
        <option value="">Link — All Status</option>
        <option value="Pending">Pending</option>
        <option value="Sent">Sent</option>
      </select>

      <select
        value={filters.downloadStatus}
        onChange={(e) => onChange("downloadStatus", e.target.value)}
        className={selectClass}
      >
        <option value="">Download — All Status</option>
        <option value="Pending">Pending</option>
        <option value="Downloaded">Downloaded</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => onChange("dateRange", e.target.value)}
        className={selectClass}
      >
        <option value="">Date — All Time</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
      </select>

      <button
        onClick={onReset}
        className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
      >
        Reset
      </button>
    </div>
  );
}
