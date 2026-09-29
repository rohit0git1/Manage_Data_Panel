import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={active ? "text-white" : "text-slate-400"}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: "/manage-data",
    label: "Manage Data",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={active ? "text-white" : "text-slate-400"}>
        <path d="M3 3h18v4H3zM3 9h18v4H3zM3 17h18v4H3z" />
        <path d="M7 7h2M7 13h2M7 19h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: "/upload",
    label: "Upload Excel",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={active ? "text-white" : "text-slate-400"}>
        <path d="M12 16V3M12 3l5 5M12 3l-5 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
      </svg>
    ),
  },
  {
    path: "/social-ads",
    label: "Social & Ads",
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={active ? "text-white" : "text-slate-400"}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M8 12h8" />
        <path d="M16 16l4 4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/manage-data") return location.pathname === "/manage-data";
    if (path === "/upload") return location.pathname === "/upload" || location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-white/15 text-xs font-bold">BC</div>
          <div>
            <h2 className="text-sm font-bold tracking-wide">BLACKCUBE</h2>
            <p className="text-[11px] text-slate-400 -mt-0.5">Solutions LLC</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-slate-900 text-slate-200 sm:w-60 sm:min-h-screen sm:sticky sm:top-0 sm:h-screen ${
          open ? "flex" : "hidden sm:flex"
        }`}
      >
        {/* Logo */}
        <div className="hidden sm:flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-900 text-xs font-bold">BC</div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white">BLACKCUBE</h2>
            <p className="text-[11px] text-slate-400 -mt-0.5 tracking-wide">Solutions LLC</p>
          </div>
        </div>

        <nav className="flex-1 flex gap-1 p-3 sm:flex-col overflow-x-auto sm:overflow-visible">
          {NAV.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {item.icon(active)}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom subtle branding */}
        <div className="hidden sm:block border-t border-white/10 px-5 py-4">
          <p className="text-xs font-medium text-slate-300">Admin Panel</p>
          <p className="text-[11px] text-slate-500">Manage your data efficiently</p>
        </div>
      </aside>
    </>
  );
}
