import { Request, Response } from "express";
import User from "../models/User";
import EarningRecord from "../models/EarningRecord";

/**
 * GET /api/earnings/dashboard/:refCode
 * → Returns totals + daily trend data
 */
export const getEarningsDashboard = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;

    // Find user first
    const user = await User.findOne({ refCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch all earning records for this user (via refCode)
    const records = await EarningRecord.find({ refCode });

    if (!records.length) {
      return res.json({
        success: true,
        data: {
          totals: { pvCommission: 0, directIncome: 0, matchingIncome: 0 },
          trends: { pvTrend: [], directTrend: [], matchingTrend: [] },
        },
      });
    }

    // --- Totals ---
    const totalPVAmount = records
      .filter((r) => r.type === "pv")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalDirectIncome = records
      .filter((r) => r.type === "direct")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalMatchingIncome = records
      .filter((r) => r.type === "matching")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    // --- Trend data grouped by date ---
    const trendMap: Record<string, { pv: number; direct: number; matching: number }> = {};

    records.forEach((r) => {
      const date = new Date(r.createdAt!).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!trendMap[date]) trendMap[date] = { pv: 0, direct: 0, matching: 0 };

      if (r.type === "pv") trendMap[date].pv += r.amount || 0;
      else if (r.type === "direct") trendMap[date].direct += r.amount || 0;
      else if (r.type === "matching") trendMap[date].matching += r.amount || 0;
    });

    const allDates = Object.keys(trendMap).sort();

    const pvTrend = allDates.map((d) => ({ date: d, value: trendMap[d].pv }));
    const directTrend = allDates.map((d) => ({ date: d, value: trendMap[d].direct }));
    const matchingTrend = allDates.map((d) => ({ date: d, value: trendMap[d].matching }));

    res.json({
      success: true,
      data: {
        totals: {
          pvCommission: totalPVAmount,
          directIncome: totalDirectIncome,
          matchingIncome: totalMatchingIncome,
        },
        trends: {
          pvTrend,
          directTrend,
          matchingTrend,
        },
      },
    });
  } catch (err: any) {
    console.error("Error computing dashboard:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET /api/earnings/details/:refCode
 * → Returns detailed PV, Direct, Matching tables
 */
export const getEarningsDetails = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;

    // Find the user by their referral code
    const user = await User.findOne({ refCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch all earnings associated with this user's refCode
    const records = await EarningRecord.find({ refCode }).sort({ createdAt: -1 });

    const grouped = {
      pv: records.filter((r) => r.type === "pv"),
      direct: records.filter((r) => r.type === "direct"),
      matching: records.filter((r) => r.type === "matching"),
    };

    res.json({ success: true, data: grouped });
  } catch (err: any) {
    console.error("Error fetching earnings details:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
