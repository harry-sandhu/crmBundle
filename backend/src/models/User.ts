// backend/models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;  
  password: string;
 
  isVerified: boolean;
  refCode: string;                     // 🔹 unique referral code
  referredBy?: string | null;          // 🔹 parent’s refCode (if any)
  ancestors?: string[];                // 🔹 all ancestors up to root
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    isVerified: { type: Boolean, default: true }, // ✅ since no OTP now
    refCode: { type: String, required: true, unique: true },
    referredBy: { type: String, default: null },
    ancestors: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ refCode: 1 });
UserSchema.index({ referredBy: 1 });
UserSchema.index({ ancestors: 1 });

export default mongoose.model<IUser>("User", UserSchema);
