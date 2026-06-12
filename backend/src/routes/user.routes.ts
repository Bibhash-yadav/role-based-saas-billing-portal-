import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

/*
  OWNER
  BILLING_ADMIN
*/

router.get(
  "/",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  getUserById
);

/*
  UPDATE ROLE
  OWNER ONLY
*/

router.put(
  "/:id",
  authenticate,
  authorize("OWNER"),
  updateUser
);

/*
  DELETE USER
  OWNER ONLY
*/

router.delete(
  "/:id",
  authenticate,
  authorize("OWNER"),
  deleteUser
);

export default router;