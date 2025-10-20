import { Request, Response } from "express";
import User from "../models/User";
import EarningRecord from "../models/EarningRecord";

/**
 * GET /api/earnings/dashboard/:refCode
 * → Returns totals + daily trend data (includes sponsorMatching)
 */
export const getEarningsDashboard = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;

    // 1️⃣ Find user
    const user = await User.findOne({ refCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Fetch all earning records for this user
    const records = await EarningRecord.find({ refCode });
    if (!records.length) {
      return res.json({
        success: true,
        data: {
          totals: {
            pvCommission: 0,
            directIncome: 0,
            matchingIncome: 0,
            sponsorMatchingBonus: 0,
          },
          trends: {
            pvTrend: [],
            directTrend: [],
            matchingTrend: [],
            sponsorMatchingTrend: [],
          },
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

    const totalSponsorMatchingBonus = records
      .filter((r) => r.type === "sponsorMatching")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    // --- Trend data grouped by date ---
    const trendMap: Record<
      string,
      { pv: number; direct: number; matching: number; sponsorMatching: number }
    > = {};

    records.forEach((r) => {
      const date = new Date(r.createdAt!).toISOString().split("T")[0];
      if (!trendMap[date])
        trendMap[date] = { pv: 0, direct: 0, matching: 0, sponsorMatching: 0 };

      if (r.type === "pv") trendMap[date].pv += r.amount || 0;
      else if (r.type === "direct") trendMap[date].direct += r.amount || 0;
      else if (r.type === "matching") trendMap[date].matching += r.amount || 0;
      else if (r.type === "sponsorMatching")
        trendMap[date].sponsorMatching += r.amount || 0;
    });

    const allDates = Object.keys(trendMap).sort();

    const pvTrend = allDates.map((d) => ({ date: d, value: trendMap[d].pv }));
    const directTrend = allDates.map((d) => ({ date: d, value: trendMap[d].direct }));
    const matchingTrend = allDates.map((d) => ({ date: d, value: trendMap[d].matching }));
    const sponsorMatchingTrend = allDates.map((d) => ({
      date: d,
      value: trendMap[d].sponsorMatching,
    }));

    res.json({
      success: true,
      data: {
        totals: {
          pvCommission: totalPVAmount,
          directIncome: totalDirectIncome,
          matchingIncome: totalMatchingIncome,
          sponsorMatchingBonus: totalSponsorMatchingBonus,
        },
        trends: {
          pvTrend,
          directTrend,
          matchingTrend,
          sponsorMatchingTrend,
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
 * → Returns detailed PV, Direct, Matching, SponsorMatching tables
 */
export const getEarningsDetails = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    if (!refCode)
      return res.status(400).json({ success: false, message: "refCode is required" });

    // 1️⃣ Find user
    const user = await User.findOne({ refCode });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Fetch earning records
    const records = await EarningRecord.find({ refCode })
      .sort({ createdAt: -1 })
      .lean();

    if (!records.length) {
      return res.json({
        success: true,
        data: { pv: [], direct: [], matching: [], sponsorMatching: [] },
      });
    }

    // 3️⃣ Collect all buyer refCodes instead of _id
    const buyerRefCodes = Array.from(
      new Set(records.map((r) => String(r.sourceUserId)).filter(Boolean))
    );

    // 4️⃣ Lookup users by refCode instead of _id
    const buyers = await User.find({ refCode: { $in: buyerRefCodes } })
      .select("name phone email refCode")
      .lean();

    const buyerMap = new Map(buyers.map((b) => [b.refCode, b]));

    // 5️⃣ Attach buyer info safely
    const enriched = records.map((r) => ({
      ...r,
      buyer: r.sourceUserId ? buyerMap.get(String(r.sourceUserId)) || null : null,
    }));

    // 6️⃣ Group by type
    const grouped = {
      pv: enriched.filter((r) => r.type === "pv"),
      direct: enriched.filter((r) => r.type === "direct"),
      matching: enriched.filter((r) => r.type === "matching"),
      sponsorMatching: enriched.filter((r) => r.type === "sponsorMatching"),
    };

    res.json({ success: true, data: grouped });
  } catch (err: any) {
    console.error("💥 Error fetching earnings details:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};