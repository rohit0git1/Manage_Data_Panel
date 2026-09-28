export const APP_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Phone", required: true },
  { key: "address", label: "Address", required: false },
  { key: "organisation", label: "Organisation", required: false },
  { key: "type", label: "Type", required: true },
  { key: "linkStatus", label: "Link Status", required: false },
  { key: "downloadStatus", label: "Download Status", required: false },
  { key: "dateAdded", label: "Date Added", required: false },
];

export const REQUIRED_KEYS = ["name", "email", "phone", "type"];

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

export const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

export const MAX_FILE_SIZE_MB = 10;
export const MAX_IMPORT_COUNT = 2000;
