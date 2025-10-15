import { Router, Request, Response } from "express";
import { verifyToken, attachRefCode } from "../middleware/authMiddleware";
import User from "../models/User";
import Order from "../models/Order";
import Wallet from "../models/Wallet";

const router = Router();


router.get("/dashboard", verifyToken, attachRefCode, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const refCode = req.user!.refCode!;

    // Total users in the whole org
    const totalUsers = await User.countDocuments({});

    // Your existing metrics
    const totalMembers = await User.countDocuments({ ancestors: refCode });
    const myReferralJoined = await User.countDocuments({ referredBy: refCode });

    const earningAgg = await Wallet.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
      { $project: { _id: 0, total: 1 } },
    ]);
    const totalEarning = earningAgg[0]?.total || 0;

    const purchaseAgg = await Order.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      { $project: { _id: 0, total: 1 } },
    ]);
    const myPurchases = purchaseAgg[0]?.total || 0;

    return res.json({
      success: true,
      data: {
        totalUsers,           // NEW
        totalMembers,         // descendants under me
        myReferralJoined,     // direct referrals
        totalEarning,
        myPurchases,
        myRefCode: refCode,
      },
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
});


// GET /api/me/team?mode=descendants|direct
router.get("/team", verifyToken, attachRefCode, async (req: Request, res: Response) => {
  try {
    const refCode = req.user!.refCode!;
    const mode = String(req.query.mode || "descendants");

    const filter =
      mode === "direct"
        ? { referredBy: refCode }
        : { ancestors: refCode };

    const users = await User.find(filter)
      .select({ _id: 1, name: 1, email: 1, phone: 1, refCode: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean();

    const team = users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      phone: u.phone || null,
      refCode: u.refCode,
      joinedAt: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : undefined,
    }));

    return res.json({ success: true, data: team });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
});

router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch current user (exclude password implicitly)
    const me = await User.findById(userId)
      .select("name email phone isVerified refCode referredBy ancestors regamount createdAt")
      .lean();
    if (!me) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find referrer by refCode
    let referrerName: string | null = null;
    if (me.referredBy) {
      const referrer = await User.findOne({ refCode: me.referredBy })
        .select("name")
        .lean();
      referrerName = referrer?.name || null;
    }

    return res.json({
      success: true,
      data: {
        name: me.name,
        email: me.email,
        phone: me.phone ?? null,
        isVerified: me.isVerified,
        refCode: me.refCode,
        referredBy: me.referredBy ?? null,
        referrerName,                 // NEW
        ancestors: me.ancestors ?? [],
        regamount: me.regamount ?? null,
        createdAt: me.createdAt ?? null,
      },
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
});


export default router;
