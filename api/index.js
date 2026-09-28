import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../server/app.js";
import { connectDB, getConnectionState } from "../server/config/db.js";

// Vercel serverless entry point
// Uses Mongoose connection state as source of truth, not a boolean flag

dotenv.config();

export default async function handler(req, res) {
  const startState = getConnectionState();
  try {
    await connectDB();
    console.log(`[DB] handler: connect ok startState=${startState} -> readyState=${getConnectionState()} url=${req.url}`);
  } catch (err) {
    // Never log URI/credentials — err.message is safe (contains no password for SRV errors)
    console.error(
      `[DB] handler: connect failed startState=${startState} -> readyState=${getConnectionState()} url=${req.url} error=${err.message}`
    );
    // Do not return here — let health endpoint report disconnected,
    // but DB-dependent routes will be rejected by requireDb middleware with 503
    // For non-health routes, we could early return 503, but requireDb will handle it after app() as well
  }

  // Also log readyState for every invocation for diagnostics (without URI)
  console.log(`[DB] handler: invoking app readyState=${getConnectionState()} url=${req.url}`);

  return app(req, res);
}
