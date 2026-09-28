import dotenv from "dotenv";
import app from "../server/app.js";
import { connectDB } from "../server/config/db.js";

// Vercel serverless entry point
// Reuses cached Mongoose connection across invocations

dotenv.config();

let dbConnected = false;

export default async function handler(req, res) {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error("Vercel DB connection error:", err.message);
      // Continue — health endpoint will report disconnected
    }
  }

  return app(req, res);
}
