import { api } from "./axios";

export async function generateReply(data: { comment: string }) {
  const response = await api.post("/ai/generate", data);

  return response.data;
}
