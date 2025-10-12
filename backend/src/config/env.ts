import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("========================================");
console.log("🌿 Environment loaded successfully");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Not Loaded");
console.log("========================================\n");

export {};
