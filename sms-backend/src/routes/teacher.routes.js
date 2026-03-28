import express from 'express';
import { assignClassesController, getTeachersController } from "../controllers/teacher.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import permit from "../middleware/permission.middleware.js";
import { PERMISSIONS } from '../constants/roles.js';

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    permit(PERMISSIONS.ASSIGN_TEACHER),
    getTeachersController
);

router.put(
    '/assign/:id',
    authMiddleware,
    permit(PERMISSIONS.ASSIGN_TEACHER),
    assignClassesController
)

export default router;