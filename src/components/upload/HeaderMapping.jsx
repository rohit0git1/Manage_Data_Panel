import { APP_FIELDS, REQUIRED_KEYS } from "../../utils/constants.js";

export default function HeaderMapping({ columns, mapping, onChange }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold">Map Spreadsheet Columns</h3>
      <p className="mt-1 text-xs text-gray-500">
        Select which spreadsheet column corresponds to each application field. Required fields must be mapped.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {APP_FIELDS.map((field) => {
          const value = mapping[field.key];
          const isMissing = field.required && (value === null || value === "" || value === undefined);
          return (
            <div key={field.key} className="space-y-1">
              <label className="flex items-center gap-1 text-xs font-medium">
                {field.label}
                {field.required && <span className="text-red-600">*</span>}
                {isMissing && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Required</span>}
                {!field.required && <span className="text-[10px] text-gray-400">(optional)</span>}
              </label>
              <select
                value={value ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange(field.key, v === "" ? null : Number(v));
                }}
                className={`w-full rounded border px-2 py-1.5 text-sm ${isMissing ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
              >
                <option value="">{field.required ? "-- Select column --" : "-- Ignore --"}</option>
                {columns.map((col, idx) => (
                  <option key={idx} value={idx}>
                    {col} (Col {idx + 1})
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {REQUIRED_KEYS.some((k) => mapping[k] == null) && (
        <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-700">
          Required mappings missing: {REQUIRED_KEYS.filter((k) => mapping[k] == null).join(", ")} — Import will be disabled until mapped.
        </p>
      )}
    </div>
  );
}
