import { useEffect, useState } from "react";
import { TYPE_ENUM, LINK_STATUS_ENUM, DOWNLOAD_STATUS_ENUM } from "../../utils/constants.js";

function validateField(name, value) {
  const trim = typeof value === "string" ? value.trim() : value;
  if (name === "name") {
    if (!trim) return "Name is required";
    if (trim.length > 120) return "Name cannot exceed 120 characters";
  }
  if (name === "email") {
    if (!trim) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim)) return "Email is invalid";
  }
  if (name === "phone") {
    if (!trim) return "Phone is required";
    if (!/^[0-9+\-()\s]{7,20}$/.test(trim)) return "Phone is invalid";
  }
  if (name === "type") {
    if (!trim) return "Type is required";
    if (!TYPE_ENUM.includes(trim)) return `Type must be one of: ${TYPE_ENUM.join(", ")}`;
  }
  if (name === "linkStatus") {
    if (trim && !LINK_STATUS_ENUM.includes(trim)) return "Link Status must be Pending or Sent";
  }
  if (name === "downloadStatus") {
    if (trim && !DOWNLOAD_STATUS_ENUM.includes(trim)) return "Download Status must be Pending, Downloaded or Completed";
  }
  if (name === "address" && trim.length > 300) return "Address cannot exceed 300 characters";
  if (name === "organisation" && trim.length > 150) return "Organisation cannot exceed 150 characters";
  return "";
}

export default function EditModal({ record, open, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    organisation: "",
    type: "",
    linkStatus: "",
    downloadStatus: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open && record) {
      setForm({
        name: record.name || "",
        email: record.email || "",
        phone: record.phone || "",
        address: record.address || "",
        organisation: record.organisation || "",
        type: record.type || "",
        linkStatus: record.linkStatus || "Pending",
        downloadStatus: record.downloadStatus || "Pending",
      });
      setErrors({});
      setTouched({});
    }
  }, [open, record]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, saving, onClose]);

  if (!open || !record) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    }
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, form[key]) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;
    const newErrors = {};
    let hasError = false;
    for (const key of ["name", "email", "phone", "type", "linkStatus", "downloadStatus", "address", "organisation"]) {
      const msg = validateField(key, form[key]);
      if (msg) hasError = true;
      newErrors[key] = msg;
    }
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, type: true, linkStatus: true, downloadStatus: true });
    if (hasError) return;
    // Strip empty optional? keep as is; backend will default
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => !saving && onClose()} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 bg-white border-b px-5 py-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Record</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-gray-500">
            Editing <span className="font-medium text-gray-700">{record.name}</span> • ID {String(record._id).slice(-6)}
          </p>

          {[
            { key: "name", label: "Name *", type: "text", placeholder: "Full name" },
            { key: "email", label: "Email *", type: "email", placeholder: "email@example.com" },
            { key: "phone", label: "Phone *", type: "text", placeholder: "9876543210" },
            { key: "address", label: "Address", type: "text", placeholder: "Indore" },
            { key: "organisation", label: "Organisation", type: "text", placeholder: "ABC College" },
          ].map((f) => (
            <div key={f.key}>
              <label htmlFor={`edit-${f.key}`} className="block text-xs font-medium text-gray-700">
                {f.label}
              </label>
              <input
                id={`edit-${f.key}`}
                type={f.type}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                onBlur={() => handleBlur(f.key)}
                disabled={saving}
                className={`mt-1 w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:border-gray-900 ${errors[f.key] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
              />
              {errors[f.key] && <p className="mt-1 text-xs text-red-600">{errors[f.key]}</p>}
            </div>
          ))}

          <div>
            <label htmlFor="edit-type" className="block text-xs font-medium text-gray-700">Type *</label>
            <select
              id="edit-type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              onBlur={() => handleBlur("type")}
              disabled={saving}
              className={`mt-1 w-full rounded border px-3 py-1.5 text-sm ${errors.type ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
            >
              <option value="">Select type</option>
              {TYPE_ENUM.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-linkStatus" className="block text-xs font-medium text-gray-700">Link Status</label>
              <select
                id="edit-linkStatus"
                value={form.linkStatus}
                onChange={(e) => handleChange("linkStatus", e.target.value)}
                disabled={saving}
                className="mt-1 w-full rounded border bg-white px-3 py-1.5 text-sm"
              >
                {LINK_STATUS_ENUM.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.linkStatus && <p className="mt-1 text-xs text-red-600">{errors.linkStatus}</p>}
            </div>
            <div>
              <label htmlFor="edit-downloadStatus" className="block text-xs font-medium text-gray-700">Download Status</label>
              <select
                id="edit-downloadStatus"
                value={form.downloadStatus}
                onChange={(e) => handleChange("downloadStatus", e.target.value)}
                disabled={saving}
                className="mt-1 w-full rounded border bg-white px-3 py-1.5 text-sm"
              >
                {DOWNLOAD_STATUS_ENUM.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.downloadStatus && <p className="mt-1 text-xs text-red-600">{errors.downloadStatus}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded border bg-white px-4 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
