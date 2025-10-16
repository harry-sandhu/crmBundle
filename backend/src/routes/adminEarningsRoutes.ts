import express from "express";
import { repairOldEarnings } from "../controllers/adminEarningsRepairController";

const router = express.Router();

// Only for admins or one-time fix (you can disable after running once)
router.post("/repair", repairOldEarnings);

export default router;
