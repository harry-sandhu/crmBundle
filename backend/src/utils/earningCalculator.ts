import User, { IUser } from "../models/User";
import EarningRecord from "../models/EarningRecord";
import { IOrder } from "../models/Order";

// 💰 Constants
export const PV_RATE = 1.2;
export const DIRECT_PERCENT = 0.12;
export const MATCH_PERCENT = 0.12;
export const SPONSOR_MATCH_PERCENT = 1.0;

/**
 * 🧮 generateEarnings(order)
 * Creates EarningRecords for:
 *  - PV (buyer)
 *  - Direct (sponsor)
 *  - Matching (binary)
 *  - Sponsor Matching Bonus
 */
export async function generateEarnings(order: IOrder) {
  try {
    // 1️⃣ Get buyer (use refCode directly because that’s your ID)
    let buyer: IUser | null = await User.findOne({ refCode: order.refCode });

    // Fallback (for older orders that don’t have refCode saved)
    if (!buyer && order.userId) {
      buyer = await User.findById(order.userId);
    }

    if (!buyer) {
      console.warn(`⚠️ No buyer found for order ${order._id}`);
      return;
    }

    const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);
    const pv = Math.floor(totalDP / 1000) * 100;
    const pvAmount = pv * PV_RATE;

    // 2️⃣ PV earning (buyer)
    await EarningRecord.create({
      userId: buyer.refCode,           // ⚡ use refCode as ID equivalent
      refCode: buyer.refCode,
      sourceUserId: buyer.refCode,
      orderId: order.refCode,
      type: "pv",
      amount: pvAmount,
      percent: PV_RATE * 100,
    });

    // 3️⃣ Sponsor Direct income
    let sponsor: IUser | null = null;
    if (buyer.referredBy) {
      sponsor = await User.findOne({ refCode: buyer.referredBy });
    }

    if (sponsor) {
      const directIncome = totalDP * DIRECT_PERCENT;
      await EarningRecord.create({
        userId: sponsor.refCode,
        refCode: sponsor.refCode,
        sourceUserId: buyer.refCode,
        orderId: order.refCode,
        type: "direct",
        amount: directIncome,
        percent: DIRECT_PERCENT * 100,
      });

      // 4️⃣ Matching income (binary)
      const matchingIncome = totalDP * MATCH_PERCENT;
      await EarningRecord.create({
        userId: sponsor.refCode,
        refCode: sponsor.refCode,
        sourceUserId: buyer.refCode,
        orderId: order.refCode,
        type: "matching",
        amount: matchingIncome,
        percent: MATCH_PERCENT * 100,
      });

      // 5️⃣ Sponsor Matching bonus (100%)
      let sponsorUpline: IUser | null = null;
      if (sponsor.referredBy) {
        sponsorUpline = await User.findOne({ refCode: sponsor.referredBy });
      }

      if (sponsorUpline) {
        await EarningRecord.create({
          userId: sponsorUpline.refCode,
          refCode: sponsorUpline.refCode,
          sourceUserId: sponsor.refCode,
          orderId: order.refCode,
          type: "sponsorMatching",
          amount: matchingIncome,
          percent: SPONSOR_MATCH_PERCENT * 100,
        });
      }
    }

    console.log(`✅ Earnings generated successfully for ${order.refCode}`);
  } catch (err: any) {
    console.error("❌ Error generating earnings:", err.message || err);
  }
}
