import Record from "../models/Record.js";
import { parsePagination, buildFilter } from "../utils/queryBuilder.js";
import { validateAndNormalizeRecord } from "../utils/validators.js";

// GET /api/records
export async function getRecords(req, res) {
  const { page, limit } = parsePagination(req.query);
  const filter = buildFilter(req.query);

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(filter).sort({ dateAdded: -1 }).skip(skip).limit(limit).lean(),
    Record.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 0;

  res.json({
    success: true,
    data: {
      records,
      pagination: { page, limit, total, totalPages },
    },
  });
}

// GET /api/records/summary
export async function getSummary(req, res) {
  const [all, students, teachers, institutes] = await Promise.all([
    Record.countDocuments({}),
    Record.countDocuments({ type: "Students" }),
    Record.countDocuments({ type: "Teachers" }),
    Record.countDocuments({ type: "Institutes" }),
  ]);

  res.json({
    success: true,
    data: { all, students, teachers, institutes },
  });
}

// GET /api/records/:id
export async function getRecordById(req, res) {
  const record = await Record.findById(req.params.id).lean();
  if (!record) {
    return res.status(404).json({
      success: false,
      message: `Record not found: ${req.params.id}`,
    });
  }
  res.json({ success: true, data: record });
}

// POST /api/records/import
export async function importRecords(req, res) {
  const { records } = req.body;

  if (!Array.isArray(records)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body: expected { records: [...] }",
    });
  }

  if (records.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: [{ row: null, field: "records", reason: "records array must not be empty" }],
    });
  }

  const MAX_IMPORT = 2000;
  if (records.length > MAX_IMPORT) {
    return res.status(400).json({
      success: false,
      message: `Too many records: ${records.length}. Maximum is ${MAX_IMPORT}`,
    });
  }

  const validated = [];
  const allErrors = [];

  records.forEach((rec, idx) => {
    const row = idx + 1;
    if (rec == null || typeof rec !== "object" || Array.isArray(rec)) {
      allErrors.push({ row, field: "record", reason: "Record must be an object" });
      return;
    }
    const { normalized, errors } = validateAndNormalizeRecord(rec, row);
    if (errors.length > 0) {
      allErrors.push(...errors);
    } else {
      validated.push(normalized);
    }
  });

  if (allErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: allErrors,
    });
  }

  // All valid — insert
  const inserted = await Record.insertMany(validated, { ordered: true });

  res.status(201).json({
    success: true,
    data: {
      insertedCount: inserted.length,
      records: inserted,
    },
  });
}

// PUT /api/records/:id
export async function updateRecord(req, res) {
  const existing = await Record.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Record not found: ${req.params.id}`,
    });
  }

  // Merge existing dateAdded preservation — ignore client dateAdded
  const input = { ...req.body };
  delete input.dateAdded;
  delete input._id;
  delete input.__v;
  delete input.createdAt;
  delete input.updatedAt;

  // Build a payload combining existing values with incoming changes for validation
  // But we validate only the incoming fields combined with defaults? For update, require name/email/phone/type still
  const payload = {
    name: input.name !== undefined ? input.name : existing.name,
    email: input.email !== undefined ? input.email : existing.email,
    phone: input.phone !== undefined ? input.phone : existing.phone,
    address: input.address !== undefined ? input.address : existing.address,
    organisation: input.organisation !== undefined ? input.organisation : existing.organisation,
    type: input.type !== undefined ? input.type : existing.type,
    linkStatus: input.linkStatus !== undefined ? input.linkStatus : existing.linkStatus,
    downloadStatus: input.downloadStatus !== undefined ? input.downloadStatus : existing.downloadStatus,
    dateAdded: existing.dateAdded, // preserved
  };

  const { normalized, errors } = validateAndNormalizeRecord(payload, null);

  if (errors.length > 0) {
    // Remove row from errors for update context (row is null)
    const cleaned = errors.map((e) => ({ field: e.field, reason: e.reason }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: cleaned,
    });
  }

  // Apply normalized but keep original dateAdded
  normalized.dateAdded = existing.dateAdded;

  Object.assign(existing, normalized);
  await existing.save();

  res.json({ success: true, data: existing });
}

// DELETE /api/records/:id
export async function deleteRecord(req, res) {
  const deleted = await Record.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Record not found: ${req.params.id}`,
    });
  }
  res.json({ success: true, message: "Record deleted successfully", data: { id: deleted._id } });
}
