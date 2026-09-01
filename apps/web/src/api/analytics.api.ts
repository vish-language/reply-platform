import { api } from "./axios";

export async function getAnalytics() {
  const response = await api.get("/analytics");

  return response.data;
}
