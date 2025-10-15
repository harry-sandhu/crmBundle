// import { Router } from "express";
// import { verifyToken } from "../middleware/authMiddleware";
// import { submitBundle } from "../controllers/orderController";
// import Order from "../models/Order";

// const router = Router();
// router.post("/orders/submit", verifyToken, submitBundle);


// router.get("/orders/my", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!.id;
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
//     const skip = (page - 1) * limit;

//     const [rows, total] = await Promise.all([
//       Order.find({ userId })
//         .select({ items: 0 }) // omit items for list
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Order.countDocuments({ userId }),
//     ]);

//     return res.json({
//       success: true,
//       data: rows,
//       meta: { page, limit, total, pages: Math.ceil(total / limit) },
//     });
//   } catch (e: any) {
//     return res.status(500).json({ success: false, message: e?.message || "Server error" });
//   }
// });

// // Order detail
// router.get("/orders/:id", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!.id;
//     const { id } = req.params;
//     const order = await Order.findOne({ _id: id, userId }).lean();
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
//     return res.json({ success: true, data: order });
//   } catch (e: any) {
//     return res.status(500).json({ success: false, message: e?.message || "Server error" });
//   }
// });



// export default router;

// backend/src/routes/orders.ts
// import { Router, Request, Response } from "express";
// import { verifyToken } from "../middleware/authMiddleware";
// import { submitBundle } from "../controllers/orderController";
// import Order from "../models/Order";

// const router = Router();

// // Submit bundle -> create order
// router.post("/orders/submit", verifyToken, submitBundle);

// // List my orders
// router.get("/orders/my", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!.id;
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
//     const skip = (page - 1) * limit;

//     const [rows, total] = await Promise.all([
//       Order.find({ userId })
//         .select({ items: 0 })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Order.countDocuments({ userId }),
//     ]);

//     return res.json({
//       success: true,
//       data: rows,
//       meta: { page, limit, total, pages: Math.ceil(total / limit) },
//     });
//   } catch (err: unknown) {
//     const msg = err instanceof Error ? err.message : "Server error";
//     return res.status(500).json({ success: false, message: msg });
//   }
// });

// // Order detail
// router.get("/orders/:id", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!.id;
//     const { id } = req.params;
//     const order = await Order.findOne({ _id: id, userId }).lean();
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
//     return res.json({ success: true, data: order });
//   } catch (err: unknown) {
//     const msg = err instanceof Error ? err.message : "Server error";
//     return res.status(500).json({ success: false, message: msg });
//   }
// });

// export default router;


// backend/src/routes/orders.ts
import { Router, Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { submitBundle } from "../controllers/orderController";
import Order from "../models/Order";
import Product from "../models/Product";
// Optional: import Product if you want to backfill missing titles during read
// import Product from "../models/Product";

const router = Router();

// Submit bundle -> create order
router.post("/orders/submit", verifyToken, submitBundle);

// List my orders
router.get("/orders/my", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      Order.find({ userId })
        .select({ items: 0 }) // omit items for list
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ userId }),
    ]);

    return res.json({
      success: true,
      data: rows,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ success: false, message: msg });
  }
});

// Order detail
router.get("/orders/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId }).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Optional backfill: if older orders lack title, map from Catalog
    // if (Array.isArray(order.items)) {
    //   const missingIds = order.items.filter((it: any) => !it.title && it.productId).map((it: any) => it.productId);
    //   if (missingIds.length) {
    //     const products = await Product.find({ _id: { $in: missingIds } }).select({ _id: 1, title: 1 }).lean();
    //     const map = new Map(products.map((p) => [String(p._id), p.title]));
    //     order.items = order.items.map((it: any) => ({
    //       ...it,
    //       title: it.title || map.get(String(it.productId)) || `Product ${it.productId}`,
    //     }));
    //   }
    // }

    return res.json({ success: true, data: order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ success: false, message: msg });
  }
});

export default router;
