import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";



/**
 * POST /api/orders/submit
 * Creates a new bundle order and triggers MLM income generation.
 */
export async function submitBundle(req: Request, res: Response) {
  try {
    const { generateEarnings } = require("../utils/earningCalculator");
    const { refCode, items, notes } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    // 1️⃣ Find the buyer by refCode
    const buyer = await User.findOne({ refCode });
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    // 2️⃣ Calculate totals
    const totalAmount = items.reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0);
    const totalPV = Math.floor(totalAmount / 1000) * 100;

    // 3️⃣ Create the order
    const order = await Order.create({
      userId: buyer._id,
      refCode: buyer.refCode,
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title || "",
        qty: i.qty,
        dp: i.dp ?? 0,
        mrp: i.mrp ?? 0,
        lineTotal: (i.dp ?? 0) * i.qty,
      })),
      totalAmount,
      totalPV,
      notes,
      status: "submitted",
    });

    // 4️⃣ Generate MLM earnings
    await generateEarnings(order);

    return res.json({
      success: true,
      message: "✅ Bundle submitted and earnings recorded successfully.",
      data: { orderId: order._id, totalAmount, totalPV },
    });
  } catch (err: any) {
    console.error("❌ Error submitting bundle:", err);
    const msg = err instanceof Error ? err.message : "Failed to submit bundle";
    return res.status(500).json({ success: false, message: msg });
  }
}

/**
 * GET /api/orders/:refCode
 * Returns all bundle orders by refCode
 */
export async function getOrdersByRefCode(req: Request, res: Response) {
  try {
    const { refCode } = req.params;
    const orders = await Order.find({ refCode }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err: any) {
    console.error("❌ Error fetching bundle orders:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: err.message,
    });
  }
}
