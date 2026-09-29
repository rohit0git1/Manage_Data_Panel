import { useEffect, useMemo, useState } from "react";
import Dropzone from "../components/upload/Dropzone.jsx";
import HeaderMapping from "../components/upload/HeaderMapping.jsx";
import PreviewTable from "../components/upload/PreviewTable.jsx";
import ValidationErrors from "../components/upload/ValidationErrors.jsx";
import { ACCEPTED_EXTENSIONS, MAX_IMPORT_COUNT, REQUIRED_KEYS } from "../utils/constants.js";
import { autoMapColumns } from "../utils/headerMapping.js";
import { validateRow, isEmptyRow } from "../utils/validation.js";
import { importRecords } from "../services/api.js";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [columns, setColumns] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [validRecords, setValidRecords] = useState([]);
  const [invalidErrors, setInvalidErrors] = useState([]);
  const [skippedEmpty, setSkippedEmpty] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null); // { success, insertedCount, message, errors }

  const totalDataRows = rawRows.length;

  const requiredMissing = useMemo(() => REQUIRED_KEYS.filter((k) => mapping[k] == null), [mapping]);

  const canImport = useMemo(() => {
    return (
      !parsing &&
      !importing &&
      !parseError &&
      columns.length > 0 &&
      requiredMissing.length === 0 &&
      validRecords.length > 0
    );
  }, [parsing, importing, parseError, columns, requiredMissing, validRecords]);

  function resetAll() {
    setFile(null);
    setFileName("");
    setParsing(false);
    setParseError("");
    setColumns([]);
    setRawRows([]);
    setMapping({});
    setValidRecords([]);
    setInvalidErrors([]);
    setSkippedEmpty(0);
    setImporting(false);
    setImportResult(null);
  }

  function handleMappingChange(fieldKey, colIdx) {
    setMapping((prev) => ({ ...prev, [fieldKey]: colIdx }));
  }

  async function handleFileSelected(selectedFile) {
    resetAll();
    setFile(selectedFile);
    setFileName(selectedFile.name);

    // Extension check before parsing
    const lower = selectedFile.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    if (!hasValidExt) {
      setParseError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setParseError("File is too large. Maximum 10MB.");
      return;
    }

    setParsing(true);
    setParseError("");

    try {
      const buffer = await selectedFile.arrayBuffer();
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      if (!workbook.SheetNames.length) {
        setParseError("No worksheets found in file.");
        setParsing(false);
        return;
      }
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Use header:1 to preserve raw header row
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
      if (!rows || rows.length === 0) {
        setParseError("File is empty. No rows found.");
        setParsing(false);
        return;
      }

      // First row is headers
      const headerRow = rows[0].map((h) => String(h ?? "").trim());
      // Check if headers are all empty
      const nonEmptyHeaders = headerRow.filter((h) => h !== "");
      if (nonEmptyHeaders.length === 0) {
        setParseError("Header row is missing or empty. First row must contain column names.");
        setParsing(false);
        return;
      }

      // Keep header row as columns (including empty header columns but filter display? keep all)
      // Filter out trailing empty headers? Keep as is for mapping, but show meaningful
      const cols = headerRow;
      const dataRows = rows.slice(1);

      if (dataRows.length === 0) {
        setParseError("No data rows found. File contains only headers.");
        setColumns(cols);
        setRawRows([]);
        setMapping(autoMapColumns(cols));
        setParsing(false);
        return;
      }

      // Store
      setColumns(cols);
      setRawRows(dataRows);
      const autoMapped = autoMapColumns(cols);
      setMapping(autoMapped);
    } catch (err) {
      console.error("Parse error", err);
      setParseError(`Unable to read file: ${err.message || "corrupt or unreadable spreadsheet"}`);
    } finally {
      setParsing(false);
    }
  }

  // Re-validate when mapping or rawRows changes
  useEffect(() => {
    if (columns.length === 0 || rawRows.length === 0) {
      setValidRecords([]);
      setInvalidErrors([]);
      setSkippedEmpty(0);
      return;
    }

    // If required mappings missing, still compute but valid will be 0 due to missing fields? Actually validateRow will error for required fields missing
    // We still run to show counts
    const valids = [];
    const errors = [];
    let skipped = 0;

    rawRows.forEach((row, idx) => {
      const rowNumber = idx + 2; // 1 header + 1-indexed
      if (isEmptyRow(row, mapping)) {
        skipped++;
        return;
      }
      const { record, errors: rowErrors } = validateRow(row, mapping, columns, rowNumber);
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else if (record) {
        valids.push(record);
      }
    });

    setValidRecords(valids);
    setInvalidErrors(errors);
    setSkippedEmpty(skipped);

    // If no actual data rows after skipping
    if (valids.length === 0 && errors.length === 0 && skipped === rawRows.length) {
      // Will be handled as "No data rows found" in UI via counts
    }
  }, [columns, rawRows, mapping]);

  async function handleImport() {
    if (!canImport) return;
    if (validRecords.length > MAX_IMPORT_COUNT) {
      setImportResult({ success: false, message: `Too many records: ${validRecords.length}. Max ${MAX_IMPORT_COUNT}. Split the file.` });
      return;
    }
    setImporting(true);
    setImportResult(null);
    try {
      const res = await importRecords(validRecords);
      // res is { success, data: { insertedCount, records } }
      const insertedCount = res?.data?.insertedCount ?? validRecords.length;
      setImportResult({ success: true, insertedCount, message: `${insertedCount} records imported successfully.` });
      // Do not clear file immediately — show success, let user reset manually or auto reset after delay
      // Spec says clear/reset upload state after success
      // We keep success visible, and provide Reset button. Optional auto-clear after 3s?
    } catch (err) {
      const data = err?.response?.data;
      if (data) {
        setImportResult({
          success: false,
          message: data.message || "Import failed",
          errors: data.errors || [],
        });
      } else {
        setImportResult({ success: false, message: err.message || "Network error. Please try again." });
      }
    } finally {
      setImporting(false);
    }
  }

  const hasNoDataRows = !parsing && columns.length > 0 && rawRows.length > 0 && validRecords.length === 0 && invalidErrors.length === 0 && skippedEmpty === rawRows.length;
  const hasHeaderOnly = parseError && parseError.includes("No data rows found");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-7">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 16V3M12 3l5 5M12 3l-5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Upload Excel</h1>
            <p className="text-sm text-slate-500">
              Import <span className="font-mono font-medium text-slate-700">.xlsx · .xls · .csv</span> — map columns, validate and preview before importing
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Dropzone onFileSelected={handleFileSelected} disabled={parsing || importing} />

        {/* File info + reset */}
        {fileName && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate">{fileName}</p>
                <p className="text-xs text-slate-500">
                  {file && <span>{(file.size / 1024).toFixed(1)} KB</span>}
                  {parsing && <span className="ml-2 inline-flex items-center gap-1 text-slate-900"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Parsing…</span>}
                  {importing && <span className="ml-2 inline-flex items-center gap-1 text-slate-900"><span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" /> Importing…</span>}
                </p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              disabled={parsing || importing}
            >
              Clear
            </button>
          </div>
        )}

        {/* Parse error */}
        {parseError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 shadow-sm">
            <span className="font-semibold">File error:</span> {parseError}
          </div>
        )}

        {/* Loading */}
        {parsing && (
          <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-900" />
            Reading file… Validating… Preparing preview…
          </div>
        )}

        {/* No data rows */}
        {hasNoDataRows && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800 shadow-sm">
            No data rows found. File contains only empty rows after mapping. Check your spreadsheet and re-upload.
          </div>
        )}

        {/* Mapping */}
        {columns.length > 0 && !parseError && !hasHeaderOnly && (
          <HeaderMapping columns={columns} mapping={mapping} onChange={handleMappingChange} />
        )}

        {/* Summary stats */}
        {columns.length > 0 && !parseError && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-white p-3.5 text-center shadow-sm">
              <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Total rows</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{totalDataRows}</p>
            </div>
            <div className="rounded-xl border bg-white p-3.5 text-center shadow-sm">
              <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Valid rows</p>
              <p className="mt-1 text-xl font-bold text-emerald-600">{validRecords.length}</p>
            </div>
            <div className="rounded-xl border bg-white p-3.5 text-center shadow-sm">
              <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Invalid rows</p>
              <p className={`mt-1 text-xl font-bold ${invalidErrors.length > 0 ? "text-red-600" : "text-slate-900"}`}>
                {invalidErrors.length > 0 ? new Set(invalidErrors.map((e) => e.row)).size : 0}
                <span className="ml-1 text-xs font-normal text-slate-400">({invalidErrors.length})</span>
              </p>
            </div>
            <div className="rounded-xl border bg-white p-3.5 text-center shadow-sm">
              <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Empty skipped</p>
              <p className="mt-1 text-xl font-bold text-slate-700">{skippedEmpty}</p>
            </div>
          </div>
        )}

        {/* Mapped fields chips */}
        {columns.length > 0 && !parseError && (
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-700 uppercase">Mapped fields</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(mapping).map(([field, idx]) => (
                <span
                  key={field}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    idx == null
                      ? "bg-slate-50 text-slate-500 ring-slate-200"
                      : "bg-slate-900 text-white ring-slate-900"
                  }`}
                >
                  {field}: {idx == null ? "— Ignore —" : `${columns[idx]} → ${field}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Validation errors */}
        {invalidErrors.length > 0 && <ValidationErrors errors={invalidErrors} />}

        {/* Preview */}
        {validRecords.length > 0 && (
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Import Preview — Valid records</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                {validRecords.length} ready
              </span>
            </div>
            <PreviewTable records={validRecords} maxRows={30} />
            <p className="mt-2 text-xs text-slate-500">
              Preview shows first 30 of {validRecords.length} valid records. All {validRecords.length} will be imported.
            </p>
          </div>
        )}

        {/* Import button */}
        {columns.length > 0 && !parseError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
            <button
              onClick={handleImport}
              disabled={!canImport || importing}
              className={`inline-flex items-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                canImport && !importing ? "bg-slate-900 hover:bg-black" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {importing && <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {importing ? "Importing..." : `Import ${validRecords.length} valid record${validRecords.length !== 1 ? "s" : ""}`}
            </button>
            {!canImport && !parsing && (
              <span className="text-xs text-slate-500">
                {requiredMissing.length > 0
                  ? `Map required fields: ${requiredMissing.join(", ")}`
                  : validRecords.length === 0
                    ? "No valid rows to import"
                    : ""}
              </span>
            )}
            {importing && <span className="text-xs text-slate-500">Please wait — importing {validRecords.length} records…</span>}
          </div>
        )}

        {/* Import result */}
        {importResult && (
          <div
            className={`rounded-xl border p-4 text-sm shadow-sm ${
              importResult.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {importResult.success ? (
              <>
                <p className="font-semibold">✓ {importResult.message}</p>
                <p className="mt-1 text-xs text-emerald-700">
                  Records are now stored in MongoDB. You can upload another file or view them in Manage Data.
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={resetAll} className="rounded-lg border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Upload Another File
                  </button>
                  <a href="/manage-data" className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black">
                    Go to Manage Data
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">Import failed: {importResult.message}</p>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-3 max-h-[160px] overflow-auto rounded-lg bg-white p-2 text-xs text-slate-700 ring-1 ring-red-100">
                    {importResult.errors.slice(0, 20).map((e, idx) => (
                      <div key={idx} className="border-b border-slate-100 last:border-0 py-1.5">
                        {e.row ? `Row ${e.row}: ` : ""}
                        {e.field ? `${e.field} — ` : ""}
                        {e.reason || JSON.stringify(e)}
                      </div>
                    ))}
                    {importResult.errors.length > 20 && (
                      <p className="mt-1 text-[11px] text-slate-500">+ {importResult.errors.length - 20} more</p>
                    )}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-600">No records from this request were inserted (all-or-nothing). Fix the file and retry — your previous mapping/preview is preserved.</p>
              </>
            )}
          </div>
        )}

        {/* Help text */}
        <div className="rounded-xl border bg-white p-4 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <p className="text-xs font-semibold tracking-wider text-slate-900 uppercase">Accepted formats & tips</p>
          </div>
          <ul className="mt-1 list-disc pl-5 space-y-1 text-xs leading-relaxed">
            <li>Use first sheet only. First row must be headers.</li>
            <li>Alternate headers work: <span className="font-mono font-medium text-slate-700">Full Name, Email Address, Mobile, Company, Category</span> will auto-map.</li>
            <li>Missing optional fields default to empty or Pending. Invalid dates → error; missing date → now.</li>
            <li>Empty rows are skipped. Invalid rows are not sent.</li>
            <li>Max {MAX_IMPORT_COUNT} records per import.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
