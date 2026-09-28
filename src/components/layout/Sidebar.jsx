import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/manage-data", label: "Manage Data" },
  { path: "/upload", label: "Upload Excel" },
  { path: "/social-ads", label: "Social & Ads" },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
  }, []);

  const isActive = (path) => {
    if (path === "/manage-data") return location.pathname === "/manage-data";
    if (path === "/upload") return location.pathname === "/upload" || location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 sm:hidden">
        <div>
          <h2 className="text-sm font-bold">BLACKCUBE</h2>
          <p className="text-[11px] text-gray-500">Solutions LLC</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded border px-3 py-1.5 text-sm"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r sm:w-56 sm:min-h-screen sm:sticky sm:top-0 sm:h-screen flex flex-col ${
          open ? "block" : "hidden sm:flex"
        }`}
      >
        <div className="hidden px-4 py-4 sm:block border-b">
          <h2 className="text-sm font-bold tracking-wide">BLACKCUBE</h2>
          <p className="text-[11px] text-gray-500">Solutions LLC</p>
        </div>

        <nav className="flex-1 flex gap-1 p-2 sm:flex-col overflow-x-auto sm:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 whitespace-nowrap rounded px-3 py-2 text-sm transition ${
                isActive(item.path)
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  isActive(item.path) ? "bg-white" : "bg-gray-300"
                }`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                health?.data?.db === "connected" ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <span className={health?.data?.db === "connected" ? "text-green-700" : "text-amber-700"}>
              DB: {health?.data?.db || "…"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">/manage-data is active</p>
        </div>
      </aside>
    </>
  );
}
