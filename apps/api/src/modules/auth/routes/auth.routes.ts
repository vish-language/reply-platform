import { Router } from "express";
import { ApiError } from "../../../common/errors/ApiError.js";
import { validate } from "../../../common/middleware/validate.middleware.js";
import { registerSchema } from "../validations/register.validation.js";
import { AuthController } from "../controllers/auth.controller.js";
import { loginSchema } from "../validations/login.validation.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { acceptInvitationSchema } from "../validations/auth.validation.js";
const authRouter = Router();

authRouter.get("/health", (req, res) => {
  throw new ApiError(400, "This is the ApiError testing");
});
authRouter.post("/register", validate(registerSchema), AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);
authRouter.get("/me", authenticate, AuthController.me);
authRouter.post(
  "/accept-invitation",
  validate(acceptInvitationSchema),
  AuthController.acceptInvitation,
);

export default authRouter;
