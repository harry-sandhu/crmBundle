// backend/src/routes/authRoutes.ts
import express from "express";
import {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);            // step 1 — send OTP
router.post("/verify-otp", verifyOtp);     // step 2 — verify OTP and create user
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
