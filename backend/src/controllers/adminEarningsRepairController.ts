// backend/src/controllers/adminEarningsRepairController.ts
import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import EarningRecord from "../models/EarningRecord";
import {
  PV_RATE,
  DIRECT_PERCENT,
  MATCH_PERCENT,
  SPONSOR_MATCH_PERCENT,
} from "../utils/earningCalculator";

/**
 * 🔧 Repair Old Earnings
 * - Converts old ObjectId-based earnings into refCode-based entries
 * - Avoids duplicates
 * - Recalculates PV, Direct, Matching, Sponsor Matching
 */
export const repairOldEarnings = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    let createdCount = 0;

    for (const order of orders) {
      // 🧩 Use refCode as the primary key (modern design)
      let buyer = await User.findOne({ refCode: order.refCode });

      // Fallback to userId for legacy orders
      if (!buyer && order.userId) {
        buyer = await User.findById(order.userId);
      }

      if (!buyer) {
        console.warn(`⚠️ Skipping order ${order._id} — buyer not found`);
        continue;
      }

      // 🛑 Skip already processed
      const alreadyProcessed = await EarningRecord.findOne({
        orderId: order.refCode || order._id,
        type: "pv",
      });
      if (alreadyProcessed) continue;

      const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);
      const pv = Math.floor(totalDP / 1000) * 100;
      const pvAmount = pv * PV_RATE;

      // 1️⃣ PV (Buyer)
      await EarningRecord.create({
        userId: buyer.refCode,
        refCode: buyer.refCode,
        sourceUserId: buyer.refCode,
        orderId: order.refCode || order._id,
        type: "pv",
        amount: pvAmount,
        percent: PV_RATE * 100,
      });

      // 2️⃣ Direct (Sponsor)
      let sponsor: any = null;
      if (buyer.referredBy) {
        sponsor = await User.findOne({ refCode: buyer.referredBy });
        if (sponsor) {
          const directIncome = totalDP * DIRECT_PERCENT;
          await EarningRecord.create({
            userId: sponsor.refCode,
            refCode: sponsor.refCode,
            sourceUserId: buyer.refCode,
            orderId: order.refCode || order._id,
            type: "direct",
            amount: directIncome,
            percent: DIRECT_PERCENT * 100,
          });
        }
      }

      // 3️⃣ Matching (Binary / Sponsor)
      if (sponsor) {
        const matchingIncome = totalDP * MATCH_PERCENT;
        await EarningRecord.create({
          userId: sponsor.refCode,
          refCode: sponsor.refCode,
          sourceUserId: buyer.refCode,
          orderId: order.refCode || order._id,
          type: "matching",
          amount: matchingIncome,
          percent: MATCH_PERCENT * 100,
        });
      }

      // 4️⃣ Sponsor Matching Bonus (Sponsor’s Sponsor)
      if (sponsor?.referredBy) {
        const upline = await User.findOne({ refCode: sponsor.referredBy });
        if (upline) {
          const sponsorMatchIncome = totalDP * MATCH_PERCENT * SPONSOR_MATCH_PERCENT;
          await EarningRecord.create({
            userId: upline.refCode,
            refCode: upline.refCode,
            sourceUserId: sponsor.refCode,
            orderId: order.refCode || order._id,
            type: "sponsorMatching",
            amount: sponsorMatchIncome,
            percent: SPONSOR_MATCH_PERCENT * 100,
          });
        }
      }

      createdCount++;
    }

    res.json({
      success: true,
      message: `✅ Repaired ${createdCount} orders successfully using refCode-based logic.`,
    });
  } catch (err: any) {
    console.error("💥 Error repairing earnings:", err);
    res.status(500).json({
      success: false,
      message: "Server error during earnings repair",
      error: err.message,
    });
  }
};
