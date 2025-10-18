// src/routes/admin.products.ts
import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isValidObjectId } from "mongoose";
import Product from "../models/Product";
import { verifyToken } from "../middleware/authMiddleware";

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

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

const router = Router();

// Helper to build absolute URL for uploaded file
function buildImageUrl(req: Request, filename: string) {
  const host = req.get("host");
  const protocol = req.protocol;
  return `${protocol}://${host}/uploads/${filename}`;
}

// POST /api/admin/products (multipart)
router.post(
  "/admin/products",
  verifyToken,
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const { name, description, price, category, mrp, dp } = req.body || {};
      if (!name || !description || !price || !category || !mrp || !dp) {
        return res.status(400).json({ ok: false, message: "Missing required fields" });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, message: "Image file is required" });
      }

      const imageUrl = buildImageUrl(req, req.file.filename);

      const doc = await Product.create({
        name: String(name).trim(),
        description: String(description).trim(),
        price: Number(price),
        image: imageUrl,
        category: String(category).trim(),
        mrp: Number(mrp),
        dp: Number(dp),
      });

      return res.status(201).json({ ok: true, data: doc });
    } catch {
      return res.status(500).json({ ok: false, message: "Failed to create product" });
    }
  }
);

// PUT /api/admin/products/:id (JSON or multipart)
router.put(
  "/admin/products/:id",
  verifyToken,
  upload.single("imageFile"), // will be undefined for JSON-only updates
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return res.status(400).json({ ok: false, message: "Invalid id" });

      // Collect fields
      const body = req.body || {};
      const update: Record<string, unknown> = {};

      if (typeof body.name === "string") update.name = body.name.trim();
      if (typeof body.description === "string") update.description = body.description.trim();
      if (typeof body.category === "string") update.category = body.category.trim();
      if (typeof body.mrp !== "undefined") update.mrp = Number(body.mrp);
      if (typeof body.dp !== "undefined") update.dp = Number(body.dp);
      if (typeof body.price !== "undefined") update.price = Number(body.price);

      // If new image uploaded
      if (req.file) {
        update.image = buildImageUrl(req, req.file.filename);
      } else if (typeof body.image === "string" && body.image.trim()) {
        // Keep existing supplied image URL when updating via JSON
        update.image = body.image.trim();
      }

      const doc = await Product.findByIdAndUpdate(id, update, { new: true }).lean();
      if (!doc) return res.status(404).json({ ok: false, message: "Product not found" });

      // Map to client shape (id instead of _id)
      const data = {
        id: String(doc._id),
        name: doc.name,
        description: doc.description,
        image: doc.image,
        category: doc.category,
        mrp: doc.mrp,
        dp: doc.dp,
        price: doc.price,
      };

      return res.status(200).json({ ok: true, data });
    } catch {
      return res.status(500).json({ ok: false, message: "Failed to update product" });
    }
  }
);

// DELETE /api/admin/products/:id
router.delete("/admin/products/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, message: "Invalid id" });

    const doc = await Product.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).json({ ok: false, message: "Product not found" });

    return res.status(200).json({ ok: true, data: { id } });
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to delete product" });
  }
});

export default router;
