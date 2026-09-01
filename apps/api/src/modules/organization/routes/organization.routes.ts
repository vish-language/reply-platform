import {Router} from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { updateOrganizationSchema } from "../validations/organization.validation.js";
import { validate } from "../../../common/middleware/validate.middleware.js";
import { authorize } from "../../../common/middleware/authorize.js";
import { MembershipRole } from "@prisma/client";

const router = Router();

router.get(
    "/current",
    authenticate,
    OrganizationController.current
);
router.patch(
    "/current",
    authenticate,
    authorize(MembershipRole.OWNER),
    validate(updateOrganizationSchema),
    OrganizationController.update
);

export default router;