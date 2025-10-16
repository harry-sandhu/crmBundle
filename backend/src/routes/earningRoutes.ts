import express from "express";
import {
  getEarningsDashboard,
  getEarningsDetails,
} from "../controllers/earningController";

const router = express.Router();

router.get("/dashboard/:refCode", getEarningsDashboard);
router.get("/details/:refCode", getEarningsDetails);

export default router;
