// backend/src/routes/adminFixOrdersRoutes.ts
import express from "express";
import { repairOrderPV } from "../controllers/adminFixOrderController";

const router = express.Router();
router.post("/fix-orders-pv", repairOrderPV);

export default router;
