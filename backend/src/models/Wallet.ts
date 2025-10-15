// models/Wallet.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: string; // or Types.ObjectId
  type: "credit" | "debit";
  amount: number; // positive value; use type for sign
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

WalletSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IWallet>("Wallet", WalletSchema);
