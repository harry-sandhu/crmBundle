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

// =======================================================
// 🔒 CORS Configuration
// =======================================================
const allowedOrigins = [
  "http://localhost:5173",                // ✅ Local frontend (development)
  "https://crm-bundle.vercel.app",        // ✅ Backend domain itself
  "https://crm-bundle-frontend.vercel.app" // ✅ (optional) Future deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 CORS blocked request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================================================
// ⚙️ Middleware
// =======================================================
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
