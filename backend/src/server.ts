//Backend/server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import adminRoutes from "./routes/AdminRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running successfully (TypeScript Edition)!");
});

// app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
