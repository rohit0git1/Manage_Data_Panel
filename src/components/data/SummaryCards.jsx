const cards = [
  {
    key: "all",
    label: "All Data",
    getValue: (s) => s?.all,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-slate-600">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" />
      </svg>
    ),
    accent: "bg-slate-900 text-white",
  },
  {
    key: "students",
    label: "Students",
    getValue: (s) => s?.students,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-indigo-600">
        <path d="M12 3L1 9l11 6 11-6-11-6z" />
        <path d="M5 13.5L12 17l7-3.5" />
        <path d="M5 16.5L12 20l7-3.5" />
      </svg>
    ),
    accent: "bg-indigo-600 text-white",
  },
  {
    key: "teachers",
    label: "Teachers",
    getValue: (s) => s?.teachers,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-emerald-600">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    accent: "bg-emerald-600 text-white",
  },
  {
    key: "institutes",
    label: "Institutes",
    getValue: (s) => s?.institutes,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-amber-600">
        <rect x="3" y="7" width="18" height="13" rx="1.5" />
        <path d="M8 7V5a4 4 0 014-4h0a4 4 0 014 4v2" />
        <path d="M3 12h18M7 12v8M12 12v8M17 12v8" />
      </svg>
    ),
    accent: "bg-amber-500 text-white",
  },
];

export default function SummaryCards({ summary, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="animate-pulse rounded-xl border bg-white p-4">
            <div className="h-8 w-8 rounded-lg bg-gray-100" />
            <div className="mt-3 h-3 w-16 bg-gray-200 rounded" />
            <div className="mt-2 h-7 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Unable to load summary: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.key === "all" ? "bg-slate-900" : c.key === "students" ? "bg-indigo-50" : c.key === "teachers" ? "bg-emerald-50" : "bg-amber-50"}`}>
              <span className={c.key === "all" ? "text-white" : ""}>{c.icon}</span>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-medium text-slate-400">Live</span>
          </div>
          <p className="mt-3 text-xs font-medium tracking-wide text-slate-500 uppercase">{c.label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{c.getValue(summary) ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
