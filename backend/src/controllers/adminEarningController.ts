// controllers/adminEarningsController.ts
import User from "../models/User";
import Order from "../models/Order";
import EarningRecord from "../models/EarningRecord";
import { Request, Response } from "express";

export const getUsersEarningsSummary = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "name refCode email phone active").lean();

    const refCodes = users.map((u) => u.refCode);

    // 🧩 Aggregate total orders & earnings by refCode
    const [orderAgg, earningAgg] = await Promise.all([
      Order.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $match: { "user.refCode": { $in: refCodes } } },
        {
          $group: {
            _id: "$user.refCode",
            totalOrders: { $sum: 1 },
          },
        },
      ]),

      EarningRecord.aggregate([
        { $match: { refCode: { $in: refCodes } } },
        {
          $group: {
            _id: "$refCode",
            totalEarnings: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    // 📊 Merge into summary
    const orderMap = Object.fromEntries(orderAgg.map((o) => [o._id, o.totalOrders]));
    const earningMap = Object.fromEntries(earningAgg.map((e) => [e._id, e.totalEarnings]));

    const summaries = users.map((u) => ({
      name: u.name,
      refCode: u.refCode,
      email: u.email,
      phone: u.phone || "-",
      active: u.active,
      totalOrders: orderMap[u.refCode] || 0,
      totalEarnings: earningMap[u.refCode] || 0,
    }));

    res.json({ success: true, data: summaries });
  } catch (err) {
    console.error("💥 Error fetching summary:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


export const getUserFullDetails = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;

    const user = await User.findOne({ refCode }).lean();
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // fetch orders by userId and earnings by refCode
    const [orders, earnings] = await Promise.all([
      Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean(),
      EarningRecord.find({ refCode })
        .populate("sourceUserId", "name refCode")
        .populate("orderId")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.json({
      success: true,
      user,
      stats: {
        totalOrders: orders.length,
        totalEarnings: earnings.reduce((acc, e) => acc + e.amount, 0),
      },
      orders,
      earnings,
    });
  } catch (err) {
    console.error("💥 Error fetching user details:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
