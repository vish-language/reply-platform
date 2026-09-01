import { api } from "./axios";

export async function getCurrentSubscription() {
  const response = await api.get("/subscription");

  return response.data;
}

export async function upgradePlan(planId: string) {
  const response = await api.post("/subscription/upgrade", {
    planId,
  });

  return response.data;
}

export async function cancelSubscription() {
  const response = await api.post("/subscription/cancel");

  return response.data;
}
export async function reactivateSubscription() {
  const response = await api.post("/subscription/reactivate");

  return response.data;
}
