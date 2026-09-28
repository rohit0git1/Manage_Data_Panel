export default function SummaryCards({ summary, loading, error }) {
  const cards = [
    { label: "All Data", value: summary?.all, key: "all" },
    { label: "Students", value: summary?.students, key: "students" },
    { label: "Teachers", value: summary?.teachers, key: "teachers" },
    { label: "Institutes", value: summary?.institutes, key: "institutes" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="animate-pulse rounded-lg border bg-white p-4">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="mt-3 h-6 w-10 bg-gray-200 rounded" />
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
        <div key={c.key} className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{c.label}</p>
          <p className="mt-1 text-2xl font-bold">{c.value ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
