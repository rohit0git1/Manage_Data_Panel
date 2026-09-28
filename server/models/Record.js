import mongoose from "mongoose";

const TYPE_ENUM = [
  "Students",
  "Teachers",
  "Mentors",
  "Job Seekers",
  "Institutes",
  "Others",
];

const LINK_STATUS_ENUM = ["Pending", "Sent"];

const DOWNLOAD_STATUS_ENUM = ["Pending", "Downloaded", "Completed"];

// Simple but effective email regex — not over-strict, matches spec requirement
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone: allow digits, spaces, +, -, parentheses; 7-20 chars after trimming
// Keeps string type to preserve leading zeros / + country codes
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      validate: {
        validator: (v) => EMAIL_REGEX.test(v),
        message: "Email is invalid",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      validate: {
        validator: (v) => PHONE_REGEX.test(v),
        message: "Phone is invalid",
      },
    },
    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    organisation: {
      type: String,
      default: "",
      trim: true,
      maxlength: [150, "Organisation cannot exceed 150 characters"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: TYPE_ENUM,
        message: "Type must be one of: " + TYPE_ENUM.join(", "),
      },
    },
    linkStatus: {
      type: String,
      required: true,
      enum: {
        values: LINK_STATUS_ENUM,
        message: "Link Status must be Pending or Sent",
      },
      default: "Pending",
    },
    downloadStatus: {
      type: String,
      required: true,
      enum: {
        values: DOWNLOAD_STATUS_ENUM,
        message: "Download Status must be Pending, Downloaded or Completed",
      },
      default: "Pending",
    },
    dateAdded: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Simple useful indexes per spec — support filtering/sorting
recordSchema.index({ type: 1 });
recordSchema.index({ linkStatus: 1 });
recordSchema.index({ downloadStatus: 1 });
recordSchema.index({ dateAdded: -1 });

const Record = mongoose.model("Record", recordSchema);

export default Record;
export { TYPE_ENUM, LINK_STATUS_ENUM, DOWNLOAD_STATUS_ENUM };
