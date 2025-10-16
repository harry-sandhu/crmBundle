import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Create a new product
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all products (optional)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
