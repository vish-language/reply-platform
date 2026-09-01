import { SubscriptionRepository } from "../repositories/subscription.repository.js";

export class SubscriptionLimitService {
  static async canGenerateReply(organizationId: string) {
    console.log("LIMIT CHECK ORGANIZATION:", organizationId);

    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    console.log("FOUND SUBSCRIPTION:", subscription);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status !== "ACTIVE" && subscription.status !== "TRIAL") {
      return {
        allowed: false,
        reason: `Subscription is ${subscription.status}`,
        used: 0,
        limit: subscription.plan.maxReplies,
      };
    }

    const usage = await SubscriptionRepository.getUsage(organizationId);

    const used = usage?.aiRepliesGenerated ?? 0;

    const limit = subscription.plan.maxReplies;

    return {
      allowed: used < limit,
      used,
      limit,
    };
  }
  static async canProcessReview(organizationId: string) {
    console.log("REVIEW LIMIT CHECK ORGANIZATION:", organizationId);

    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    console.log("FOUND SUBSCRIPTION:", subscription);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status !== "ACTIVE" && subscription.status !== "TRIAL") {
      return {
        allowed: false,
        reason: `Subscription is ${subscription.status}`,
        used: 0,
        limit: subscription.plan.maxReviews,
      };
    }

    const usage = await SubscriptionRepository.getUsage(organizationId);

    const used = usage?.reviewsProcessed ?? 0;

    const limit = subscription.plan.maxReviews;

    return {
      allowed: used < limit,
      used,
      limit,
    };
  }
}
