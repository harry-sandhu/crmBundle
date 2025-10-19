// =======================================================
// 🌱 Environment Setup (must be first!)
import "./config/env";
// =======================================================

import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import dotenv from "dotenv";
// import AdminRoutes from "./routes/AdminRoutes";
// import superAdminRoutes from "./routes/superAdminRoutes";
import treeRoutes from "./routes/treeRoutes";
import meRoutes from "./routes/me"
import orderRoutes from "./routes/orders";
import earningsRoutes from "./routes/earningRoutes"
import adminEarningsRoutes from "./routes/adminEarningsRoutes";
import adminFixOrdersRoutes from "./routes/adminFixOrderRoutes"
import adminMembers from "./routes/AdminRoutes";
import adminMemberSearch from "./routes/AdminRoutes";
import adminMemberDetail from "./routes/AdminRoutes";
import adminProducts from "./routes/AdminRoutes";
import productsPublic from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// 🌍 CORS (Allow Everything — Vercel-safe)
// =======================================================
app.use(
  cors({
    origin: "*", // ✅ Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
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
// app.use("/admin", AdminRoutes);
// app.use("/Superadmin", superAdminRoutes);
app.use("/api", treeRoutes);
app.use("/api/me", meRoutes);
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/admin/earnings", adminEarningsRoutes);
app.use("/api/admin/fix", adminFixOrdersRoutes);
app.use("/", adminMembers);
app.use("/", adminMemberSearch);
app.use("/", adminMemberDetail);
app.use("/api", adminProducts);
app.use("/api", productsPublic);

// src/app.ts (excerpt)
import path from "path";

import adminProductsUpload from "./routes/AdminProductUpload";
import adminOrders from "./routes/AdminOrderRoutes";
// ... your existing app setup and middlewares
import adminProductConfigure from "./routes/adminProductsConfigure"

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", adminProductsUpload);
app.use("/api", adminProductConfigure);
app.use("/api", adminOrders);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  console.log("📧 Email loaded from:", process.env.EMAIL_USER || "❌ Missing");
});
