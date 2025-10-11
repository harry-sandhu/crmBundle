// backend/src/models/Otp.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt?: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto delete expired OTPs
export default mongoose.model<IOtp>("Otp", OtpSchema);
