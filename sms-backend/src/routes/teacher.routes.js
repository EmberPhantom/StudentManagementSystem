import express from 'express';
import { assignClassesController, getTeachersController, getTeacherMeController, updateTeacherController, deleteTeacherController } from "../controllers/teacher.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import permit from "../middleware/permission.middleware.js";
import { PERMISSIONS } from '../constants/roles.js';

const router = express.Router();

router.get(
    '/me',
    authMiddleware,
    getTeacherMeController
);

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

router.put(
    '/:id',
    authMiddleware,
    permit(PERMISSIONS.ASSIGN_TEACHER),
    updateTeacherController
)

router.delete(
    '/:id',
    authMiddleware,
    permit(PERMISSIONS.ASSIGN_TEACHER),
    deleteTeacherController
)

export default router;