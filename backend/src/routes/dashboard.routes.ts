import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  getDashboardStats,
} from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  getDashboardStats
);

export default router;