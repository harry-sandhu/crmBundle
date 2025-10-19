// backend/routes/treeRoutes.ts
import express from "express";
import { getReferralTree } from "../controllers/treeController";

const router = express.Router();

// GET /api/tree/:refCode → returns the entire referral tree
router.get("/tree/:refCode", getReferralTree);


export default router;
