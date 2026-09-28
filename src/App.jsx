import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import UploadExcel from "./pages/UploadExcel.jsx";
import ManageData from "./pages/ManageData.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

function Placeholder({ title, note }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{note}</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/manage-data" className="rounded border bg-white px-4 py-2 text-sm hover:bg-gray-50">
          Manage Data
        </Link>
        <Link to="/upload" className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
          Upload Excel
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col sm:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="/manage-data" replace />} />
            <Route path="/manage-data" element={<ManageData />} />
            <Route path="/upload" element={<UploadExcel />} />
            <Route path="/dashboard" element={<Placeholder title="Dashboard" note="Placeholder — use Manage Data and Upload Excel for the evaluated flow. Dashboard is not part of required functionality." />} />
            <Route path="/social-ads" element={<Placeholder title="Social & Ads" note="Placeholder — not part of required Manage Data flow." />} />
            <Route path="*" element={<div className="p-8 text-center text-sm text-gray-500">Not found — <Link to="/manage-data" className="underline">Go to Manage Data</Link></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
