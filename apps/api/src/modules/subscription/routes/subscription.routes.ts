import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";

import { requireMembership } from "../../../common/middleware/requireMembership.js";

import { SubscriptionController } from "../controllers/subscription.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireMembership,
  SubscriptionController.current,
);
router.get("/plans", SubscriptionController.getPlans);
router.post(
  "/upgrade",
  authenticate,
  requireMembership,
  SubscriptionController.upgradePlan,
);
router.post(
  "/cancel",
  authenticate,
  requireMembership,
  SubscriptionController.cancel,
);
router.post(
  "/reactivate",
  authenticate,
  requireMembership,
  SubscriptionController.reactivate,
);
export default router;
