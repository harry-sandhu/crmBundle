import User from "../models/User";
import Bundle from "../models/Bundle";
import Product from "../models/Product";

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

