// =======================================================
// 🌱 Environment Setup (must be first!)
import "./config/env";
// =======================================================

import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";

// ✅ Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// 🌍 CORS (Allow Everything — Vercel-safe)
// =======================================================
app.use(
  cors({
    origin: "*", // ✅ Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests manually (no wildcards)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// =======================================================
// 🧩 Middleware
// =======================================================
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Test Route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running successfully (CORS: Allow All, Vercel-safe)");
});

// ✅ Routes
app.use("/auth", authRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  console.log("📧 Email loaded from:", process.env.EMAIL_USER || "❌ Missing");
});
