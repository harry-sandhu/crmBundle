import mongoose, { Schema, Document, Types } from "mongoose";

interface BundleItem {
  productId: Types.ObjectId;
  qty: number;
}

export interface IBundle extends Document {
  owner: Types.ObjectId; // Reference to User
  items: BundleItem[];
  notes?: string;
  status: string; // e.g. "draft", "submitted", "approved"
  createdAt?: Date;
}

const bundleItemSchema = new Schema<BundleItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true }
});

const bundleSchema = new Schema<IBundle>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [bundleItemSchema], required: true },
  notes: { type: String },
  status: { type: String, default: "draft" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBundle>("Bundle", bundleSchema);
