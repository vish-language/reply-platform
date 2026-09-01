import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";

import { requireMembership } from "../../../common/middleware/requireMembership.js";

import { AnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", authenticate, requireMembership, AnalyticsController.dashboard);

export default router;
