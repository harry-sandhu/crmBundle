import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEarningRecord extends Document {
  userId: Types.ObjectId | string;       // who earned
  refCode: string;                       // earner’s ref code
  sourceUserId: Types.ObjectId | string; // whose action triggered this income
  orderId: Types.ObjectId | string;

  // 🧩 Four income types
  type: "pv" | "direct" | "matching" | "sponsorMatching";

  level?: number;                        // optional — for matching levels
  percent?: number;                      // commission %
  amount: number;                        // money earned

  // 🧩 Optional binary helpers
  carryForwardLeft?: number;
  carryForwardRight?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

const EarningRecordSchema = new Schema<IEarningRecord>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    refCode: { type: String, required: true, index: true },
    sourceUserId: { type: Schema.Types.Mixed, required: true },
    orderId: { type: Schema.Types.Mixed, required: true },

    type: {
      type: String,
      enum: ["pv", "direct", "matching", "sponsorMatching"],
      required: true,
      index: true,
    },

    level: { type: Number, default: null },
    percent: { type: Number, default: null },
    amount: { type: Number, required: true },

    // carry-forward fields (used later in matching logic)
    carryForwardLeft: { type: Number, default: 0 },
    carryForwardRight: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//
// ⚡ Helpful indexes for fast lookups
//
EarningRecordSchema.index({ refCode: 1, createdAt: -1 });
EarningRecordSchema.index({ type: 1 });
EarningRecordSchema.index({ orderId: 1 });
EarningRecordSchema.index({ userId: 1, type: 1 });

export default mongoose.model<IEarningRecord>(
  "EarningRecord",
  EarningRecordSchema
);
