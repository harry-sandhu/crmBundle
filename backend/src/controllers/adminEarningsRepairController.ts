// backend/src/controllers/adminEarningsRepairController.ts
import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import EarningRecord from "../models/EarningRecord";
import {
  calculateDirectIncome,
  calculateMatchingIncome,
} from "../utils/earningCalculator";

export const repairOldEarnings = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    let createdCount = 0;

    for (const order of orders) {
      const buyer = await User.findById(order.userId);
      if (!buyer) continue;

      // Skip already processed
      const alreadyProcessed = await EarningRecord.findOne({
        orderId: order._id,
        type: "pv",
      });
      if (alreadyProcessed) continue;

      // 1️⃣ PV (from stored totalPV)
      if (order.totalPV && order.totalPV > 0) {
        await EarningRecord.create({
          userId: buyer._id,
          refCode: buyer.refCode,
          sourceUserId: buyer._id,
          orderId: order._id,
          type: "pv",
          amount: order.totalPV, // ✅ use stored capped PV
        });
      }

      // 2️⃣ Direct Income (for parent)
      if (buyer.referredBy) {
        const parent = await User.findOne({ refCode: buyer.referredBy });
        if (parent) {
          const directIncome = calculateDirectIncome(order);
          await EarningRecord.create({
            userId: parent._id,
            refCode: parent.refCode,
            sourceUserId: buyer._id,
            orderId: order._id,
            type: "direct",
            amount: directIncome,
          });
        }
      }

      // 3️⃣ Matching Income (for ancestors)
      if (buyer.ancestors?.length) {
        const matchingList = calculateMatchingIncome(order, buyer.ancestors);
        for (const match of matchingList) {
          const ancestor = await User.findOne({ refCode: match.ref });
          if (ancestor) {
            await EarningRecord.create({
              userId: ancestor._id,
              refCode: ancestor.refCode,
              sourceUserId: buyer._id,
              orderId: order._id,
              type: "matching",
              level: match.level,
              percent: match.percent,
              amount: match.income,
            });
          }
        }
      }

      createdCount++;
    }

    res.json({
      success: true,
      message: `✅ Earnings repaired successfully for ${createdCount} orders (using stored totalPV).`,
    });
  } catch (err: any) {
    console.error("Error repairing earnings:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
