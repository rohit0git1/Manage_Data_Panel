import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";

const ManageData = lazy(() => import("./pages/ManageData.jsx"));
const UploadExcel = lazy(() => import("./pages/UploadExcel.jsx"));

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-slate-100 rounded" />
        <div className="h-4 w-64 bg-slate-100 rounded" />
        <div className="h-32 bg-slate-100 rounded-lg" />
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Loading...</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your workspace</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">Manage Data</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">View, search and manage all imported records with real MongoDB persistence.</p>
          <Link to="/manage-data" className="mt-3 inline-flex rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black">
            Open Manage Data
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 16V3M12 3l5 5M12 3l-5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">Upload Excel</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Import .xlsx, .xls or .csv with header mapping and validation.</p>
          <Link to="/upload" className="mt-3 inline-flex rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black">
            Go to Upload
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">Quick Actions</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Edit, delete and keep summary counts in sync — all changes are saved immediately.</p>
          <Link to="/manage-data" className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            View Records
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Workspace Overview</h3>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
          Manage all imported records in one place. Use Upload to add new data and Manage Data to search, filter and update records.
        </p>
      </div>
    </div>
  );
}

function SocialAds() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </div>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900">Social & Ads</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Campaign and social management will be available here.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/manage-data" className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Manage Data
        </Link>
        <Link to="/upload" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
          Upload Excel
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col sm:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/manage-data" replace />} />
              <Route path="/manage-data" element={<ManageData />} />
              <Route path="/upload" element={<UploadExcel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/social-ads" element={<SocialAds />} />
              <Route path="*" element={<div className="p-8 text-center text-sm text-slate-500">Not found — <Link to="/manage-data" className="underline">Go to Manage Data</Link></div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
