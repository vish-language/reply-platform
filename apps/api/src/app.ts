import express from "express";
import authRouter from "./modules/auth/routes/auth.routes.js";
import organizationRoutes from "./modules/organization/routes/organization.routes.js";
import memberRoutes from "./modules/member/routes/member.routes.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import aiSettingsRoutes from "./modules/ai-settings/routes/ai-settings.routes.js";
import commentRoutes from "./modules/comment/routes/comment.routes.js";
import replyRoutes from "./modules/reply/routes/reply.routes.js";
import googleReviewRoutes from "./modules/google-reviews/routes/google-review.routes.js";
import analyticsRoutes from "./modules/analytics/routes/analytics.routes.js";
import subscriptionRoutes from "./modules/subscription/routes/subscription.routes.js";
import billingRoutes from "./modules/billing/routes/billing.routes.js";
import aiRouter from "./modules/ai/routes/ai.routes.js";
import invitationRoutes from "./modules/member/routes/invitation.routes.js";
import { env } from "./config/env.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
); // Parse incoming JSON requests (middleware)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); //
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", organizationRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/ai-settings", aiSettingsRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/replies", replyRoutes);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/google-reviews", googleReviewRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/invitations", invitationRoutes);
app.use(errorMiddleware); // Error handling middleware . Its alwasys the last middleware in the stack

export default app;
