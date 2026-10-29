import { Router } from "express";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { requireMembership } from "../../../common/middleware/requireMembership.js";
import { AISettingsController } from "../controllers/ai-settings.controller.js";
import { MembershipRole } from "@prisma/client";
import { requireRole } from "../../../common/middleware/permission.js";
const router = Router();
router.get("/", authenticate, requireMembership, AISettingsController.get);
router.patch("/", authenticate, requireMembership, requireRole([MembershipRole.OWNER, MembershipRole.ADMIN]), AISettingsController.update);
export default router;
//# sourceMappingURL=ai-settings.routes.js.map