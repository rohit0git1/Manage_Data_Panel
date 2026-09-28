export const TYPE_ENUM = [
  "Students",
  "Teachers",
  "Mentors",
  "Job Seekers",
  "Institutes",
  "Others",
];

export const LINK_STATUS_ENUM = ["Pending", "Sent"];

export const DOWNLOAD_STATUS_ENUM = ["Pending", "Downloaded", "Completed"];

export const DATE_RANGE_ENUM = ["all", "today", "7days", "30days", "90days"];

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

const LINK_STATUS_MAP = {
  pending: "Pending",
  sent: "Sent",
};

const DOWNLOAD_STATUS_MAP = {
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
  return LINK_STATUS_MAP[key] || null;
}

export function normalizeDownloadStatus(value) {
  const key = normalizeKey(value);
  return DOWNLOAD_STATUS_MAP[key] || null;
}

export function isValidType(value) {
  return TYPE_ENUM.includes(value);
}

export function isValidLinkStatus(value) {
  return LINK_STATUS_ENUM.includes(value);
}

export function isValidDownloadStatus(value) {
  return DOWNLOAD_STATUS_ENUM.includes(value);
}

export function isValidDateRange(value) {
  if (!value) return true;
  return DATE_RANGE_ENUM.includes(value.trim().toLowerCase());
}

/**
 * Escape regex special characters for safe $regex construction
 */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
