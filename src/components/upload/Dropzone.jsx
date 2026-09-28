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
    // reset input so same file can be selected again after reset
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
        dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}`}
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
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-sm font-medium">
          {dragOver ? "Drop file here" : "Drag & drop Excel/CSV here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Accepted: <span className="font-mono">{ACCEPTED_EXTENSIONS.join(", ")}</span> • Max {10}MB
        </p>
        <button
          type="button"
          disabled={disabled}
          className="mt-3 rounded bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-50"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Choose File
        </button>
      </div>
    </div>
  );
}
