// // backend/src/middlewares/authMiddleware.ts
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// export interface AuthRequest extends Request {
//   user?: { userId: string; role: "user" | "admin" };
// }

// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const header = req.headers.authorization;
//     if (!header || !header.startsWith("Bearer "))
//       return res.status(401).json({ success: false, message: "No token provided" });

//     const token = header.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: "user" | "admin" };

//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("JWT verify error:", err);
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };

// export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//   if (!req.user || req.user.role !== "admin")
//     return res.status(403).json({ success: false, message: "Admin access only" });
//   next();
// };


// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// Verify JWT and attach { id }
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; userId?: string };
    const id = decoded.id || decoded.userId;

    if (!id) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    req.user = { id };
    return next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Optional: attach refCode for routes that need it
export const attachRefCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.user.refCode) return next();

    const me = await User.findById(req.user.id).select("refCode").lean();
    if (!me) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user.refCode = me.refCode;
    return next();
  } catch {
    return res.status(500).json({ success: false, message: "Failed to attach refCode" });
  }
};

// No role guard anymore
