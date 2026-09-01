import { api } from "./axios";

export async function getReplies(commentId: string) {
  const response = await api.get(`/replies/comment/${commentId}`);

  return response.data;
}

export async function createReply(data: {
  commentId: string;
  content: string;
}) {
  const response = await api.post("/replies", data);

  return response.data;
}
