import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!oldPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Missing fields" });
    if (newPassword.length < 1)
      return res.status(400).json({ success: false, message: "Password too short" });

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed as unknown as string;
    await user.save();

    // Optionally: invalidate other sessions/tokens depending on your auth strategy.

    return res.json({ success: true, message: "Password updated" });
  } catch (e: any) {
    console.error("changePassword error:", e?.message || e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
