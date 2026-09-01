import { Router } from "express";

import { InvitationController } from "../controllers/invitation.controller.js";

const router = Router();

router.get(
  "/:token",
  InvitationController.getInvitation,
);

export default router;