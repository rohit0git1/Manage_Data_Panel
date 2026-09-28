const typeColors = {
  Students: "bg-blue-50 text-blue-700 border-blue-200",
  Teachers: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mentors: "bg-purple-50 text-purple-700 border-purple-200",
  "Job Seekers": "bg-orange-50 text-orange-700 border-orange-200",
  Institutes: "bg-amber-50 text-amber-700 border-amber-200",
  Others: "bg-gray-100 text-gray-700 border-gray-200",
};

const linkColors = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Sent: "bg-green-50 text-green-700 border-green-200",
};

const downloadColors = {
  Pending: "bg-gray-100 text-gray-700 border-gray-200",
  Downloaded: "bg-sky-50 text-sky-700 border-sky-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

export function TypeBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${typeColors[value] || typeColors.Others}`}>
      {value}
    </span>
  );
}

export function LinkBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${linkColors[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}

export function DownloadBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${downloadColors[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}
