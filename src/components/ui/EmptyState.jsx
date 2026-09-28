export default function EmptyState({ title = "No records found", hint = "Try changing your search or filters.", onReset }) {
  return (
    <div className="rounded-lg border bg-white p-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-500">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
      {onReset && (
        <button onClick={onReset} className="mt-4 rounded border bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
          Reset Filters
        </button>
      )}
    </div>
  );
}
