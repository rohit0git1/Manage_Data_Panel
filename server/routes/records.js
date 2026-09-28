import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  getRecords,
  getSummary,
  getRecordById,
  importRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/recordController.js";

const router = Router();

// Order matters: /summary and /import before /:id
router.get("/summary", asyncHandler(getSummary));
router.get("/", asyncHandler(getRecords));
router.get("/:id", validateObjectId, asyncHandler(getRecordById));
router.post("/import", asyncHandler(importRecords));
router.put("/:id", validateObjectId, asyncHandler(updateRecord));
router.delete("/:id", validateObjectId, asyncHandler(deleteRecord));

export default router;
