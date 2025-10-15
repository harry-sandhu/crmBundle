import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { submitBundle } from "../controllers/orderController";

const router = Router();
router.post("/orders/submit", verifyToken, submitBundle);
export default router;
