import { Request, Response } from "express";
import User from "../models/User";

interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  active?: boolean;
  children: TreeNode[];
}

/**
 * Recursive depth-limited tree builder
 */
async function buildTree(refCode: string, depth = Infinity): Promise<TreeNode | null> {
  if (depth <= 0) return null;

  // 🟢 include active field in query projection
  const user = await User.findOne(
    { refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, active: 1 }
  ).lean();
  if (!user) return null;

  // 🟢 include active in children too
  const children = await User.find(
    { referredBy: refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, active: 1 }
  ).lean();

  const childTrees: TreeNode[] = [];

  for (const child of children) {
    const subtree = await buildTree(child.refCode, depth - 1);
    if (subtree) childTrees.push(subtree);
  }

  return {
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    refCode: user.refCode,
    active: user.active ?? true, // 🟢 ensure default true
    children: childTrees,
  };
}

/**
 * Bulk builder – single query, ultra fast for large trees
 */
async function buildTreeBulk(refCode: string): Promise<TreeNode | null> {
  const allUsers = await User.find(
    { $or: [{ refCode }, { ancestors: refCode }] },
    { name: 1, email: 1, phone: 1, refCode: 1, referredBy: 1, active: 1 } // 🟢 include active
  ).lean();

  if (!allUsers.length) return null;

  const lookup = new Map<string, TreeNode>();
  for (const user of allUsers) {
    lookup.set(user.refCode, {
      name: user.name,
      email: user.email,
      phone: user.phone,
      refCode: user.refCode,
      active: user.active ?? true, // 🟢 default true
      children: [],
    });
  }

  let root: TreeNode | null = null;

  for (const user of allUsers) {
    if (user.refCode === refCode) {
      root = lookup.get(user.refCode)!;
    } else if (user.referredBy) {
      const parent = lookup.get(user.referredBy);
      if (parent) parent.children.push(lookup.get(user.refCode)!);
    }
  }

  return root;
}

/**
 * Controller: GET /api/tree/:refCode
 * Supports ?depth= and ?mode=bulk
 */
export const getReferralTree = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    const { depth, mode } = req.query;

    if (!refCode)
      return res.status(400).json({ success: false, message: "Referral code is required" });

    const total = await User.countDocuments({ ancestors: refCode });

    let tree: TreeNode | null = null;

    if (mode === "bulk" || total > 1000) {
      console.log("⚡ Using bulk tree builder");
      tree = await buildTreeBulk(refCode);
    } else {
      console.log("🌱 Using recursive tree builder");
      const depthLimit = depth ? parseInt(depth as string, 10) : Infinity;
      tree = await buildTree(refCode, depthLimit);
    }

    if (!tree)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "Referral tree fetched successfully",
      totalUsers: total,
      mode: mode === "bulk" || total > 1000 ? "bulk" : "recursive",
      data: tree,
    });
  } catch (error: any) {
    console.error("💥 Error fetching referral tree:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral tree",
      error: error.message,
    });
  }
};
