// backend/src/routes/admin.orders.ts
import { Router } from "express";
import Order from "../models/Order";
import User from "../models/User"; // optional if you have this
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// GET /api/admin/orders/users
router.get("/admin/orders/users", verifyToken, async (_req, res) => {
  try {
    // Aggregate order summaries by userId
    const agg = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          totalPV: { $sum: "$totalPV" },
          lastOrderAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastOrderAt: -1 } },
    ]);

    // Optional join with User details if available
    const userIds = agg.map((a) => String(a._id));
    let usersMap: Record<string, { name?: string; email?: string; phone?: string }> = {};

    try {
      // Only if a User model exists
      const profiles = await User.find(
        { _id: { $in: userIds } },
        { name: 1, email: 1, phone: 1 }
      ).lean();

      usersMap = Object.fromEntries(
        profiles.map((u: any) => [String(u._id), { name: u.name, email: u.email, phone: u.phone }])
      );
    } catch {
      // If User model not present, just skip enrichment
    }

    const data = agg.map((a) => {
      const key = String(a._id);
      const profile = usersMap[key] || {};
      return {
        userId: key,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        orderCount: a.orderCount || 0,
        totalSpent: a.totalSpent || 0,
        totalPV: a.totalPV || 0,
        lastOrderAt: a.lastOrderAt || null,
      };
    });

    return res.status(200).json({ ok: true, data });
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to load order summaries" });
  }
});

// GET /api/admin/orders/user/:userId
router.get("/admin/orders/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const docs = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    const data = docs.map((d: any) => ({
      id: String(d._id),
      userId: String(d.userId),
      items: (d.items || []).map((it: any) => ({
        productId: String(it.productId),
        title: it.title,
        qty: it.qty,
        dp: it.dp,
        mrp: it.mrp,
        lineTotal: it.lineTotal,
      })),
      totalAmount: d.totalAmount,
      totalPV: d.totalPV || 0,
      status: d.status || "submitted",
      notes: d.notes,
      createdAt: d.createdAt?.toISOString?.() || new Date(d.createdAt).toISOString(),
    }));

    return res.status(200).json({ ok: true, data });
  } catch {
    return res.status(500).json({ ok: false, message: "Failed to load user orders" });
  }
});

export default router;
