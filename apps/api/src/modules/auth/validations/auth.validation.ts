import {z} from "zod";

export const acceptInvitationSchema = z.object({
  token: z
    .string()
    .min(1, "Invitation token is required"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});