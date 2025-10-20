import express from "express";
import { getReferralTree, getBinaryTree } from "../controllers/treeController";

const router = express.Router();

router.get("/tree/:refCode", getReferralTree);
router.get("/binary-tree/:refCode", getBinaryTree);

export default router;
