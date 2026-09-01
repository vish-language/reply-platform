import { api } from "./axios";

export async function getComments(page = 1, limit = 20) {
  const response = await api.get(`/comments?page=${page}&limit=${limit}`);

  return response.data;
}
export async function createReply(data: {
  commentId: string;
  content: string;
}) {
  const response = await api.post("/replies", data);

  return response.data;
}
