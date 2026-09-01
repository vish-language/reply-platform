import { Worker } from "bullmq";
import { redis } from "../../common/redis/redis.client.js";
import { UsageRepository } from "../../modules/subscription/repositories/usage.repository.js";
import { CommentRepository } from "../../modules/comment/repositories/comment.repository.js";
import { AISettingsRepository } from "../../modules/ai/repositories/ai-settings.repository.js";
import { ReplyRepository } from "../../modules/reply/repositories/reply.repository.js";
import { googleReviewProvider } from "../../modules/google-reviews/providers/google-review.container.js";
import { SubscriptionLimitService } from "../../modules/subscription/services/subscription-limit.service.js";
import { aiService } from "../../modules/ai/services/ai.container.js";

type AIReplyJob = {
  commentId: string;
};

export const aiReplyWorker = new Worker<AIReplyJob>(
  "ai-reply",
  async (job) => {
    const { commentId } = job.data;

    const comment = await CommentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const aiSettings = await AISettingsRepository.findByOrganizationId(
      comment.organizationId,
    );

    if (!aiSettings || !aiSettings.autoReplyEnabled) {
      await CommentRepository.updateStatus(comment.id, "FAILED");

      return;
    }

    try {
      console.log("STEP 1: Checking existing replies");

      const existingReplies = await ReplyRepository.findByCommentId(comment.id);

      if (existingReplies.length > 0) {
        console.log(`Reply already exists for comment ${comment.id}`);

        await CommentRepository.updateStatus(comment.id, "REPLIED");

        return;
      }

      console.log("STEP 2: Preparing review context");

      const reviewContext = [
        comment.rating !== null && comment.rating !== undefined
          ? `Rating: ${comment.rating}/5`
          : null,

        `Review: ${comment.content}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      console.log("CHECKING SUBSCRIPTION LIMIT");

      const limit = await SubscriptionLimitService.canGenerateReply(
        comment.organizationId,
      );

      console.log("SUBSCRIPTION LIMIT:", limit);

      if (!limit.allowed) {
        await CommentRepository.updateStatus(comment.id, "FAILED");

        throw new Error(`AI reply limit reached ${limit.used}/${limit.limit}`);
      }

      console.log("STEP 3: Generating AI reply");

      const generatedReply = await aiService.generateReply({
        organizationId: comment.organizationId,
        comment: reviewContext,
      });

      console.log("STEP 4: AI reply generated");

      const reply = await ReplyRepository.create({
        commentId: comment.id,

        content: generatedReply.content,

        generatedBy: generatedReply.provider,

        modelName: generatedReply.model,
      });

      console.log("STEP 5: Reply saved", reply.id);

      if (comment.googleReviewName) {
        const subscription = await SubscriptionLimitService.canGenerateReply(
          comment.organizationId,
        );

        if (!subscription.allowed) {
          await CommentRepository.updateStatus(comment.id, "FAILED");

          throw new Error(
            `AI reply limit reached ${subscription.used}/${subscription.limit}`,
          );
        }

        const generatedReply = await aiService.generateReply({
          organizationId: comment.organizationId,
          comment: reviewContext,
        });

        console.log("STEP 4: AI reply generated");

        const reply = await ReplyRepository.create({
          commentId: comment.id,

          content: generatedReply.content,

          generatedBy: generatedReply.provider,

          modelName: generatedReply.model,
        });

        console.log("STEP 5: Reply saved", reply.id);

        if (comment.googleReviewName) {
          // Atomically claim the usage slot BEFORE publishing.
          await UsageRepository.incrementAIReplies(
            comment.organizationId,
            subscription.limit,
          );

          await googleReviewProvider.publishReply({
            googleReviewName: comment.googleReviewName,
            replyContent: reply.content,
          });

          await ReplyRepository.updateStatus(reply.id, "PUBLISHED");

          console.log("Usage updated: AI reply count increased");
        }

        console.log("Usage updated: AI reply count increased");
      }

      await CommentRepository.updateStatus(comment.id, "REPLIED");

      console.log(`AI reply generated for comment ${comment.id}`);
    } catch (error) {
      console.error("WORKER ERROR:", error);

      await CommentRepository.updateStatus(comment.id, "FAILED");

      throw error;
    }
  },
  {
    connection: redis,

    concurrency: 5,
  },
);

aiReplyWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

aiReplyWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed attempt ${job?.attemptsMade}/${job?.opts.attempts}`,
  );

  console.error(error);
});

process.on("SIGTERM", async () => {
  await aiReplyWorker.close();

  process.exit(0);
});
