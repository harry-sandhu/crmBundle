import express from "express";
import { getAdminSummary } from "../controllers/adminSummaryController";

const router = express.Router();

router.get("/admin/summary", getAdminSummary);

export default router;
