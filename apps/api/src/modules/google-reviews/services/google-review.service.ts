import crypto from "crypto";
import {
  FakeGoogleProvider,
  GoogleReviewPayload,
} from "../providers/fake-google.provider.js";
import { GoogleReviewRepository } from "../repositories/google-review.repository.js";

import { CommentService } from "../../comment/services/comment.service.js";

export class GoogleReviewService {
  static async connect(organizationId: string, data: any) {
    return GoogleReviewRepository.upsert(organizationId, {
      ...data,
      webhookSecret: crypto.randomBytes(32).toString("hex"),
    });
  }

  static async getConnection(organizationId: string) {
    return GoogleReviewRepository.findByOrganization(organizationId);
  }

  // static async processWebhook(data: {
  //   reviewId: string;
  //   locationId: string;
  //   authorName: string;
  //   authorEmail?: string;
  //   content: string;
  // }) {
  //   const integration = await GoogleReviewRepository.findByLocationId(
  //     data.locationId,
  //   );

  //   if (!integration) {
  //     throw new Error("Google integration not found");
  //   }

  //   const comment = await CommentService.create(integration.organizationId, {
  //     externalCommentId: data.reviewId,
  //     authorName: data.authorName,
  //     authorEmail: data.authorEmail,
  //     content: data.content,
  //   });

  //   return comment;
  // }

  static async processWebhook(data: {
    reviewId: string;
    locationId: string;
    googleReviewName?: string;
    authorName: string;
    authorEmail?: string;
    content: string;
    rating?: number;
  }) {
    const event = await FakeGoogleProvider.receiveReview(data);

    const review = event.review;

    const integration = await GoogleReviewRepository.findByLocationId(
      review.locationId,
    );

    if (!integration) {
      throw new Error("Google integration not found");
    }

    return CommentService.create(integration.organizationId, {
      externalCommentId: review.reviewId,
      googleReviewName: review.googleReviewName,
      authorName: review.authorName,
      authorEmail: review.authorEmail,
      content: review.content,
      rating: review.rating,
    });
  }

  static async disconnect(organizationId: string) {
    return GoogleReviewRepository.disconnect(organizationId);
  }
}
