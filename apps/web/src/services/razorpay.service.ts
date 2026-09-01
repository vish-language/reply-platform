import { verifyPayment } from "../api/billing.api";

export function openRazorpayCheckout(data: {
  keyId: string;
  orderId: string;
  planId: string;
  navigate: any;
}) {
  const options = {
    key: data.keyId,

    order_id: data.orderId,

    name: "ReplyAI",

    description: "AI Review Management",

    handler: async function (paymentResponse: any) {
      console.log("PAYMENT SUCCESS:", paymentResponse);

      const result = await verifyPayment({
        planId: data.planId,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,

        razorpayOrderId: paymentResponse.razorpay_order_id,

        razorpaySignature: paymentResponse.razorpay_signature,
      });

      console.log("VERIFY RESULT:", result);

      if (result.success) {
        localStorage.removeItem("selectedPlan");

        setTimeout(() => {
          data.navigate("/dashboard");
        }, 3000);
      }
    },

    modal: {
      ondismiss() {
        console.log("PAYMENT CLOSED");
      },
    },

    theme: {
      color: "#000000",
    },
  };

  const razorpay = new (window as any).Razorpay(options);

  razorpay.on("payment.failed", function (response: any) {
    console.log("PAYMENT FAILED:", response);

    const message =
      response?.error?.description || "Payment failed. Please try again.";

    alert(message);
  });

  razorpay.open();
}
