import express from "express";
import { initializeActiveField, updateUserActiveStatus } from "../controllers/userController";

const router = express.Router();

router.patch("/users/:refCode/active", updateUserActiveStatus);
router.patch("/users/initialize-active", initializeActiveField);
export default router;
