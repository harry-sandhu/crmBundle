// backend/src/controllers/adminFixOrdersController.ts
import { Request, Response } from "express";
import Order from "../models/Order";

export const repairOrderPV = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    let updated = 0;

    for (const order of orders) {
      const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);

      // Apply new PV logic: 100 per 1000 DP, capped at 5000
      let totalPV = Math.floor(totalDP / 1000) * 100;
      if (totalPV > 5000) totalPV = 5000;

      order.totalPV = totalPV;
      await order.save();
      updated++;
    }

    res.json({
      success: true,
      message: `✅ Recalculated PV for ${updated} orders (max 5000 PV cap applied).`,
    });
  } catch (err: any) {
    console.error("Error recalculating PV:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
