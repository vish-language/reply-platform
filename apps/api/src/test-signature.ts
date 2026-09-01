import crypto from "crypto";

const secret = "test-secret-001";

const body = JSON.stringify({
  reviewId: "test-review-001",
  locationId: "test-location-001",
  authorName: "Michael",
  authorEmail: "michael@test.com",
  content: "The service was excellent."
});

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

console.log(signature);