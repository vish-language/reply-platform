import { Router } from "express";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { requireMembership } from "../../../common/middleware/requireMembership.js";
import webhookRoutes from "./webhook.routes.js";
import { BillingController } from "../controllers/billing.controller.js";

const router = Router();

router.post("/create-order", authenticate,  requireMembership,  BillingController.createOrder);
router.post("/verify-payment", authenticate, BillingController.verifyPayment);
router.use("/webhooks", webhookRoutes);
router.get("/payments", authenticate, BillingController.getPaymentHistory);
export default router;
