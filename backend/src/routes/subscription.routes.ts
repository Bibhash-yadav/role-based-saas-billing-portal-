import { Router } from "express";

import {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getSubscriptions
);

router.post(
  "/",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  createSubscription
);

router.put(
  "/:id",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  updateSubscription
);

router.delete(
  "/:id",
  authenticate,
  authorize("OWNER"),
  deleteSubscription
);

export default router;