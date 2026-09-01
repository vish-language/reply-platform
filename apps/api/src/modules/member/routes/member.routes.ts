import { Router } from "express";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { MembershipRole } from "@prisma/client";
import { authorize } from "../../../common/middleware/authorize.js";
import { MemberController } from "../controllers/member.controller.js";
import {
  addMemberSchema,
  updateMemberSchema,
} from "../validations/member.validation.js";
import { validate } from "../../../common/middleware/validate.middleware.js";
import { requireMembership } from "../../../common/middleware/requireMembership.js";

const router = Router();

// Add member — OWNER only
router.post(
  "/",
  authenticate,
  requireMembership,
  authorize(MembershipRole.OWNER),
  validate(addMemberSchema),
  MemberController.add,
);

// List members — any active member
router.get("/", authenticate, requireMembership, MemberController.list);

// Update member — OWNER only
router.patch(
  "/:membershipId",
  authenticate,
  requireMembership,
  authorize(MembershipRole.OWNER),
  validate(updateMemberSchema),
  MemberController.update,
);

// Remove member — OWNER only
router.delete(
  "/:membershipId",
  authenticate,
  requireMembership,
  authorize(MembershipRole.OWNER),
  MemberController.remove,
);

export default router;
