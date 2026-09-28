import {
  normalizeType,
  normalizeLinkStatus,
  normalizeDownloadStatus,
  DATE_RANGE_ENUM,
  escapeRegex,
} from "./normalize.js";

/**
 * Parse and validate pagination params
 * Throws { statusCode, message } on invalid
 */
export function parsePagination(query) {
  let page = 1;
  let limit = 10;

  if (query.page !== undefined && query.page !== "") {
    const p = Number(query.page);
    if (!Number.isInteger(p) || p < 1) {
      const err = new Error("page must be an integer >= 1");
      err.statusCode = 400;
      throw err;
    }
    page = p;
  }

  if (query.limit !== undefined && query.limit !== "") {
    const l = Number(query.limit);
    if (!Number.isInteger(l) || l < 1 || l > 100) {
      const err = new Error("limit must be an integer between 1 and 100");
      err.statusCode = 400;
      throw err;
    }
    limit = l;
  }

  return { page, limit };
}

/**
 * Build MongoDB filter from whitelisted query params
 * Validates enums strictly — invalid → throw 400
 */
export function buildFilter(query) {
  const filter = {};

  // type filter
  if (query.type !== undefined && query.type !== "" && query.type !== "All Data") {
    const normalized = normalizeType(query.type);
    if (!normalized) {
      const err = new Error(`Invalid type: "${query.type}". Must be one of: Students, Teachers, Mentors, Job Seekers, Institutes, Others`);
      err.statusCode = 400;
      throw err;
    }
    filter.type = normalized;
  }

  // linkStatus
  if (query.linkStatus !== undefined && query.linkStatus !== "" && query.linkStatus.toLowerCase() !== "all status" && query.linkStatus.toLowerCase() !== "all") {
    const normalized = normalizeLinkStatus(query.linkStatus);
    if (!normalized) {
      const err = new Error(`Invalid linkStatus: "${query.linkStatus}". Must be Pending or Sent`);
      err.statusCode = 400;
      throw err;
    }
    filter.linkStatus = normalized;
  }

  // downloadStatus
  if (query.downloadStatus !== undefined && query.downloadStatus !== "" && query.downloadStatus.toLowerCase() !== "all status" && query.downloadStatus.toLowerCase() !== "all") {
    const normalized = normalizeDownloadStatus(query.downloadStatus);
    if (!normalized) {
      const err = new Error(`Invalid downloadStatus: "${query.downloadStatus}". Must be Pending, Downloaded or Completed`);
      err.statusCode = 400;
      throw err;
    }
    filter.downloadStatus = normalized;
  }

  // dateRange
  if (query.dateRange !== undefined && query.dateRange !== "" && query.dateRange.toLowerCase() !== "all" && query.dateRange.toLowerCase() !== "all time") {
    const raw = query.dateRange.trim().toLowerCase();
    if (!DATE_RANGE_ENUM.includes(raw)) {
      const err = new Error(`Invalid dateRange: "${query.dateRange}". Must be one of: all, today, 7days, 30days, 90days`);
      err.statusCode = 400;
      throw err;
    }
    const dateFilter = getDateRangeFilter(raw);
    if (dateFilter) {
      filter.dateAdded = dateFilter;
    }
  }

  // search — case-insensitive partial on name/email/phone, escaped
  if (query.search !== undefined && query.search !== "") {
    const raw = String(query.search).trim();
    if (raw.length > 100) {
      const err = new Error("search must be at most 100 characters");
      err.statusCode = 400;
      throw err;
    }
    if (raw) {
      const escaped = escapeRegex(raw);
      const regex = { $regex: escaped, $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }
  }

  return filter;
}

function getDateRangeFilter(range) {
  const now = new Date();
  let start;

  switch (range) {
    case "today": {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case "7days": {
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case "30days": {
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case "90days": {
      start = new Date(now);
      start.setDate(start.getDate() - 90);
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case "all":
    default:
      return null;
  }
}
