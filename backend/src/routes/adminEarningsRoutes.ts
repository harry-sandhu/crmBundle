import express from "express";
import { repairOldEarnings } from "../controllers/adminEarningsRepairController";
import { getUserFullDetails, getUsersEarningsSummary } from "../controllers/adminEarningController";

const router = express.Router();

// Only for admins or one-time fix (you can disable after running once)
router.post("/repair", repairOldEarnings);
router.get("/users-summary", getUsersEarningsSummary);
router.get("/user/:refCode/details", getUserFullDetails);

export default router;
