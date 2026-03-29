import express from "express";
import { register, registerAdmin, login, logout, me } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import permit from "../middleware/permission.middleware.js"; 
import { PERMISSIONS } from "../constants/roles.js";

const router = express.Router();

router.post('/register', register);
router.post('/register/admin', authMiddleware, permit(PERMISSIONS.ASSIGN_TEACHER), registerAdmin);
router.post('/login', login);
router.post('/logout', logout);
router.get("/me", authMiddleware, me);

export default router;