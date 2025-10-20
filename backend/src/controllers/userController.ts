import User from "../models/User";
import Bundle from "../models/Bundle";
import Product from "../models/Product";
import { Request, Response } from "express";
// Get all users (optionally filter by active)
export const getUsers = async (req, res) => {
  const { active } = req.query;
  let query: any = {};
  if (active === "true") query.isActive = true;
  if (active === "false") query.isActive = false;
  const users = await User.find(query).select("-password");
  res.json(users);
};

// Get single user
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Create user
export const createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

// Update user
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Delete user
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// Get all bundles
export const getBundles = async (req, res) => {
  const bundles = await Bundle.find({}).populate("owner", "name email").populate("items.productId", "name price");
  res.json(bundles);
};

// Get all products
export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// Add a new product
export const addProduct = async (req, res) => {
  const prod = new Product(req.body);
  await prod.save();
  res.status(201).json(prod);
};

// Update product
export const updateProduct = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prod) return res.status(404).json({ message: "Product not found" });
  res.json(prod);
};

// Delete product
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};




/** PATCH /api/users/:refCode/active */
export const updateUserActiveStatus = async (req: Request, res: Response) => {
  try {
    const { refCode } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "The 'active' field must be a boolean (true or false).",
      });
    }

    const user = await User.findOneAndUpdate(
      { refCode },
      { active },
      { new: true }
    ).select("name email phone refCode active");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the given referral code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${active ? "activated" : "deactivated"} successfully.`,
      data: user,
    });
  } catch (err: any) {
    console.error("💥 Error updating active status:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating active status.",
      error: err.message,
    });
  }
};

export const initializeActiveField = async (req: Request, res: Response) => {
  try {
    const result = await User.updateMany(
      { active: { $exists: false } }, // only those missing field
      { $set: { active: true } }      // default to active
    );

    return res.status(200).json({
      success: true,
      message: `✅ Active field initialized for ${result.modifiedCount} users.`,
    });
  } catch (err: any) {
    console.error("💥 Error initializing active field:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while initializing active field.",
      error: err.message,
    });
  }
};


export const assignRandomBinaryPositions = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    let updated = 0;
    let skipped = 0;

    for (const parent of users) {
      // Skip root node (no referrer)
      if (!parent.refCode) continue;

      const children = await User.find({ referredBy: parent.refCode });
      if (children.length === 0) continue;

      // Reset all children’s positions first
      for (const child of children) {
        child.position = undefined as any;
        await child.save();
      }

      // Randomly pick up to 2 children for left/right
      const shuffled = children.sort(() => 0.5 - Math.random());
      const left = shuffled[0];
      const right = shuffled[1];

      if (left) {
        left.position = "left";
        await left.save();
        updated++;
      }
      if (right) {
        right.position = "right";
        await right.save();
        updated++;
      }

      // If more than 2 children exist, others remain unassigned
      if (children.length > 2) skipped += children.length - 2;
    }

    return res.json({
      success: true,
      message: `✅ Random binary positions assigned to ${updated} users. Skipped ${skipped} extras.`,
    });
  } catch (error: any) {
    console.error("💥 Error assigning random positions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign random positions",
      error: error.message,
    });
  }
};