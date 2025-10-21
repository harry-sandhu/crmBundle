import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import EarningRecord from "../models/EarningRecord";

export const getAdminSummary = async (req: Request, res: Response) => {
  try {
    // 🧮 USERS
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ active: true });
    const inactiveUsers = totalUsers - activeUsers;

    // 🧾 ORDERS
    const totalOrders = await Order.countDocuments({});
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // 💰 EARNINGS
    const allEarnings = await EarningRecord.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const earningsMap: Record<string, number> = {
      pv: 0,
      direct: 0,
      matching: 0,
      sponsorMatching: 0, // ✅ NEW
    };

    allEarnings.forEach((e) => (earningsMap[e._id] = e.total));

    // 🕒 RECENT EARNINGS
    const recentEarningsRaw = await EarningRecord.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const refCodes = recentEarningsRaw.map((r) => r.refCode).filter(Boolean);
    const users = await User.find({ refCode: { $in: refCodes } })
      .select("name email refCode")
      .lean();

    const userMap = Object.fromEntries(users.map((u) => [u.refCode, u]));

    const recentEarnings = recentEarningsRaw.map((r) => ({
      ...r,
      userId: userMap[r.refCode] || {
        name: "Unknown",
        email: "",
        refCode: r.refCode || "-",
      },
    }));

    // ✅ RESPONSE
    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
        },
        orders: {
          total: totalOrders,
          totalSales,
        },
        earnings: {
          pv: earningsMap.pv,
          direct: earningsMap.direct,
          matching: earningsMap.matching,
          sponsorMatching: earningsMap.sponsorMatching, // ✅ NEW
          total:
            (earningsMap.pv || 0) +
            (earningsMap.direct || 0) +
            (earningsMap.matching || 0) +
            (earningsMap.sponsorMatching || 0), // ✅ include new type
        },
        recentEarnings,
      },
    });
  } catch (err: any) {
    console.error("💥 Error in admin summary:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching summary.",
      error: err.message,
    });
  }
};
