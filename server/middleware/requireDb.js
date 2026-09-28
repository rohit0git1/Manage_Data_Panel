import { getConnectionState } from "../config/db.js";

export function requireDb(req, res, next) {
  const state = getConnectionState();
  // 1 = connected
  if (state === 1) {
    return next();
  }

  const dbLabel = state === 2 ? "connecting" : "disconnected";
  console.warn(`[DB] Rejecting ${req.method} ${req.originalUrl} — DB ${dbLabel} (readyState=${state})`);

  const message =
    state === 2
      ? "Database is connecting. Please try again."
      : "Database unavailable. Please try again.";

  return res.status(503).json({
    success: false,
    message,
    data: { db: dbLabel, readyState: state },
  });
}
