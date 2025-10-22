import { Router } from "express";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import User from "../models/User";
import Product from "../models/Product";
import { isValidObjectId } from "mongoose";

const router = Router();

/* -----------------------------------------------------
   🧾 GET /admin/members
   Paginated members list with optional search query
----------------------------------------------------- */
router.get("/admin/members", verifyToken, async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { refCode: { $regex: q, $options: "i" } },
      ];
    }

    const projection = {
      name: 1,
      email: 1,
      phone: 1,
      isVerified: 1,
      refCode: 1,
      referredBy: 1,
      position: 1, // ✅ added so position shows in frontend
      active: 1,
      createdAt: 1,
    };

    const [items, total] = await Promise.all([
      User.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      ok: true,
      data: items.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        phone: u.phone ?? null,
        isVerified: !!u.isVerified,
        refCode: u.refCode,
        referredBy: u.referredBy ?? null,
        position: u.position ?? "left",
        joinedAt: u.createdAt,
        status: u.active ? "active" : "inactive",
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching members:", err);
    return res.status(500).json({ ok: false, message: "Failed to fetch members" });
  }
});

/* -----------------------------------------------------
   🔍 GET /admin/members/search
   Search members (for autocomplete or small result sets)
----------------------------------------------------- */
router.get("/admin/members/search", verifyToken, async (req, res) => {
  try {
    const q = String(req.query.q ?? "").trim();
    if (!q) return res.status(200).json({ ok: true, data: [] });

    const filter: Record<string, unknown> = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { refCode: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };

    const projection = {
      name: 1,
      email: 1,
      phone: 1,
      isVerified: 1,
      refCode: 1,
      referredBy: 1,
      position: 1, // ✅ added
      createdAt: 1,
    };

    const items = await User.find(filter, projection).sort({ createdAt: -1 }).limit(50).lean().exec();

    return res.status(200).json({
      ok: true,
      data: items.map((u: any) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        phone: u.phone ?? null,
        isVerified: !!u.isVerified,
        refCode: u.refCode,
        referredBy: u.referredBy ?? null,
        position: u.position ?? "left",
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error searching members:", err);
    return res.status(500).json({ ok: false, message: "Search failed" });
  }
});

/* -----------------------------------------------------
   👤 GET /admin/members/:id
   Get member by ObjectId
----------------------------------------------------- */
router.get("/admin/members/:id", verifyToken, async (req, res) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id))
      return res.status(400).json({ ok: false, message: "Invalid ID" });

    const projection = {
      name: 1,
      email: 1,
      phone: 1,
      isVerified: 1,
      refCode: 1,
      referredBy: 1,
      position: 1,
      createdAt: 1,
    };

    const doc = await User.findById(id, projection).lean().exec();
    if (!doc) return res.status(404).json({ ok: false, message: "Not found" });

    return res.status(200).json({
      ok: true,
      data: {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        phone: doc.phone ?? null,
        isVerified: !!doc.isVerified,
        refCode: doc.refCode,
        referredBy: doc.referredBy ?? null,
        position: doc.position ?? "left",
        createdAt: doc.createdAt as any,
      },
    });
  } catch (err) {
    console.error("Error loading member:", err);
    return res.status(500).json({ ok: false, message: "Failed to load member" });
  }
});

/* -----------------------------------------------------
   📦 POST /admin/products
   Create new product
----------------------------------------------------- */
router.post("/admin/products", verifyToken, async (req, res) => {
  try {
    const { name, description, price, image, category, mrp, dp } = req.body || {};

    if (
      !name ||
      !description ||
      typeof price !== "number" ||
      !image ||
      !category ||
      typeof mrp !== "number" ||
      typeof dp !== "number"
    ) {
      return res.status(400).json({ ok: false, message: "Missing or invalid fields" });
    }

    const doc = await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price,
      image: String(image).trim(),
      category: String(category).trim(),
      mrp,
      dp,
    });

    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ ok: false, message: "Failed to create product" });
  }
});

/* -----------------------------------------------------
   🛍️ GET /products
   Public route to list all products
----------------------------------------------------- */
router.get("/products", async (_req, res) => {
  try {
    const docs = await Product.find({}, {
      name: 1,
      description: 1,
      image: 1,
      category: 1,
      mrp: 1,
      dp: 1,
    }).lean();

    const data = docs.map((d: any) => ({
      id: String(d._id),
      name: d.name,
      description: d.description,
      image: d.image,
      category: d.category,
      mrp: d.mrp,
      dp: d.dp,
    }));

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("Error loading products:", err);
    return res.status(500).json({ ok: false, message: "Failed to load products" });
  }
});

export default router;
