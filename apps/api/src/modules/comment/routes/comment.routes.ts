import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { requireMembership } from "../../../common/middleware/requireMembership.js";
import { validate } from "../../../common/middleware/validate.middleware.js";

import { CommentController } from "../controllers/comment.controller.js";
import { createCommentSchema } from "../validations/comment.validation.js";


const router = Router();


router.post(
  "/",
  authenticate,
  requireMembership,
  validate(createCommentSchema),
  CommentController.create,
);


router.get(
  "/",
  authenticate,
  requireMembership,
  CommentController.list,
);


router.get(
  "/:id",
  authenticate,
  requireMembership,
  CommentController.findById,
);


export default router;