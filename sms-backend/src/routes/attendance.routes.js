import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import permit from "../middleware/permission.middleware.js";
import { PERMISSIONS } from "../constants/roles.js";
import { getAttendanceController, getAttendanceReportController, markBulkAttedanceController } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post(
    '/bulk',
    authMiddleware,
    permit(PERMISSIONS.MARK_ATTENDANCE),
    markBulkAttedanceController
);

// FILTER
router.get(
  '/',
  authMiddleware,
  permit(PERMISSIONS.VIEW_ATTENDANCE),
  getAttendanceController
);

// REPORT
router.get(
  '/report/:studentId',
  authMiddleware,
  permit(PERMISSIONS.VIEW_ATTENDANCE),
  getAttendanceReportController
);

// Student self report
router.get(
  '/report/self',
  authMiddleware,
  permit(PERMISSIONS.VIEW_ATTENDANCE),
  getAttendanceReportController
);

export default router;