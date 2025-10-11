// backend/src/services/otpService.ts
import Otp from "../models/otp";

export const generateOtpForEmail = async (email: string) => {
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  
  await Otp.deleteMany({ email });

  await Otp.create({ email, code, expiresAt });
  return code;
};

export const verifyOtpForEmail = async (email: string, code: string) => {
  const otp = await Otp.findOne({ email, code, expiresAt: { $gt: new Date() } });
  if (!otp) return false;
  
  await Otp.deleteMany({ email });
  return true;
};
