import { AnalyticsRepository } from "../repositories/analytics.repository.js";

export class AnalyticsService {
  static async getDashboardStats(organizationId: string) {
    const stats = await AnalyticsRepository.getCommentStats(organizationId);

    const replyRate =
      stats.totalReviews === 0
        ? 0
        : Math.round((stats.repliedReviews / stats.totalReviews) * 100);

    return {
      ...stats,

      replyRate,
    };
  }
}
