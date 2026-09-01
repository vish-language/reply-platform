import type { GoogleReviewProvider } from "./google-review.provider.js";

export class FakeGoogleReplyProvider implements GoogleReviewProvider {
  async fetchReviews(data: { locationId: string }) {
    console.log("FAKE PROVIDER CALLED", data.locationId);

    return [
      {
        reviewId: "fake-review-007",

        googleReviewName:
          "accounts/test/locations/test-location-001/reviews/fake-review-007",

        authorName: "David",

        authorEmail: "david@test.com",

        content: "Excellent support. I am very happy with the service.i am your fan",

        rating: 5,
      },
    ];
  }

  async publishReply(data: { googleReviewName: string; replyContent: string }) {
    console.log("Fake Google Reply Published:", data.googleReviewName);

    console.log("Reply:", data.replyContent);

    return {
      success: true,
      googleReviewName: data.googleReviewName,
      replyContent: data.replyContent,
      publishedAt: new Date(),
    };
  }
}
