const TABS = ["All Data", "Students", "Teachers", "Mentors", "Job Seekers", "Institutes", "Others"];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-xl border bg-white p-1.5 shadow-sm">
      {TABS.map((tab) => {
        const isActive = active === tab || (active === "" && tab === "All Data");
        return (
          <button
            key={tab}
            onClick={() => onChange(tab === "All Data" ? "" : tab)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
