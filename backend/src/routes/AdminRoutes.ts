// // src/routes/admin.members.ts
// import { Router } from "express";
// import type { Request, Response } from "express";
// import { verifyToken } from "../middleware/authMiddleware"; // your JWT guard
// import User from "../models/User"; // the IUser model you shared

// const router = Router();

// /**
//  * GET /api/admin/members
//  * Query params:
//  *  - q     : search term (matches name, email, status, refCode)
//  *  - page  : page number (1-based, default 1)
//  *  - limit : page size (default 20, max 100)
//  */
// router.get(
//   "api/admin/members",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     try {
//       const q = String(req.query.q ?? "").trim().toLowerCase();
//       const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
//       const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 100);
//       const skip = (page - 1) * limit;

//       // Build filter for search
//       const filter: Record<string, unknown> = {};
//       if (q) {
//         filter.$or = [
//           { name: { $regex: q, $options: "i" } },
//           { email: { $regex: q, $options: "i" } },
//           { refCode: { $regex: q, $options: "i" } },
//           { status: { $regex: q, $options: "i" } as any }, // if you store status; else remove
//         ];
//       }

//       // Projection: only return safe fields (exclude password, tokens)
//       const projection = {
//         name: 1,
//         email: 1,
//         phone: 1,
//         isVerified: 1,
//         refCode: 1,
//         referredBy: 1,
//         regamount: 1,
//         createdAt: 1,
//       };

//       const [items, total] = await Promise.all([
//         User.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
//         User.countDocuments(filter),
//       ]);

//       return res.status(200).json({
//         ok: true,
//         data: items.map((u: any) => ({
//           id: String(u._id),
//           name: u.name,
//           email: u.email,
//           phone: u.phone ?? null,
//           isVerified: !!u.isVerified,
//           refCode: u.refCode,
//           referredBy: u.referredBy ?? null,
//           regamount: typeof u.regamount === "number" ? u.regamount : null,
//           joinedAt: u.createdAt,
//           // If you want a computed status, derive it (optional):
//           status: u.isVerified ? "active" : "inactive",
//         })),
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       });
//     } catch (err) {
//       return res.status(500).json({ ok: false, message: "Failed to fetch members" });
//     }
//   }
// );

// export default router;

// src/routes/admin.members.ts
import { Router } from "express";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import User from "../models/User";
import Product from "../models/Product";

const router = Router();

router.get(
  "/admin/members", // <-- add leading slash
  verifyToken,
  async (req: Request, res: Response) => {
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
          // Remove this line if you don't have a status field in DB
          // { status: { $regex: q, $options: "i" } },
        ];
      }

      const projection = {
        name: 1,
        email: 1,
        phone: 1,
        isVerified: 1,
        refCode: 1,
        referredBy: 1,
        regamount: 1,
        createdAt: 1,
      };

      const [items, total] = await Promise.all([
        User.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        User.countDocuments(filter),
      ]);

      return res.status(200).json({
        ok: true,
        data: items.map((u) => ({
          id: String((u as any)._id),
          name: (u as any).name,
          email: (u as any).email,
          phone: (u as any).phone ?? null,
          isVerified: !!(u as any).isVerified,
          refCode: (u as any).refCode,
          referredBy: (u as any).referredBy ?? null,
          regamount: typeof (u as any).regamount === "number" ? (u as any).regamount : null,
          joinedAt: (u as any).createdAt,
          status: (u as any).isVerified ? "active" : "inactive",
        })),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch {
      return res.status(500).json({ ok: false, message: "Failed to fetch members" });
    }
  }
);






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
      regamount: 1,
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
        regamount: typeof u.regamount === "number" ? u.regamount : null,
        createdAt: u.createdAt,
      })),
    });
  } catch {
    return res.status(500).json({ ok: false, message: "Search failed" });
  }
});


import { isValidObjectId } from "mongoose";
router.get("/admin/members/:id", verifyToken, async (req, res) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, message: "Invalid id" });

    const projection = {
      name: 1,
      email: 1,
      phone: 1,
      isVerified: 1,
      refCode: 1,
      referredBy: 1,
      regamount: 1,
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
        regamount: typeof doc.regamount === "number" ? doc.regamount : null,
        createdAt: doc.createdAt as any,
      },
    });
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to load member" });
  }
});


router.post("/admin/products", verifyToken, async (req, res) => {
  try {
    const { name, description, price, image, category, mrp, dp } = req.body || {};

    // basic server-side validation (Mongoose will also enforce)
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
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Failed to create product" });
  }
});

router.get("/products", async (_req, res) => {
  try {
    const docs = await Product.find({}, { name: 1, description: 1, image: 1, category: 1, mrp: 1, dp: 1 }).lean();
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
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to load products" });
  }
});

export default router;
