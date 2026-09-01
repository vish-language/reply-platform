import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";

import { requireMembership } from "../../../common/middleware/requireMembership.js";

import { validate } from "../../../common/middleware/validate.middleware.js";

import {generateReplySchema} from "../validation/ai.validation.js"

import { AIController } from "../controllers/ai.controller.js";


const router = Router();


router.post(
    "/generate",
    authenticate,
    requireMembership,
    validate(generateReplySchema),
    AIController.generate
);


export default router;