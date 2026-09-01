import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
console.log("RAZORPAY KEY:", keyId?.substring(0, 12));
if (!keyId || !keySecret) {
  throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required");
}

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
