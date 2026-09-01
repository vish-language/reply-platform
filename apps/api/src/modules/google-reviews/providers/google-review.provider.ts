export interface GoogleReviewProvider {

  fetchReviews(data: {
    locationId: string;
  }): Promise<any[]>;


  publishReply(data: {
    googleReviewName: string;
    replyContent: string;
  }): Promise<{
    success: boolean;
    publishedAt: Date;
  }>;

}