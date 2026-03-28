import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import permit from "../middleware/permission.middleware.js";
import { PERMISSIONS } from "../constants/roles.js";
import { createStudentController, deleteStudentController, getStudentController, updateStudentController } from "../controllers/student.controller.js";

const router = express.Router();

// Create Student -> Admin + Teacher
router.post(
    '/',
    authMiddleware,
    permit(PERMISSIONS.CREATE_STUDENT),
    createStudentController
);

// View Students -> ALL
router.get(
    '/',
    authMiddleware,
    permit(PERMISSIONS.VIEW_STUDENT),
    getStudentController
);

router.put(
    '/:id',
    authMiddleware,
    permit(PERMISSIONS.UPDATE_STUDENT),
    updateStudentController
)

// Delete Student -> Admin
router.delete(
    '/:id',
    authMiddleware,
    permit(PERMISSIONS.DELETE_STUDENT),
    deleteStudentController
)

export default router;