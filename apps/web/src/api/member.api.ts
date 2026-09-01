import { api } from "./axios";

export async function getMembers() {
  const response = await api.get("/members");

  return response.data;
}

export async function addMember(data: {
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}) {
  const response = await api.post("/members", data);

  return response.data;
}

export async function updateMember(
  membershipId: string,
  data: {
    role: "ADMIN" | "MEMBER";
  },
) {
  const response = await api.patch(`/members/${membershipId}`, data);

  return response.data;
}

export async function removeMember(membershipId: string) {
  const response = await api.delete(`/members/${membershipId}`);

  return response.data;
}
