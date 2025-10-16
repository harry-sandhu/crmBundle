import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEarningRecord extends Document {
  userId: Types.ObjectId | string;       // the user who earned
  refCode: string;                       // ✅ add this: user’s referral code
  sourceUserId: Types.ObjectId | string; // the buyer who triggered it
  orderId: Types.ObjectId | string;
  type: "pv" | "direct" | "matching";
  level?: number;                        // for matching incomes
  percent?: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const EarningRecordSchema = new Schema<IEarningRecord>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    refCode: { type: String, required: false, index: true }, // ✅ added for new API logic
    sourceUserId: { type: Schema.Types.Mixed, required: true },
    orderId: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ["pv", "direct", "matching"], required: true },
    level: { type: Number },
    percent: { type: Number },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// ✅ Optimized indexes
EarningRecordSchema.index({ refCode: 1, createdAt: -1 });
EarningRecordSchema.index({ type: 1 });
EarningRecordSchema.index({ orderId: 1 });

export default mongoose.model<IEarningRecord>("EarningRecord", EarningRecordSchema);
