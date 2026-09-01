import { FakeGoogleReplyProvider } from "./fake-google-reply.provider.js";

import type { GoogleReviewProvider } from "./google-review.provider.js";

export const googleReviewProvider: GoogleReviewProvider =
  new FakeGoogleReplyProvider();
