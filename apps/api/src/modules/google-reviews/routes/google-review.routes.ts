import { Router } from "express";

import { GoogleReviewController } from "../controllers/google-review.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

import { requireMembership } from "../../../common/middleware/requireMembership.js";

import { requireRole } from "../../../common/middleware/permission.js";

import { MembershipRole } from "@prisma/client";

import { verifyGoogleWebhook } from "../../../common/middleware/verifyGoogleWebhook.js";

import { authorize } from "../../../common/middleware/authorize.js";
import { GoogleReviewSyncController } from "../controllers/google-review-sync.controller.js";

const router = Router();

router.post(
  "/connect",
  authenticate,
  requireMembership,
  requireRole([MembershipRole.OWNER, MembershipRole.ADMIN]),
  GoogleReviewController.connect,
);

router.get(
  "/connection",
  authenticate,
  requireMembership,
  requireRole([MembershipRole.OWNER, MembershipRole.ADMIN]),
  GoogleReviewController.getConnection,
);

router.post("/webhook", verifyGoogleWebhook, GoogleReviewController.webhook);
router.post("/sync", GoogleReviewSyncController.sync);

router.patch(
  "/disconnect",
  authenticate,
  requireMembership,
  requireRole([MembershipRole.OWNER, MembershipRole.ADMIN]),
  GoogleReviewController.disconnect,
);

router.post(
  "/test-webhook",
  authenticate,
  requireMembership,
  requireRole([MembershipRole.OWNER, MembershipRole.ADMIN]),
  GoogleReviewController.testWebhook,
);
export default router;
