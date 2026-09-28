import { useEffect } from "react";

export default function DeleteConfirm({ record, open, onClose, onConfirm, deleting }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape" && !deleting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, deleting, onClose]);

  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && onClose()} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold">Delete this record?</h2>
        <p className="mt-2 text-sm text-gray-600">
          You are about to permanently delete:
        </p>
        <p className="mt-1 rounded bg-gray-50 px-3 py-2 text-sm font-medium">
          {record.name} <span className="text-gray-500 font-normal">• {record.email}</span>
        </p>
        <p className="mt-2 text-xs text-gray-500">This action cannot be undone.</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded border bg-white px-4 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
