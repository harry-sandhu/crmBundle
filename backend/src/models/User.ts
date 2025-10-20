import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isVerified: boolean;
  refCode: string;              // unique referral code
  referredBy?: string | null;   // sponsor's refCode
  ancestors?: string[];         // all ancestors up to root
  // regamount: number;
  active: boolean;

  // 🧩 new: binary MLM position under sponsor
  position?: "left" | "right";

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: { type: String, required: true, select: true },
    phone: { type: String, default: null },

    isVerified: { type: Boolean, default: true },

    refCode: { type: String, required: true, unique: true, index: true },
    referredBy: { type: String, default: null, index: true },
    ancestors: [{ type: String, index: true }],

    // regamount: { type: Number,  },
    // active: { type: Boolean, default: false, index: true },

    // 🧩 binary MLM field
    position: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// ⚡ Helpful indexes
UserSchema.index({ refCode: 1 });
UserSchema.index({ referredBy: 1 });
UserSchema.index({ ancestors: 1 });
UserSchema.index({ active: 1 });
UserSchema.index({ referredBy: 1, position: 1 }); // <— speeds up left/right lookups

export default mongoose.model<IUser>("User", UserSchema);
