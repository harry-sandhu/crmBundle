// backend/src/controllers/orderController.ts
import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import EarningRecord from "../models/EarningRecord";
import {
  calculatePV,
  calculateDirectIncome,
  calculateMatchingIncome,
} from "../utils/earningCalculator";

type SubmitItem = {
  productId: string;
  title: string;
  qty: number;
  dp?: number;
  mrp?: number;
};

export async function submitBundle(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { items, notes } = req.body as { items: SubmitItem[]; notes?: string };

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const totalAmount = items.reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0);

    // 1️⃣ Create the order
    const order = await Order.create({
      userId,
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title || "",
        qty: i.qty,
        dp: i.dp ?? 0,
        mrp: i.mrp ?? 0,
        lineTotal: (i.dp ?? 0) * i.qty,
      })),
      totalAmount,
      notes,
    });

    // 2️⃣ Fetch user info
    const buyer = await User.findById(userId);
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    const buyerRefCode = buyer.refCode;

    // 3️⃣ Compute and store PV income (for buyer)
    const { amount: pvAmount } = calculatePV(order);
    await EarningRecord.create({
      userId: buyer._id,
      refCode: buyerRefCode,
      sourceUserId: buyer._id,
      orderId: order._id,
      type: "pv",
      amount: pvAmount,
    });

    // 4️⃣ Direct income (for parent who referred this buyer)
    if (buyer.referredBy) {
      const referrer = await User.findOne({ refCode: buyer.referredBy });
      if (referrer) {
        const directAmount = calculateDirectIncome(order);
        await EarningRecord.create({
          userId: referrer._id,
          refCode: referrer.refCode,
          sourceUserId: buyer._id,
          orderId: order._id,
          type: "direct",
          amount: directAmount,
        });
      }
    }

    // 5️⃣ Matching income (for all ancestors)
    if (buyer.ancestors?.length) {
      const matchingList = calculateMatchingIncome(order, buyer.ancestors);
      for (const m of matchingList) {
        const ancestor = await User.findOne({ refCode: m.ref });
        if (ancestor) {
          await EarningRecord.create({
            userId: ancestor._id,
            refCode: ancestor.refCode,
            sourceUserId: buyer._id,
            orderId: order._id,
            type: "matching",
            level: m.level,
            percent: m.percent,
            amount: m.income,
          });
        }
      }
    }

    return res.json({
      success: true,
      message: "✅ Order placed and earnings recorded successfully",
      data: { orderId: order._id, totalAmount },
    });
  } catch (err: any) {
    console.error("Error submitting bundle:", err);
    const msg = err instanceof Error ? err.message : "Failed to submit bundle";
    return res.status(500).json({ success: false, message: msg });
  }
}
