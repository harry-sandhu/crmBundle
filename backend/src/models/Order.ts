// models/Order.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: string; // or Types.ObjectId in your app
  items: Array<{
    productId: string;
    qty: number;
    mrp?: number;
    dp?: number;
    lineTotal?: number;
  }>;
  totalAmount: number; // DP total or gross, pick one and keep consistent
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: String,
        qty: Number,
        mrp: Number,
        dp: Number,
        lineTotal: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
