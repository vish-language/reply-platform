import { api } from "./axios";

export async function createOrder(planId: string) {
  const response = await api.post("/billing/create-order", {
    planId,
  });

  return response.data;
}
export async function verifyPayment(data: {
  planId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) {
  console.log("API VERIFY DATA:", data);
  const response = await api.post("/billing/verify-payment", data);

  return response.data;
}
export async function getPaymentHistory() {
  const response = await api.get("/billing/payments");

  return response.data;
}
