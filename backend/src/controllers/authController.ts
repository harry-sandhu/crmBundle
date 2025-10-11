// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail, sendPasswordResetEmail } from "../utils/sendEmail";
import { generateOtpForEmail, verifyOtpForEmail } from "../services/otpService"; // ✅ imported OTP service

// ===========================
// CONFIG & CONSTANTS
// ===========================
const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret";
const JWT_EXPIRES = parseInt(process.env.JWT_EXPIRES || "604800", 10); // 7 days
const options: SignOptions = { expiresIn: JWT_EXPIRES };

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

const jsonOk = (res: Response, data: any, message = "OK") =>
  res.json({ success: true, message, data });

const jsonErr = (res: Response, status = 400, message = "Error") =>
  res.status(status).json({ success: false, message });

// ===========================
// USER SIGNUP (reuses otpService)
// ===========================
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return jsonErr(res, 400, "Name, email, and password are required");

    const existing = await User.findOne({ email });
    if (existing) return jsonErr(res, 400, "User already exists");

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const validRoles = ["user", "admin"];
    const finalRole = validRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: finalRole,
      isVerified: false,
    });

    
    const otpCode = await generateOtpForEmail(email);
    await sendOtpEmail(email, otpCode);

    return jsonOk(
      res,
      { email: user.email, role: finalRole },
      `Registration successful as ${finalRole}. OTP sent to email.`
    );
  } catch (err) {
    console.error("Signup error:", err);
    return jsonErr(res, 500, "Signup failed");
  }
};

// ===========================
// USER LOGIN
// ===========================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return jsonErr(res, 400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user) return jsonErr(res, 401, "Invalid credentials");
    if (!user.isVerified)
      return jsonErr(res, 401, "Please verify your email before logging in");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return jsonErr(res, 401, "Invalid credentials");

    const payload = {
      userId: user._id.toString(),
      role: user.role as "user" | "admin",
    };

    const token = jwt.sign(payload, JWT_SECRET, options);

    return jsonOk(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    );
  } catch (err) {
    console.error("Login error:", err);
    return jsonErr(res, 500, "Login failed");
  }
};

// ===========================
// VERIFY OTP (reuses otpService)
// ===========================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return jsonErr(res, 400, "Email and OTP code are required");

    const isValid = await verifyOtpForEmail(email, code);
    if (!isValid) return jsonErr(res, 400, "Invalid or expired OTP");

    await User.updateOne({ email }, { $set: { isVerified: true } });

    return jsonOk(res, null, "Email verified successfully");
  } catch (err) {
    console.error("Verify OTP error:", err);
    return jsonErr(res, 500, "OTP verification failed");
  }
};

// ===========================
// FORGOT PASSWORD
// ===========================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return jsonErr(res, 404, "No account found with that email");

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    return jsonOk(res, null, "Password reset link sent to your email");
  } catch (err) {
    console.error("Forgot password error:", err);
    return jsonErr(res, 500, "Password reset failed");
  }
};

// ===========================
// RESET PASSWORD
// ===========================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return jsonErr(res, 400, "Token and new password are required");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return jsonErr(res, 400, "Invalid or expired token");

    user.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return jsonOk(res, null, "Password reset successful");
  } catch (err) {
    console.error("Reset password error:", err);
    return jsonErr(res, 500, "Password reset failed");
  }
};
