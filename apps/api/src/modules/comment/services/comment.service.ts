import { CommentRepository } from "../repositories/comment.repository.js";

import { aiReplyQueue } from "../../../jobs/queues/ai-reply.queue.js";

import { AISettingsRepository } from "../../ai/repositories/ai-settings.repository.js";

import { SubscriptionLimitService } from "../../subscription/services/subscription-limit.service.js";

type CreateCommentData = {
  externalCommentId?: string;

  googleReviewName?: string;

  authorName: string;

  authorEmail?: string;

  content: string;

  rating?: number;
};

export class CommentService {
  static async create(organizationId: string, data: CreateCommentData) {
    console.log("COMMENT SERVICE CREATE CALLED", organizationId, data);
    if (data.externalCommentId) {
      const existing = await CommentRepository.findByExternalId(
        organizationId,
        data.externalCommentId,
      );

      if (existing) {
        return {
          ...existing,

          alreadyProcessed: true,
        };
      }
    }

    const reviewLimit =
      await SubscriptionLimitService.canProcessReview(organizationId);

    if (!reviewLimit.allowed) {
      throw new Error(
        reviewLimit.reason ??
          `Review limit reached ${reviewLimit.used}/${reviewLimit.limit}`,
      );
    }
    console.log("BEFORE COMMENT DATABASE CREATE");
    const comment = await CommentRepository.create({
      organizationId,

      externalCommentId: data.externalCommentId,

      googleReviewName: data.googleReviewName,

      authorName: data.authorName,

      authorEmail: data.authorEmail,

      content: data.content,

      rating: data.rating,
    });
    console.log("AFTER COMMENT DATABASE CREATE", comment);

    const aiSettings =
      await AISettingsRepository.findByOrganizationId(organizationId);
    console.log("AI SETTINGS FOUND:", aiSettings);
    /**
     * Automatic AI Reply Trigger
     *
     * If organization enabled auto reply:
     *
     * Comment
     *    |
     *    ↓
     * PROCESSING
     *    |
     *    ↓
     * BullMQ Queue
     *    |
     *    ↓
     * AI Worker
     *
     */

    if (aiSettings && aiSettings.autoReplyEnabled) {
      await CommentRepository.updateStatus(comment.id, "PROCESSING");
      console.log("ADDING AI REPLY JOB:", comment.id);
      const job = await aiReplyQueue.add(
        "generate-reply",

        {
          commentId: comment.id,
        },
      );

      console.log("AI JOB CREATED:", job.id);
    }

    return {
      id: comment.id,

      organizationId: comment.organizationId,

      externalCommentId: comment.externalCommentId,

      googleReviewName: comment.googleReviewName,

      authorName: comment.authorName,

      authorEmail: comment.authorEmail,

      content: comment.content,

      rating: comment.rating,

      status: await this.getCurrentStatus(comment.id),

      createdAt: comment.createdAt,

      alreadyProcessed: false,
    };
  }

  static async findAll(organizationId: string) {
    const comments =
      await CommentRepository.findAllByOrganization(organizationId);

    return comments.map((comment) => ({
      id: comment.id,

      organizationId: comment.organizationId,

      authorName: comment.authorName,

      authorEmail: comment.authorEmail,

      content: comment.content,

      rating: comment.rating,

      status: comment.status,

      reply: comment.replies?.[0]
        ? {
            id: comment.replies[0].id,

            content: comment.replies[0].content,

            status: comment.replies[0].status,

            generatedBy: comment.replies[0].generatedBy,

            modelName: comment.replies[0].modelName,
          }
        : null,

      createdAt: comment.createdAt,
    }));
  }

  static async getCurrentStatus(commentId: string) {
    const comment = await CommentRepository.findById(commentId);

    return comment?.status ?? "FAILED";
  }

  static async findById(id: string) {
    const comment = await CommentRepository.findByIdWithReplies(id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    return {
      id: comment.id,

      externalCommentId: comment.externalCommentId,

      googleReviewName: comment.googleReviewName,

      authorName: comment.authorName,

      authorEmail: comment.authorEmail,

      content: comment.content,

      rating: comment.rating,

      status: comment.status,

      createdAt: comment.createdAt,

      replies: comment.replies.map((reply) => ({
        id: reply.id,

        content: reply.content,

        status: reply.status,

        generatedBy: reply.generatedBy,

        modelName: reply.modelName,

        createdAt: reply.createdAt,
      })),
    };
  }

  static async findAllWithReplies(organizationId: string) {
    const comments = await CommentRepository.findAllWithReplies(organizationId);

    return comments.map((comment) => ({
      id: comment.id,

      authorName: comment.authorName,

      authorEmail: comment.authorEmail,

      content: comment.content,

      rating: comment.rating,

      status: comment.status,

      createdAt: comment.createdAt,

      reply: comment.replies[0]
        ? {
            id: comment.replies[0].id,

            content: comment.replies[0].content,

            status: comment.replies[0].status,
          }
        : null,
    }));
  }

  static async findPaginated(
    organizationId: string,

    query: {
      page?: number;

      limit?: number;

      status?: string;

      rating?: number;

      search?: string;
    },
  ) {
    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 20;

    const result = await CommentRepository.findAllPaginated(
      organizationId,

      {
        page,

        limit,

        status: query.status,

        rating: query.rating,

        search: query.search,
      },
    );

    return {
      comments: result.comments.map((comment) => ({
        id: comment.id,

        authorName: comment.authorName,

        authorEmail: comment.authorEmail,

        content: comment.content,

        rating: comment.rating,

        status: comment.status,

        reply: comment.replies[0]
          ? {
              id: comment.replies[0].id,

              content: comment.replies[0].content,

              status: comment.replies[0].status,
            }
          : null,

        createdAt: comment.createdAt,
      })),

      pagination: {
        page,

        limit,

        total: result.total,

        pages: Math.ceil(result.total / limit),
      },
    };
  }
}
