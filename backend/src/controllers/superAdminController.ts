import User from "../models/User";
import Product from "../models/Product";
import Bundle from "../models/Bundle";

// GET /Superadmin/users?active=true|false
export const getUsers = async (req, res) => {
  const { active } = req.query; // "true" | "false" | undefined
  const query: any = {};
  if (active === "true") query.isActive = true;
  if (active === "false") query.isActive = false;

  const users = await User.find(query).select("-password");
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const found = await User.findById(req.params.id);
  if (!found) return res.status(404).json({ message: "User not found" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// OPTIONAL: products + bundles if needed on superadmin
export const getProducts = async (_req, res) => {
  const prods = await Product.find({});
  res.json(prods);
};
export const addProduct = async (req, res) => {
  const prod = new Product(req.body);
  await prod.save();
  res.status(201).json(prod);
};
export const updateProduct = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prod) return res.status(404).json({ message: "Product not found" });
  res.json(prod);
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

export const getBundles = async (_req, res) => {
  const bundles = await Bundle.find({})
    .populate("owner", "name email")
    .populate("items.productId", "name price");
  res.json(bundles);
};
