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
  regamount: number;            // registration amount
  active: boolean;              // ✅ new field — user active/inactive status

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    // Keep unique + index here (Mongoose 7 handles this cleanly)
    email: { type: String, required: true, unique: true, lowercase: true, index: true },

    password: { type: String, required: true, select: true },

    phone: { type: String, default: null },

    isVerified: { type: Boolean, default: true },

    // Each user has their unique referral code
    refCode: { type: String, required: true, unique: true, index: true },

    // Code of the user who referred this one (parent node)
    referredBy: { type: String, default: null, index: true },

    // All ancestor referral codes (used for descendant tree queries)
    ancestors: [{ type: String, index: true }],

    // Registration amount (can be used for earnings or activation)
    regamount: { type: Number, required: true },

    // ✅ New: Whether the user is active or deactivated
    active: { type: Boolean, default: true, index: true },

    // Reset password fields (optional)
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// ⚡ Additional useful indexes
UserSchema.index({ refCode: 1 });
UserSchema.index({ referredBy: 1 });
UserSchema.index({ ancestors: 1 });
UserSchema.index({ active: 1 });

export default mongoose.model<IUser>("User", UserSchema);
