import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  productId: Types.ObjectId | string;
  title: string;
  qty: number;
  dp: number;
  mrp: number;
  lineTotal: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId | string;
  refCode: string;                // 🧩 NEW — buyer’s unique referral code
  items: IOrderItem[];
  totalAmount: number;
  totalPV?: number;
  status?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.Mixed, required: true },
  title: { type: String, default: "" },
  qty: { type: Number, required: true },
  dp: { type: Number, required: true },
  mrp: { type: Number, required: true },
  lineTotal: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    refCode: { type: String, required: true, index: true }, // ✅ added field
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "submitted" },
    totalPV: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

// ⚡ Helpful indexes
OrderSchema.index({ refCode: 1 });
OrderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
