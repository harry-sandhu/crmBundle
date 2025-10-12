// =======================================================
// 🌱 Environment Setup (must be first import!)
import "./config/env";
// =======================================================

import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Root test route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running successfully (TypeScript Edition)!");
});

// ✅ Routes
app.use("/auth", authRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  console.log("📧 Email loaded from:", process.env.EMAIL_USER || "❌ Missing");
});
