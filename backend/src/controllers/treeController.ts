import { Request, Response } from "express";
import User from "../models/User";

interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  position?: "left" | "right" | null;
  active?: boolean;
  children: TreeNode[];
}

/**
 * 🌱 Recursive builder (for smaller trees)
 */
async function buildTree(refCode: string, depth = Infinity): Promise<TreeNode | null> {
  if (depth <= 0) return null;

  const user = await User.findOne(
    { refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, active: 1, position: 1 }
  ).lean();

  if (!user) return null;

  const children = await User.find(
    { referredBy: refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, active: 1, position: 1 }
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
    position: user.position || null, // ✅ now included
    active: user.active ?? true,
    children: childTrees,
  };
}

/**
 * ⚡ Bulk builder (for large trees)
 */
async function buildTreeBulk(refCode: string): Promise<TreeNode | null> {
  const allUsers = await User.find(
    { $or: [{ refCode }, { ancestors: refCode }] },
    {
      name: 1,
      email: 1,
      phone: 1,
      refCode: 1,
      referredBy: 1,
      position: 1, // ✅ make sure we fetch position
      active: 1,
    }
  ).lean();

  if (!allUsers.length) return null;

  const lookup = new Map<string, TreeNode>();

  for (const u of allUsers) {
    lookup.set(u.refCode, {
      name: u.name,
      email: u.email,
      phone: u.phone || null,
      refCode: u.refCode,
      position: u.position || null, // ✅ store position
      active: u.active ?? true,
      children: [],
    });
  }

  let root: TreeNode | null = null;

  for (const u of allUsers) {
    if (u.refCode === refCode) {
      root = lookup.get(u.refCode)!;
    } else if (u.referredBy) {
      const parent = lookup.get(u.referredBy);
      if (parent) parent.children.push(lookup.get(u.refCode)!);
    }
  }

  return root;
}

/**
 * 🟢 GET /api/tree/:refCode
 */
export const getReferralTree = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    const { depth, mode } = req.query;

    if (!refCode) {
      return res.status(400).json({
        success: false,
        message: "Referral code is required",
      });
    }

    const total = await User.countDocuments({ ancestors: refCode });
    const depthLimit = depth ? parseInt(depth as string, 10) : Infinity;

    let tree: TreeNode | null = null;

    if (mode === "bulk" || total > 1000) {
      console.log("⚡ Using bulk tree builder");
      tree = await buildTreeBulk(refCode);
    } else {
      console.log("🌱 Using recursive tree builder");
      tree = await buildTree(refCode, depthLimit);
    }

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Referral tree fetched successfully",
      totalUsers: total,
      data: tree,
    });
  } catch (error: any) {
    console.error("💥 Error fetching referral tree:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral tree",
      error: error.message,
    });
  }
};


/* =====================================================
   🟣 BINARY TREE HANDLING SECTION
===================================================== */
interface BinaryNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  position?: "left" | "right";
  active?: boolean;
  leftChild?: BinaryNode | null;
  rightChild?: BinaryNode | null;
}

/**
 * ⚖️ Recursive binary tree builder
 */
async function buildBinaryTree(refCode: string, depth = Infinity): Promise<BinaryNode | null> {
  if (depth <= 0) return null;

  const user = await User.findOne(
    { refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, position: 1, active: 1 }
  ).lean();

  if (!user) return null;

  const children = await User.find(
    { referredBy: refCode },
    { name: 1, email: 1, phone: 1, refCode: 1, position: 1, active: 1 }
  ).lean();

  const left = children.find((c) => c.position === "left") || null;
  const right = children.find((c) => c.position === "right") || null;

  return {
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    refCode: user.refCode,
    position: user.position,
    active: user.active ?? true,
    leftChild: left ? await buildBinaryTree(left.refCode, depth - 1) : null,
    rightChild: right ? await buildBinaryTree(right.refCode, depth - 1) : null,
  };
}

/**
 * 🟪 GET /api/binary-tree/:refCode
 */
export const getBinaryTree = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    const { depth } = req.query;

    if (!refCode)
      return res.status(400).json({ success: false, message: "Referral code is required" });

    const depthLimit = depth ? parseInt(depth as string, 10) : Infinity;
    const tree = await buildBinaryTree(refCode, depthLimit);

    if (!tree)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Binary tree fetched successfully",
      data: tree,
    });
  } catch (error: any) {
    console.error("💥 Error fetching binary tree:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch binary tree",
      error: error.message,
    });
  }
};
