import { useCallback, useRef, useState } from "react";
import { ACCEPTED_EXTENSIONS } from "../../utils/constants.js";

export default function Dropzone({ onFileSelected, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (disabled) return;
    setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }, [onFileSelected, disabled]);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition shadow-sm ${
        dragOver ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-slate-300 hover:bg-slate-50/50"}`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V3M12 3l5 5M12 3l-5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {dragOver ? "Drop file here" : "Drag & drop Excel/CSV here or click to browse"}
        </p>
        <p className="mt-1.5 text-xs text-slate-500">
          Accepted <span className="font-mono font-medium text-slate-700">{ACCEPTED_EXTENSIONS.join(", ")}</span> • Max 10 MB • First sheet only
        </p>
        <button
          type="button"
          disabled={disabled}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black disabled:opacity-50"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Choose File
        </button>
      </div>
    </div>
  );
}
