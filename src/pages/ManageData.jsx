import { useCallback, useState } from "react";
import { useRecords } from "../hooks/useRecords.js";
import SummaryCards from "../components/data/SummaryCards.jsx";
import CategoryTabs from "../components/data/CategoryTabs.jsx";
import SearchBar from "../components/data/SearchBar.jsx";
import Filters from "../components/data/Filters.jsx";
import DataTable from "../components/data/DataTable.jsx";
import Pagination from "../components/data/Pagination.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import EditModal from "../components/modals/EditModal.jsx";
import DeleteConfirm from "../components/modals/DeleteConfirm.jsx";
import { updateRecord, deleteRecord } from "../services/api.js";

export default function ManageData() {
  const {
    records,
    pagination,
    filters,
    loading,
    error,
    summary,
    summaryLoading,
    summaryError,
    updateFilter,
    setPage,
    resetFilters,
    retry,
    fetchRecords,
    fetchSummary,
  } = useRecords();

  const [selected, setSelected] = useState(new Set());

  // Edit state
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelected(new Set(records.map((r) => r._id)));
    } else {
      setSelected(new Set());
    }
  }, [records]);

  const handleSearch = useCallback((value) => {
    updateFilter("search", value);
  }, [updateFilter]);

  const handleCategory = useCallback((value) => {
    updateFilter("type", value);
  }, [updateFilter]);

  const handleFilterChange = useCallback((key, value) => {
    updateFilter(key, value);
  }, [updateFilter]);

  const handleEdit = useCallback((record) => {
    setEditingRecord(record);
    setEditError("");
  }, []);

  const handleCloseEdit = useCallback(() => {
    if (saving) return;
    setEditingRecord(null);
    setEditError("");
  }, [saving]);

  const handleSave = useCallback(async (formData) => {
    if (!editingRecord || saving) return;
    setSaving(true);
    setEditError("");
    try {
      await updateRecord(editingRecord._id, formData);
      setEditingRecord(null);
      showToast("success", "Record updated successfully.");
      // Refresh table and summary in parallel
      await Promise.all([fetchRecords(), fetchSummary()]);
      setSelected(new Set());
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update. Please try again.";
      const details = err.response?.data?.errors;
      if (details && Array.isArray(details) && details.length) {
        setEditError(details.map((e) => `${e.field}: ${e.reason}`).join(" • "));
      } else {
        setEditError(msg);
      }
    } finally {
      setSaving(false);
    }
  }, [editingRecord, saving, fetchRecords, fetchSummary]);

  const handleDelete = useCallback((record) => {
    setDeletingRecord(record);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (deleting) return;
    setDeletingRecord(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingRecord || deleting) return;
    setDeleting(true);
    setDeletingId(deletingRecord._id);
    const isLastOnPage = records.length === 1 && pagination.page > 1;
    try {
      await deleteRecord(deletingRecord._id);
      showToast("success", "Record deleted successfully.");
      setDeletingRecord(null);
      setDeletingId(null);
      setDeleting(false);
      if (isLastOnPage) {
        // Summary + page change will trigger records fetch
        await fetchSummary();
        setPage(pagination.page - 1);
      } else {
        await Promise.all([fetchRecords(), fetchSummary()]);
      }
      setSelected(new Set());
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete. Please try again.";
      showToast("error", msg);
      // Keep row visible — do not remove from UI
      setDeleting(false);
      setDeletingId(null);
      setDeletingRecord(null);
    }
  }, [deletingRecord, deleting, records.length, pagination.page, fetchRecords, fetchSummary, setPage]);

  const activeCategory = filters.type;

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Data</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and manage all imported records
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
          {pagination.total} {pagination.total === 1 ? "record" : "records"} total
        </span>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-3 rounded border px-4 py-2.5 text-sm ${
            toast.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-4">
        <SummaryCards summary={summary} loading={summaryLoading} error={summaryError} />
      </div>

      <div className="mb-3">
        <CategoryTabs active={activeCategory} onChange={handleCategory} />
      </div>

      <div className="mb-3 flex flex-col gap-3 rounded-xl border bg-white p-3.5 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar value={filters.search} onChange={handleSearch} />
        <div className="h-6 w-px hidden sm:block bg-slate-200" />
        <Filters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
      </div>

      {/* Loading / Error / Table / Empty */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800">Unable to load records. Please try again.</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
          <button
            onClick={retry}
            className="mt-3 rounded bg-white px-4 py-1.5 text-xs font-medium border hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : !loading && records.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <>
          <DataTable
            records={records}
            pagination={pagination}
            loading={loading}
            selected={selected}
            onToggleSelect={handleSelect}
            onToggleAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          {!loading && <Pagination pagination={pagination} onPageChange={setPage} />}
          {selected.size > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {selected.size} record{selected.size !== 1 ? "s" : ""} selected (visual only)
            </p>
          )}
        </>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Showing {pagination.total > 0 ? `1–${Math.min(pagination.limit, pagination.total)} of ${pagination.total}` : "0 records"} • Use search and filters to refine results
      </p>

      <EditModal
        record={editingRecord}
        open={!!editingRecord}
        onClose={handleCloseEdit}
        onSave={handleSave}
        saving={saving}
      />
      {/* Inline edit error below modal */}
      {editError && editingRecord && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded bg-red-600 px-4 py-2 text-sm text-white shadow-lg max-w-[90vw]">
          {editError}
        </div>
      )}

      <DeleteConfirm
        record={deletingRecord}
        open={!!deletingRecord}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
}
