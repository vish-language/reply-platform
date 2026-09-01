import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { requireMembership } from "../../../common/middleware/requireMembership.js";
import { validate } from "../../../common/middleware/validate.middleware.js";

import { ReplyController } from "../controllers/reply.controller.js";
import { createReplySchema } from "../validations/reply.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireMembership,
  validate(createReplySchema),
  ReplyController.create,
);


router.get(
  "/comment/:commentId",
  authenticate,
  requireMembership,
  ReplyController.findByComment,
);

export default router;
