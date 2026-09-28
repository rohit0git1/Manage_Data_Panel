import express from "express";
import cors from "cors";
import { getConnectionState } from "./config/db.js";
import recordsRouter from "./routes/records.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Health endpoint — verifies app and DB readiness
app.get("/api/health", (req, res) => {
  const state = getConnectionState();
  // 0 = disconnected, 1 = connected, 2 = connecting
  const dbStatus =
    state === 1 ? "connected" : state === 2 ? "connecting" : "disconnected";

  const statusCode = state === 1 ? 200 : 200;

  res.status(statusCode).json({
    success: true,
    data: {
      status: "ok",
      db: dbStatus,
      uptime: process.uptime(),
    },
  });
});

// Records API
app.use("/api/records", recordsRouter);

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
