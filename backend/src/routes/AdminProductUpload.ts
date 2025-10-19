// src/routes/admin.products.upload.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// 🧩 Use writable path depending on environment
const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const UPLOAD_DIR = isVercel ? "/tmp/uploads" : path.join(process.cwd(), "uploads");

// 🧱 Ensure directory exists (only for local or /tmp)
try {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (err: any) {
  console.warn("⚠️ Unable to create uploads folder:", err.message);
}


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});

// 📦 POST /api/admin/products (multipart/form-data)
router.post("/admin/products", verifyToken, upload.single("imageFile"), async (req, res) => {
  try {
    const { name, description, price, category, mrp, dp } = req.body || {};
    if (!name || !description || !price || !category || !mrp || !dp) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "Image file is required" });
    }

    // 🖼️ Build image URL (note: /tmp uploads are ephemeral on Vercel)
    const host = req.get("host");
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const doc = await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      image: imageUrl,
      category: String(category).trim(),
      mrp: Number(mrp),
      dp: Number(dp),
    });

    res.status(201).json({ ok: true, data: doc });
  } catch (e: any) {
    console.error("❌ Product upload failed:", e);
    res.status(500).json({ ok: false, message: "Failed to create product" });
  }
});

export default router;
