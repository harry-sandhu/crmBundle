// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export interface AuthRequest extends Request {
  user?: { userId: string; role: "user" | "admin" };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "No token provided" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: "user" | "admin" };

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Admin access only" });
  next();
};
