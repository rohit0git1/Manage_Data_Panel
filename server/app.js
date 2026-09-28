import express from "express";
import cors from "cors";
import { getConnectionState } from "./config/db.js";
import recordsRouter from "./routes/records.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requireDb } from "./middleware/requireDb.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Health endpoint — verifies app and DB readiness
// Always returns 200 with accurate DB state; DB-dependent routes return 503 when unavailable
app.get("/api/health", (req, res) => {
  const state = getConnectionState();
  const dbStatus = state === 1 ? "connected" : state === 2 ? "connecting" : "disconnected";

  // Keep 200 for backward compatibility but include readyState for diagnostics
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      db: dbStatus,
      readyState: state,
      uptime: process.uptime(),
    },
  });
});

// Records API — require DB connection; if unavailable, return 503 instead of fake empty
app.use("/api/records", requireDb, recordsRouter);

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
