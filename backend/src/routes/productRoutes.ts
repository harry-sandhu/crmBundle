// // src/routes/products.public.ts
// import { Router } from "express";
// import Product from "../models/Product";

// const router = Router();

// // Public product list
// router.get("/products", async (_req, res) => {
//   try {
//     const docs = await Product.find({}, { name: 1, description: 1, image: 1, category: 1, mrp: 1, dp: 1 }).lean();
//     const data = docs.map((d: any) => ({
//       id: String(d._id),
//       name: d.name,
//       description: d.description,
//       image: d.image,
//       category: d.category,
//       mrp: d.mrp,
//       dp: d.dp,
//     }));
//     return res.status(200).json({ ok: true, data });
//   } catch {
//     return res.status(500).json({ ok: false, message: "Failed to load products" });
//   }
// });

// export default router;

// src/routes/products.public.ts
import { Router } from "express";
import Product from "../models/Product";

const router = Router();

// GET /api/products
router.get("/products", async (_req, res) => {
  try {
    const docs = await Product.find({}, { name: 1, description: 1, image: 1, category: 1, mrp: 1, dp: 1, price: 1 })
      .sort({ createdAt: -1 })
      .lean();

    const data = docs.map((d: any) => ({
      id: String(d._id),
      name: d.name,
      description: d.description,
      image: d.image,
      category: d.category,
      mrp: d.mrp,
      dp: d.dp,
      price: d.price,
    }));

    return res.status(200).json({ ok: true, data });
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to load products" });
  }
});

export default router;
