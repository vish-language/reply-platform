import crypto from "crypto";

const secret = "YOUR_64_CHARACTER_WEBHOOK_SECRET";

const body = `{
  "reviewId": "test-review-003",
  "locationId": "test-location-001",
  "authorName": "David",
  "authorEmail": "david@test.com",
  "content": "Amazing support. The team solved my problem quickly."
}`;

const signature = crypto
  .createHmac("sha256", secret)
  .update(body, "utf8")
  .digest("hex");

console.log(signature);