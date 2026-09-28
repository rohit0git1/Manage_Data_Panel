import {
  normalizeType,
  normalizeLinkStatus,
  normalizeDownloadStatus,
  isValidType,
  isValidLinkStatus,
  isValidDownloadStatus,
} from "./normalize.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone);
}

export function parseDateAdded(value) {
  if (value === undefined || value === null || value === "") {
    return new Date();
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Validate a single record payload (for import or update)
 * Returns { normalized, errors[] }
 * row: 1-indexed row number for error reporting (optional)
 */
export function validateAndNormalizeRecord(input, row = null) {
  const errors = [];
  const addError = (field, reason) => {
    errors.push({ row, field, reason });
  };

  // Helper to get trimmed string or empty
  const getStr = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());

  const name = getStr(input.name);
  const emailRaw = getStr(input.email);
  const email = emailRaw.toLowerCase();
  const phone = getStr(input.phone);
  const address = input.address != null ? String(input.address).trim() : "";
  const organisation = input.organisation != null ? String(input.organisation).trim() : "";

  // type normalization
  const typeRaw = getStr(input.type);
  const type = normalizeType(typeRaw);

  // linkStatus
  let linkStatus;
  if (input.linkStatus == null || String(input.linkStatus).trim() === "") {
    linkStatus = "Pending";
  } else {
    linkStatus = normalizeLinkStatus(String(input.linkStatus));
    if (!linkStatus) {
      addError("linkStatus", `Link Status must be one of: Pending, Sent (got "${input.linkStatus}")`);
    }
  }

  // downloadStatus
  let downloadStatus;
  if (input.downloadStatus == null || String(input.downloadStatus).trim() === "") {
    downloadStatus = "Pending";
  } else {
    downloadStatus = normalizeDownloadStatus(String(input.downloadStatus));
    if (!downloadStatus) {
      addError("downloadStatus", `Download Status must be one of: Pending, Downloaded, Completed (got "${input.downloadStatus}")`);
    }
  }

  // dateAdded
  let dateAdded = parseDateAdded(input.dateAdded);
  if (dateAdded === null) {
    addError("dateAdded", `Date Added is invalid: "${input.dateAdded}"`);
  }

  // Required field checks
  if (!name) addError("name", "Name is required");
  else if (name.length > 120) addError("name", "Name cannot exceed 120 characters");

  if (!emailRaw) addError("email", "Email is required");
  else if (!isValidEmail(email)) addError("email", `Email is invalid: "${emailRaw}"`);

  if (!phone) addError("phone", "Phone is required");
  else if (!isValidPhone(phone)) addError("phone", `Phone is invalid: "${phone}"`);

  if (!typeRaw) addError("type", "Type is required");
  else if (!type) addError("type", `Type is invalid: "${typeRaw}". Must be one of: Students, Teachers, Mentors, Job Seekers, Institutes, Others`);

  // Additional validations for normalized values (redundant safety)
  if (type && !isValidType(type)) addError("type", `Type is invalid: "${type}"`);
  if (linkStatus && !isValidLinkStatus(linkStatus)) addError("linkStatus", `Link Status is invalid: "${linkStatus}"`);
  if (downloadStatus && !isValidDownloadStatus(downloadStatus)) addError("downloadStatus", `Download Status is invalid: "${downloadStatus}"`);

  if (address.length > 300) addError("address", "Address cannot exceed 300 characters");
  if (organisation.length > 150) addError("organisation", "Organisation cannot exceed 150 characters");

  if (errors.length > 0) {
    return { normalized: null, errors };
  }

  const normalized = {
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

  return { normalized, errors: [] };
}

export { EMAIL_REGEX, PHONE_REGEX };
