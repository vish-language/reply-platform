import crypto from "crypto";
import { razorpay } from "../../../config/razorpay.js";
export class RazorpayService {
    static async createOrder(data) {
        try {
            const result = await razorpay.orders.create({
                amount: data.amount,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            });
            console.log("RAZORPAY ORDER RESULT:", result);
            return result;
        }
        catch (error) {
            console.log("========== RAZORPAY ORDER ERROR ==========");
            console.log(error);
            console.log("===========================================");
            throw error;
        }
    }
    static verifyPayment(data) {
        const body = data.razorpayOrderId + "|" + data.razorpayPaymentId;
        console.log("========== VERIFY DEBUG ==========");
        console.log("ORDER ID:", data.razorpayOrderId);
        console.log("PAYMENT ID:", data.razorpayPaymentId);
        console.log("BODY:", body);
        console.log("RECEIVED SIGNATURE:", data.razorpaySignature);
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        console.log("GENERATED SIGNATURE:", generatedSignature);
        console.log("MATCH:", generatedSignature === data.razorpaySignature);
        console.log("=================================");
        return generatedSignature === data.razorpaySignature;
    }
    static async getPayment(paymentId) {
        try {
            const payment = await razorpay.payments.fetch(paymentId);
            return payment;
        }
        catch (error) {
            console.log("FETCH PAYMENT ERROR:", error);
            throw error;
        }
    }
    static verifyWebhookSignature(body, signature) {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest("hex");
        return generatedSignature === signature;
    }
}
//# sourceMappingURL=razorpay.service.js.map