import { Request, Response } from "express";
import User from "../models/User";

export const updateUserPosition = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    const { position } = req.body;

    if (!refCode || !["left", "right"].includes(position)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid refCode or position value.",
      });
    }

    const user = await User.findOneAndUpdate(
      { refCode },
      { position },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      ok: true,
      message: `User position updated to ${position}`,
      data: {
        refCode: user.refCode,
        position: user.position,
      },
    });
  } catch (err) {
    console.error("Error updating position:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to update user position.",
    });
  }
};
