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
    console.log(`Custom DNS servers configured: ${servers.join(", ")}`);
  } catch (err) {
    console.warn(`Failed to set custom DNS servers: ${err.message}`);
  }
}

export async function connectDB() {
  configureDnsIfNeeded();
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env file or Vercel environment variables. See .env.example"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export function getConnectionState() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting, 99 = uninitialized
  return mongoose.connection.readyState;
}
