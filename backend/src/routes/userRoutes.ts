import express from "express";
import { assignRandomBinaryPositions, initializeActiveField, updateUserActiveStatus } from "../controllers/userController";

const router = express.Router();

router.patch("/users/:refCode/active", updateUserActiveStatus);
router.patch("/users/initialize-active", initializeActiveField);
router.post("/random-positions", assignRandomBinaryPositions);
export default router;
