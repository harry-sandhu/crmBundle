import { Router } from "express";
import { isAdmin } from "../middleware/authMiddleware"; // must validate Bearer token + role
import * as superAdmin from "../controllers/superAdminController";

const router = Router();

// Protect all superadmin routes
router.use(isAdmin);

// Users CRUD
router.get("/users", superAdmin.getUsers);
router.get("/users/:id", superAdmin.getUserById);
router.post("/users", superAdmin.createUser);
router.put("/users/:id", superAdmin.updateUser);
router.delete("/users/:id", superAdmin.deleteUser);

export default router;
