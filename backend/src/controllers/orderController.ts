// // controllers/orderController.ts
// import Order from "../models/Order";

// export async function submitBundle(req, res) {
//   try {
//     const userId = req.user.id;
//     const { items, notes } = req.body as {
//       items: Array<{ productId: string; title: string; qty: number; dp?: number; mrp?: number }>;
//       notes?: string;
//     };

//     if (!items?.length) {
//       return res.status(400).json({ success: false, message: "No items" });
//     }

//     // Compute DP total
//     const totalAmount = items.reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0);
    
//     // Persist order (DP totals)
//     const order = await Order.create({
//       userId,
//       items: items.map((i) => ({
//         productId: i.productId,
//         qty: i.qty,
//         dp: i.dp ?? 0,
//         mrp: i.mrp ?? 0,
//         lineTotal: (i.dp ?? 0) * i.qty,
//       })),
//       totalAmount, // DP sum
//       notes,
//     });

//     return res.json({ success: true, data: { orderId: order._id, totalAmount } });
//   } catch (e) {
//     return res.status(500).json({ success: false, message: "Failed to submit bundle" });
//   }
// }

// backend/src/controllers/orderController.ts
import { Request, Response } from "express";
import Order from "../models/Order";

type SubmitItem = {
  productId: string;
  title: string;
  qty: number;
  dp?: number;
  mrp?: number;
};

export async function submitBundle(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { items, notes } = req.body as { items: SubmitItem[]; notes?: string };

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "No items" });
    }

    const totalAmount = items.reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0);

    const order = await Order.create({
      userId,
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title || "",                 // ensure title is stored
        qty: i.qty,
        dp: i.dp ?? 0,
        mrp: i.mrp ?? 0,
        lineTotal: (i.dp ?? 0) * i.qty,
      })),
      totalAmount,
      notes,
    });

    return res.json({ success: true, data: { orderId: order._id, totalAmount } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to submit bundle";
    return res.status(500).json({ success: false, message: msg });
  }
}
