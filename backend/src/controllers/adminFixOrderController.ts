import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";



/**
 * 🛠️ Admin Repair Controller
 * Recalculates PV for all orders and regenerates all earnings using shared logic.
 */
export const repairOrderPV = async (req: Request, res: Response) => {
  try {
    const { generateEarnings } = require("../utils/earningCalculator");
    const orders = await Order.find({});
    let updated = 0;
    let earningsGenerated = 0;
    let skipped = 0;

    for (const order of orders) {
      // 🟢 Fetch buyer to attach refCode temporarily
      const buyer = await User.findById(order.userId);
      if (!buyer) {
        console.warn(`⚠️ Skipping order ${order._id}: buyer not found`);
        skipped++;
        continue;
      }

      // 🧩 Attach refCode so generateEarnings works normally
      (order as any).refCode = buyer.refCode;

      // 🟢 Recalculate PV
      const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);
      let totalPV = Math.floor(totalDP / 1000) * 100;
      if (totalPV > 5000) totalPV = 5000;

      order.totalPV = totalPV;
      await order.save();
      updated++;

      // 🟢 Regenerate earnings
      try {
        await generateEarnings(order);
        earningsGenerated++;
      } catch (err: any) {
        console.warn(`⚠️ Skipped earnings generation for order ${order._id}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: `✅ PV recalculated for ${updated} orders (max 5000 PV cap applied). Earnings regenerated for ${earningsGenerated} orders. Skipped ${skipped} missing buyers.`,
    });
  } catch (err: any) {
    console.error("💥 Error recalculating PV & earnings:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
