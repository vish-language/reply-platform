import { googleReviewProvider } from "../providers/google-review.container.js";

import { SubscriptionLimitService } from "../../subscription/services/subscription-limit.service.js";

import { GoogleReviewRepository } from "../repositories/google-review.repository.js";

import { UsageRepository } from "../../subscription/repositories/usage.repository.js";

import { CommentService } from "../../comment/services/comment.service.js";

export class GoogleReviewSyncService {
  static async sync(locationId: string) {
    const integration =
      await GoogleReviewRepository.findByLocationId(locationId);

    if (!integration) {
      throw new Error("Google integration not found");
    }

    const reviewLimit = await SubscriptionLimitService.canProcessReview(
      integration.organizationId,
    );

    if (!reviewLimit.allowed) {
      throw new Error(
        reviewLimit.reason ??
          `Review limit reached ${reviewLimit.used}/${reviewLimit.limit}`,
      );
    }

    console.log("FETCHING GOOGLE REVIEWS...");

    const reviews = await googleReviewProvider.fetchReviews({
      locationId,
    });

    console.log("GOOGLE REVIEWS FETCHED:", reviews);

    const processed = [];

    for (const review of reviews) {
      console.log("PROCESSING REVIEW:", review);

      const reviewLimit = await SubscriptionLimitService.canProcessReview(
        integration.organizationId,
      );

      if (!reviewLimit.allowed) {
        console.log(
          `REVIEW LIMIT REACHED: ${reviewLimit.used}/${reviewLimit.limit}`,
        );

        break;
      }

      const comment = await CommentService.create(integration.organizationId, {
        externalCommentId: review.reviewId,

        googleReviewName: review.googleReviewName,

        authorName: review.authorName,

        authorEmail: review.authorEmail,

        content: review.content,

        rating: review.rating,
      });

      console.log("COMMENT CREATED:", comment);

      if (!comment.alreadyProcessed) {
        await UsageRepository.incrementReviews(integration.organizationId);
      }

      processed.push(comment);
    }

    return processed;
  }
}
