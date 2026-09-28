export default function Filters({ filters, onChange, onReset }) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.linkStatus}
        onChange={(e) => onChange("linkStatus", e.target.value)}
        className="rounded border bg-white px-2 py-1.5 text-sm"
      >
        <option value="">All Status (Link)</option>
        <option value="Pending">Pending</option>
        <option value="Sent">Sent</option>
      </select>

      <select
        value={filters.downloadStatus}
        onChange={(e) => onChange("downloadStatus", e.target.value)}
        className="rounded border bg-white px-2 py-1.5 text-sm"
      >
        <option value="">All Status (Download)</option>
        <option value="Pending">Pending</option>
        <option value="Downloaded">Downloaded</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => onChange("dateRange", e.target.value)}
        className="rounded border bg-white px-2 py-1.5 text-sm"
      >
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
      </select>

      <button
        onClick={onReset}
        className="rounded border bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );
}
