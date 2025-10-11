// backend/src/controllers/otpController.ts
import { Request, Response } from "express";
import Otp from "../models/otp";
import User from "../models/User";
import { sendOtpEmail } from "../utils/sendEmail";

// Helper to generate 6-digit OTP
const generateOtpCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * ============================
 * SEND OTP
 * ============================
 * Used for email verification or re-sending OTP.
 */
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    // Clean up existing OTPs
    await Otp.deleteMany({ email });

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await Otp.create({ email, code, expiresAt });

    try {
      await sendOtpEmail(email, code);
    } catch (err) {
      console.error("Error sending OTP email:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email" });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

/**
 * ============================
 * VERIFY OTP
 * ============================
 * Confirms OTP for email verification.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP code are required" });

    const otpRecord = await Otp.findOne({ email, code });

    if (!otpRecord)
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });

    // Mark user as verified
    await User.updateOne({ email }, { $set: { isVerified: true } });

    // Cleanup OTPs for that email
    await Otp.deleteMany({ email });

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
  }
};
