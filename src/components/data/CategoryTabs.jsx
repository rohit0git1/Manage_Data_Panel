const TABS = ["All Data", "Students", "Teachers", "Mentors", "Job Seekers", "Institutes", "Others"];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b bg-white px-1 py-1 sm:px-2">
      {TABS.map((tab) => {
        const isActive = active === tab || (active === "" && tab === "All Data");
        return (
          <button
            key={tab}
            onClick={() => onChange(tab === "All Data" ? "" : tab)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
