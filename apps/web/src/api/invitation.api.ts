import { api } from "./axios";

export async function getInvitation(token: string) {
  const response = await api.get(`/invitations/${encodeURIComponent(token)}`);

  return response.data;
}

export async function acceptInvitation(data: {
  token: string;
  name: string;
  password: string;
}) {
  const response = await api.post("/auth/accept-invitation", data);

  return response.data;
}
