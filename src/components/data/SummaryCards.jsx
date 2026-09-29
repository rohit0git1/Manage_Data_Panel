const cards = [
  {
    key: "all",
    label: "All Data",
    getValue: (s) => s?.all,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-slate-500">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "students",
    label: "Students",
    getValue: (s) => s?.students,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-slate-500">
        <path d="M12 3L1 9l11 6 11-6-11-6z" />
        <path d="M5 13.5L12 17l7-3.5" />
      </svg>
    ),
  },
  {
    key: "teachers",
    label: "Teachers",
    getValue: (s) => s?.teachers,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-slate-500">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "institutes",
    label: "Institutes",
    getValue: (s) => s?.institutes,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-slate-500">
        <rect x="3" y="7" width="18" height="13" rx="1.5" />
        <path d="M8 7V5a4 4 0 014-4h0a4 4 0 014 4v2" />
      </svg>
    ),
  },
];

export default function SummaryCards({ summary, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="animate-pulse rounded-lg border bg-white p-4">
            <div className="h-7 w-7 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-16 bg-slate-200 rounded" />
            <div className="mt-2 h-6 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Unable to load summary: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-lg border bg-white p-4"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-50 ring-1 ring-slate-100">
            {c.icon}
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">{c.label}</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{c.getValue(summary) ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
