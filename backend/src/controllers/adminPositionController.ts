import { Request, Response } from "express";
import User from "../models/User";

/**
 * POST /api/admin/assign-position
 * Body: { userRef, sponsorRef, position }
 */
export const assignPosition = async (req: Request, res: Response) => {
  try {
    const { userRef, sponsorRef, position } = req.body;

    // 1️⃣ Validate input
    if (!userRef || !sponsorRef || !position) {
      return res.status(400).json({
        success: false,
        message: "userRef, sponsorRef, and position are required.",
      });
    }

    if (!["left", "right"].includes(position)) {
      return res.status(400).json({
        success: false,
        message: "Position must be 'left' or 'right'.",
      });
    }

    // 2️⃣ Verify sponsor exists
    const sponsor = await User.findOne({ refCode: sponsorRef });
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    // 3️⃣ Verify target user exists
    const user = await User.findOne({ refCode: userRef });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User to assign not found.",
      });
    }

    // 4️⃣ Check if sponsor already has someone on that side
    const existing = await User.findOne({
      referredBy: sponsorRef,
      position,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Sponsor already has a ${position} side filled (by ${existing.refCode}).`,
      });
    }

    // 5️⃣ Build ancestors chain
    const ancestors = [sponsor.refCode, ...(sponsor.ancestors || [])];

    // 6️⃣ Update target user’s placement
    user.referredBy = sponsorRef;
    user.position = position as "left" | "right";
    user.ancestors = ancestors;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.refCode} assigned to ${position} side of sponsor ${sponsor.refCode}.`,
      data: {
        user: user.refCode,
        sponsor: sponsor.refCode,
        position: user.position,
        ancestors: user.ancestors,
      },
    });
  } catch (err: any) {
    console.error("Error assigning position:", err);
    res.status(500).json({
      success: false,
      message: "Server error while assigning position.",
      error: err.message,
    });
  }
};
