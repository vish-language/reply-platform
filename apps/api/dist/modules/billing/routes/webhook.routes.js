import { Router } from "express";
import { BillingController } from "../controllers/billing.controller.js";
const router = Router();
router.post("/razorpay", BillingController.handleWebhook);
export default router;
//# sourceMappingURL=webhook.routes.js.map