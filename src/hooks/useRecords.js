import { useCallback, useEffect, useRef, useState } from "react";
import { getRecords, getSummary } from "../services/api.js";

export function useRecords(initialFilters = {}) {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    type: "",
    search: "",
    linkStatus: "",
    downloadStatus: "",
    dateRange: "",
    ...initialFilters,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const abortRef = useRef(null);

  const fetchRecords = useCallback(async (pageOverride, filtersOverride) => {
    const f = filtersOverride ?? filters;
    const pg = pageOverride ?? pagination.page;
    const lim = pagination.limit;

    // Abort previous
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pg,
        limit: lim,
        ...(f.type ? { type: f.type } : {}),
        ...(f.search ? { search: f.search } : {}),
        ...(f.linkStatus ? { linkStatus: f.linkStatus } : {}),
        ...(f.downloadStatus ? { downloadStatus: f.downloadStatus } : {}),
        ...(f.dateRange ? { dateRange: f.dateRange } : {}),
      };
      const res = await getRecords(params, controller.signal);
      // Check if aborted
      if (controller.signal.aborted) return;
      // res = { success, data: { records, pagination } }
      setRecords(res.data.records);
      setPagination(res.data.pagination);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError" || err.code === "ERR_CANCELED") return;
      if (controller.signal.aborted) return;
      setError(err.response?.data?.message || err.message || "Unable to load records. Please try again.");
      setRecords([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      setSummaryError(err.response?.data?.message || "Unable to load summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Initial and on filter/page change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const setLimit = useCallback((newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ type: "", search: "", linkStatus: "", downloadStatus: "", dateRange: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const retry = useCallback(() => {
    fetchRecords();
    fetchSummary();
  }, [fetchRecords, fetchSummary]);

  return {
    records,
    pagination,
    filters,
    loading,
    error,
    summary,
    summaryLoading,
    summaryError,
    setFilters,
    updateFilter,
    setPage,
    setLimit,
    resetFilters,
    retry,
    fetchRecords,
    fetchSummary,
  };
}
