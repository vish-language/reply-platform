export type GoogleReviewPayload = {
  reviewId: string;
  locationId: string;
  googleReviewName?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  rating?: number;
};

export class FakeGoogleProvider {
  static async receiveReview(payload: GoogleReviewPayload) {
    return {
      provider: "fake-google",
      review: payload,
      receivedAt: new Date(),
    };
  }
}
