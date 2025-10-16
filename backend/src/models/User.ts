import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isVerified: boolean;
  refCode: string;              // unique referral code
  referredBy?: string | null;   // parent's refCode
  ancestors?: string[];         // all ancestors up to root
  regamount?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    // Keep unique + index here, remove duplicate schema.index below
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true,select:true },
    phone: { type: String, default: null },
    isVerified: { type: Boolean, default: true },
    // Keep unique here, remove duplicate schema.index below
    refCode: { type: String, required: true, unique: true, index: true },
    referredBy: { type: String, default: null, index: true }, // index for direct referrals
    ancestors: [{ type: String, index: true }],               // index for descendant queries
    regamount: { type: Number, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Remove these duplicates to avoid warnings:
// UserSchema.index({ email: 1 });
// UserSchema.index({ refCode: 1 });
// UserSchema.index({ referredBy: 1 });
// UserSchema.index({ ancestors: 1 });

export default mongoose.model<IUser>("User", UserSchema);
