import { TYPE_ENUM, LINK_STATUS_ENUM, DOWNLOAD_STATUS_ENUM } from "./constants.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

const TYPE_MAP = {
  students: "Students",
  student: "Students",
  teachers: "Teachers",
  teacher: "Teachers",
  mentors: "Mentors",
  mentor: "Mentors",
  "job seekers": "Job Seekers",
  "job seeker": "Job Seekers",
  jobseekers: "Job Seekers",
  jobseeker: "Job Seekers",
  institutes: "Institutes",
  institute: "Institutes",
  others: "Others",
};

const LINK_MAP = {
  pending: "Pending",
  sent: "Sent",
};

const DOWNLOAD_MAP = {
  pending: "Pending",
  downloaded: "Downloaded",
  completed: "Completed",
};

function normalizeKey(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeType(value) {
  const key = normalizeKey(value);
  return TYPE_MAP[key] || null;
}

export function normalizeLinkStatus(value) {
  const key = normalizeKey(value);
  return LINK_MAP[key] || null;
}

export function normalizeDownloadStatus(value) {
  const key = normalizeKey(value);
  return DOWNLOAD_MAP[key] || null;
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone);
}

/**
 * Parse date value from XLSX (could be Date, number, or string)
 * Returns ISO string or null, and error if invalid explicit value
 */
export function parseDateValue(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { date: new Date().toISOString(), error: null };
  }
  // XLSX may parse dates as Date objects when cellDates:true, or as numbers
  // Also handles string dates
  let d;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === "number") {
    // Excel serial number — handle via JS Date? Let XLSX handle via cellDates
    // Fallback: try to convert Excel serial (days since 1899-12-30)
    // But xlsx with cellDates:false would need manual; we use cellDates:true so numbers rarely here
    d = new Date(value);
  } else {
    d = new Date(String(value).trim());
  }
  if (isNaN(d.getTime())) {
    return { date: null, error: `Date Added is invalid: "${value}"` };
  }
  return { date: d.toISOString(), error: null };
}

/**
 * Validate a single mapped row (0-indexed spreadsheet data row, rowNumber is displayed row = header row 1 + data idx +1)
 * Returns { record, errors[] } where errors are { row, field, reason }
 */
export function validateRow(rawRow, mapping, columns, rowNumber) {
  const errors = [];

  const get = (fieldKey) => {
    const colIdx = mapping[fieldKey];
    if (colIdx == null || colIdx === "") return "";
    const val = rawRow[colIdx];
    if (val == null) return "";
    // Handle numbers, dates, etc from xlsx
    if (val instanceof Date) return val;
    return String(val).trim();
  };

  const name = get("name") instanceof Date ? String(get("name")).trim() : String(get("name") || "").trim();
  const emailRaw = get("email") instanceof Date ? String(get("email")).trim() : String(get("email") || "").trim();
  const email = emailRaw.toLowerCase();
  const phone = get("phone") instanceof Date ? String(get("phone")).trim() : String(get("phone") || "").trim();
  const address = get("address") instanceof Date ? String(get("address")).trim() : String(get("address") || "").trim() || "";
  const organisation = get("organisation") instanceof Date ? String(get("organisation")).trim() : String(get("organisation") || "").trim() || "";

  const typeRaw = get("type") instanceof Date ? String(get("type")).trim() : String(get("type") || "").trim();
  const type = normalizeType(typeRaw);

  // linkStatus
  let linkStatusRaw = get("linkStatus");
  let linkStatus;
  if (linkStatusRaw === "" || linkStatusRaw == null) {
    linkStatus = "Pending";
  } else {
    const val = linkStatusRaw instanceof Date ? String(linkStatusRaw).trim() : String(linkStatusRaw).trim();
    linkStatus = normalizeLinkStatus(val);
    if (!linkStatus) {
      errors.push({ row: rowNumber, field: "Link Status", reason: `Link Status must be Pending or Sent (got "${val}")` });
    }
  }

  // downloadStatus
  let downloadStatusRaw = get("downloadStatus");
  let downloadStatus;
  if (downloadStatusRaw === "" || downloadStatusRaw == null) {
    downloadStatus = "Pending";
  } else {
    const val = downloadStatusRaw instanceof Date ? String(downloadStatusRaw).trim() : String(downloadStatusRaw).trim();
    downloadStatus = normalizeDownloadStatus(val);
    if (!downloadStatus) {
      errors.push({ row: rowNumber, field: "Download Status", reason: `Download Status must be Pending, Downloaded or Completed (got "${val}")` });
    }
  }

  // dateAdded
  let dateAddedRaw = mapping.dateAdded != null && mapping.dateAdded !== "" ? rawRow[mapping.dateAdded] : "";
  let parsedDate = parseDateValue(dateAddedRaw);
  if (parsedDate.error) {
    errors.push({ row: rowNumber, field: "Date Added", reason: parsedDate.error });
  }
  const dateAdded = parsedDate.date;

  // Required checks
  if (!name) errors.push({ row: rowNumber, field: "Name", reason: "Name is required" });
  else if (name.length > 120) errors.push({ row: rowNumber, field: "Name", reason: "Name cannot exceed 120 characters" });

  if (!emailRaw) errors.push({ row: rowNumber, field: "Email", reason: "Email is required" });
  else if (!isValidEmail(email)) errors.push({ row: rowNumber, field: "Email", reason: `Email is invalid: "${emailRaw}"` });

  if (!phone) errors.push({ row: rowNumber, field: "Phone", reason: "Phone is required" });
  else if (!isValidPhone(phone)) errors.push({ row: rowNumber, field: "Phone", reason: `Phone is invalid: "${phone}"` });

  if (!typeRaw) errors.push({ row: rowNumber, field: "Type", reason: "Type is required" });
  else if (!type) errors.push({ row: rowNumber, field: "Type", reason: `Type is invalid: "${typeRaw}". Must be one of: Students, Teachers, Mentors, Job Seekers, Institutes, Others` });

  if (type && !TYPE_ENUM.includes(type)) errors.push({ row: rowNumber, field: "Type", reason: `Type is invalid: "${type}"` });
  if (linkStatus && !LINK_STATUS_ENUM.includes(linkStatus)) errors.push({ row: rowNumber, field: "Link Status", reason: `Link Status is invalid: "${linkStatus}"` });
  if (downloadStatus && !DOWNLOAD_STATUS_ENUM.includes(downloadStatus)) errors.push({ row: rowNumber, field: "Download Status", reason: `Download Status is invalid: "${downloadStatus}"` });

  if (address.length > 300) errors.push({ row: rowNumber, field: "Address", reason: "Address cannot exceed 300 characters" });
  if (organisation.length > 150) errors.push({ row: rowNumber, field: "Organisation", reason: "Organisation cannot exceed 150 characters" });

  if (errors.length > 0) {
    return { record: null, errors };
  }

  const record = {
    name,
    email,
    phone,
    address,
    organisation,
    type,
    linkStatus,
    downloadStatus,
    dateAdded,
  };

  return { record, errors: [] };
}

/**
 * Check if a row is completely empty for mapped columns
 */
export function isEmptyRow(rawRow, mapping) {
  for (const key of Object.keys(mapping)) {
    const idx = mapping[key];
    if (idx == null || idx === "") continue;
    const val = rawRow[idx];
    if (val != null && String(val).trim() !== "") return false;
  }
  return true;
}
