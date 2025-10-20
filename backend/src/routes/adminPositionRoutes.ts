import express from "express";
import { assignPosition } from "../controllers/adminPositionController";
// import { verifyAdmin } from "../middleware/auth"; // optional later

const router = express.Router();

// router.post("/assign-position", verifyAdmin, assignPosition);
router.post("/assign-position", assignPosition);

export default router;
