import { prisma } from "../../../database/prisma.js";

export class AnalyticsRepository {
  static async getCommentStats(organizationId: string) {
    const [
      totalReviews,
      repliedReviews,
      processingReviews,
      failedReviews,
      ratingStats,
    ] = await Promise.all([
      prisma.comment.count({
        where: {
          organizationId,
        },
      }),

      prisma.comment.count({
        where: {
          organizationId,
          status: "REPLIED",
        },
      }),

      prisma.comment.count({
        where: {
          organizationId,
          status: "PROCESSING",
        },
      }),

      prisma.comment.count({
        where: {
          organizationId,
          status: "FAILED",
        },
      }),

      prisma.comment.aggregate({
        where: {
          organizationId,
        },

        _avg: {
          rating: true,
        },
      }),
    ]);

    return {
      totalReviews,

      repliedReviews,

      processingReviews,

      failedReviews,

      averageRating: ratingStats._avg.rating ?? 0,
    };
  }
}
