// backend/src/types/index.d.ts
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: "user" | "admin" };
    }
  }
}
