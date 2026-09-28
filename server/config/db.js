import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Cached Mongoose connection for Vercel serverless reuse.
 * Prevents creating a new connection on every invocation.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let dnsConfigured = false;
let listenersAttached = false;

function configureDnsIfNeeded() {
  if (dnsConfigured) return;
  const raw = process.env.DNS_SERVERS;
  if (!raw) return;
  const servers = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (servers.length === 0) return;
  try {
    dns.setServers(servers);
    dnsConfigured = true;
    console.log(`[DB] Custom DNS servers configured: ${servers.join(", ")}`);
  } catch (err) {
    console.warn(`[DB] Failed to set custom DNS servers: ${err.message}`);
  }
}

function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  mongoose.connection.on("connected", () => {
    console.log("[DB] Mongoose connected (readyState=1)");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[DB] Mongoose error:", err.message, `readyState=${mongoose.connection.readyState}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] Mongoose disconnected (readyState=0)");
  });
  mongoose.connection.on("reconnected", () => {
    console.log("[DB] Mongoose reconnected (readyState=1)");
  });
}

export async function connectDB() {
  configureDnsIfNeeded();
  attachConnectionListeners();

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env file or Vercel environment variables. See .env.example"
    );
  }

  const readyState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  // If already connected, return
  if (readyState === 1 && cached.conn) {
    return cached.conn;
  }

  // If connecting and we have a pending promise, wait for it
  if (readyState === 2 && cached.promise) {
    console.log("[DB] Connection already in progress (readyState=2), awaiting existing promise");
    try {
      cached.conn = await cached.promise;
      console.log("[DB] Connection established via existing promise (readyState=1)");
      return cached.conn;
    } catch (err) {
      console.error("[DB] Existing connection attempt failed:", err.message, `readyState=${mongoose.connection.readyState}`);
      cached.promise = null;
      cached.conn = null;
      throw err;
    }
  }

  // If disconnected/disconnecting or no promise, clear stale state and create new connection
  if (readyState === 0 || readyState === 3 || !cached.promise) {
    if (cached.promise && (readyState === 0 || readyState === 3)) {
      console.warn(`[DB] Clearing stale promise (readyState=${readyState}) before reconnect`);
      cached.promise = null;
      cached.conn = null;
    }

    if (!cached.promise) {
      console.log(`[DB] Attempting new connection (readyState=${readyState} -> connecting)`);
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      };

      cached.promise = mongoose
        .connect(uri, opts)
        .then((mongooseInstance) => {
          console.log("[DB] Mongoose connect succeeded (readyState=1)");
          return mongooseInstance;
        })
        .catch((err) => {
          console.error("[DB] Mongoose connect failed:", err.message, `readyState=${mongoose.connection.readyState}`);
          throw err;
        });
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log(`[DB] Connection ready (readyState=${mongoose.connection.readyState})`);
    return cached.conn;
  } catch (err) {
    console.error("[DB] Connection attempt error:", err.message, `readyState=${mongoose.connection.readyState}`);
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}

export function getConnectionState() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState;
}

export function getConnectionStateLabel() {
  const s = mongoose.connection.readyState;
  if (s === 1) return "connected";
  if (s === 2) return "connecting";
  return "disconnected";
}
