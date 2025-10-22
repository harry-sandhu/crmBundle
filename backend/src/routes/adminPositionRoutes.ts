import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { updateUserPosition } from "../controllers/adminPositionController";

const router = Router();

// ✅ This route matches your frontend call
router.patch("/users/:refCode/position", verifyToken, updateUserPosition);

export default router;
