const typeColors = {
  Students: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Teachers: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Mentors: "bg-violet-50 text-violet-700 ring-violet-200",
  "Job Seekers": "bg-orange-50 text-orange-700 ring-orange-200",
  Institutes: "bg-amber-50 text-amber-700 ring-amber-200",
  Others: "bg-slate-100 text-slate-700 ring-slate-200",
};

const linkColors = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const downloadColors = {
  Pending: "bg-slate-100 text-slate-700 ring-slate-200",
  Downloaded: "bg-sky-50 text-sky-700 ring-sky-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function BaseBadge({ className, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function TypeBadge({ value }) {
  return <BaseBadge className={typeColors[value] || typeColors.Others}>{value}</BaseBadge>;
}

export function LinkBadge({ value }) {
  return <BaseBadge className={linkColors[value] || "bg-slate-100 text-slate-700 ring-slate-200"}>{value}</BaseBadge>;
}

export function DownloadBadge({ value }) {
  return <BaseBadge className={downloadColors[value] || "bg-slate-100 text-slate-700 ring-slate-200"}>{value}</BaseBadge>;
}
