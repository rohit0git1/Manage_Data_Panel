/**
 * Header normalization + alias mapping for spreadsheet columns
 * Mirrors spec aliases and backend normalize logic
 */

export function normalizeHeader(header) {
  if (header == null) return "";
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Alias definitions per spec
export const FIELD_ALIASES = {
  name: ["name", "full name", "fullname"],
  email: ["email", "email address", "e-mail", "e-mail", "emailaddress"],
  phone: ["phone", "phone number", "mobile", "mobile number", "phone no", "phone no."],
  address: ["address"],
  organisation: ["organisation", "organization", "company", "institute"],
  type: ["type", "category", "user type", "usertype"],
  linkStatus: ["link status", "link status", "linkstatus"],
  downloadStatus: ["download status", "download status", "downloadstatus"],
  dateAdded: ["date added", "added on", "date added", "created date", "createddate", "dateadded"],
};

// Build normalized alias sets for faster lookup
const NORMALIZED_ALIAS_MAP = {};
for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
  NORMALIZED_ALIAS_MAP[field] = aliases.map(normalizeHeader);
}

/**
 * For a given app field, find matching column indices
 * Returns array of indices that match any alias
 */
export function findMatchingColumns(fieldKey, columns) {
  const aliases = NORMALIZED_ALIAS_MAP[fieldKey] || [];
  const matches = [];
  columns.forEach((col, idx) => {
    const norm = normalizeHeader(col);
    if (aliases.includes(norm)) {
      matches.push(idx);
    }
  });
  return matches;
}

/**
 * Auto-map columns where exactly one column matches a field's aliases
 * Returns mapping: { fieldKey: columnIndex | null }
 * If ambiguous (0 or >1 matches), leaves null for manual selection
 */
export function autoMapColumns(columns) {
  const mapping = {};
  for (const field of Object.keys(FIELD_ALIASES)) {
    const matches = findMatchingColumns(field, columns);
    if (matches.length === 1) {
      mapping[field] = matches[0];
    } else {
      mapping[field] = null;
    }
  }
  return mapping;
}

/**
 * Check if a column could belong to multiple fields (should not auto-guess)
 * Used only for informational UI
 */
export function isAmbiguousColumn(colHeader, fieldKey) {
  // Already handled via findMatchingColumns length >1
  return false;
}
