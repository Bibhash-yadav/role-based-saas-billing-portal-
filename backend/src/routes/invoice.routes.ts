import { Router } from "express";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getInvoices
);

router.get(
  "/:id",
  authenticate,
  getInvoiceById
);

router.post(
  "/",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  createInvoice
);

router.put(
  "/:id",
  authenticate,
  authorize(
    "OWNER",
    "BILLING_ADMIN"
  ),
  updateInvoice
);

router.delete(
  "/:id",
  authenticate,
  authorize("OWNER"),
  deleteInvoice
);

export default router;