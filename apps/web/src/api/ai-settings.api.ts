import { api } from "./axios";

export async function getAISettings() {
  const response = await api.get("/ai-settings");

  return response.data;
}

export async function updateAISettings(data: {
  autoReplyEnabled: boolean;
  tone: string;
  language: string;
  instructions: string | null;
}) {
  const response = await api.patch("/ai-settings", data);

  return response.data;
}
