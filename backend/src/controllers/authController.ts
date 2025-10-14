// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { generateRefCode } from "../utils/refCodeGenerator";
import { sendOtpEmail, sendPasswordResetEmail } from "../utils/sendEmail";
import { generateOtpForEmail, verifyOtpForEmail } from "../services/otpService"; // ✅ imported OTP service
import axios from "axios";
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
// USER SIGNUP (GroLife Supro Imo Referral System)
// ===========================



export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password,phone, referralCode,regamount } = req.body;

    console.log("📥 Incoming signup:", { name, email, referralCode });

    // 1️⃣ Validate fields
    if (!name || !email || !password || !regamount) {
      return res.status(400).json({
        success: false,
        message: "Name, email,Amount and password  are required",
      });
    }

    // 2️⃣ Check duplicates by both email and phone
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // 4️⃣ Referral logic
    let referredBy: string | null = null;
    let ancestors: string[] = [];

    if (referralCode) {
      const parent = await User.findOne({ refCode: referralCode });
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }
      referredBy = parent.refCode;
      ancestors = [...(parent.ancestors || []), parent.refCode];
    }

    // 5️⃣ Generate scalable refCode
    const refCode = await generateRefCode(referralCode || null);

    // 6️⃣ Send SMS FIRST (before creating user)
    const message = `Dear ${name}, thank you for signing up with GroLife Suprimo. Your referral code is ${refCode}.`;


    let smsSent = false;

    try {
      const smsResponse = await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message,
          language: "english",
          route: "q",
          numbers: phone,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );

      console.log("📨 Fast2SMS response:", smsResponse.data);

      // ✅ Confirm SMS was accepted
      const smsData: any = smsResponse.data;
      if (smsResponse.status === 200 && smsData.return === true) {

        smsSent = true;
        console.log("✅ SMS accepted by Fast2SMS");
      } else {
        console.error("⚠️ SMS not accepted:", smsResponse.data);
      }
    } catch (smsError: any) {
      console.error("❌ Failed to send SMS:", smsError.response?.data || smsError.message);
    }

    // 7️⃣ Stop here if SMS failed
    if (!smsSent) {
      return res.status(400).json({
        success: false,
        message: "Signup aborted: SMS could not be sent. Please try again later.",
      });
    }

    // 8️⃣ Create user only after SMS succeeds
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      refCode,
      phone,
      regamount,
      referredBy,
      ancestors,
    });

    console.log("✅ User created:", user.email, "->", refCode);

    // 9️⃣ Respond success
    return res.status(201).json({
      success: true,
      message: "User registered successfully and SMS sent!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        refCode: user.refCode,
        referredBy: user.referredBy,
        ancestors: user.ancestors,
      },
    });
  } catch (err: any) {
    console.error("💥 Signup error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: err.message,
    });
  }
};


// ===========================
// VERIFY OTP (Create user after OTP verification)
// ===========================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code, name, hashedPassword, role } = req.body;

    if (!email || !code || !name || !hashedPassword)
      return jsonErr(res, 400, "All fields are required (email, name, password, OTP)");

    const isValid = await verifyOtpForEmail(email, code);
    if (!isValid) return jsonErr(res, 400, "Invalid or expired OTP");

    const validRoles = ["user", "admin"];
    const finalRole = validRoles.includes(role) ? role : "user";

    // Now create user only after OTP verification
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isVerified: true,
    });

    return jsonOk(
      res,
      { email: user.email},
      `Signup successful and verified as ${finalRole}`
    );
  } catch (err) {
    console.error("Verify OTP error:", err);
    return jsonErr(res, 500, "OTP verification failed");
  }
};


// ===========================
// USER LOGIN
// ===========================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return jsonErr(res, 400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user) return jsonErr(res, 401, "Invalid credentials");
    if (!user.isVerified) return jsonErr(res, 401, "Please verify your email before logging in");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return jsonErr(res, 401, "Invalid credentials");

    // Build payload — include refCode (useful), keep it small
    const payload = {
      userId: user._id.toString(),
      refCode: user.refCode,      // <- included in token
      role: (user as any).role || "user", // optional
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
          refCode: user.refCode,   // <- return to client
          role: (user as any).role || "user",
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
