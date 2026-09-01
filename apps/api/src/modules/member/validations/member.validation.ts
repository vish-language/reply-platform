import { z } from "zod";

import { MembershipRole } from "@prisma/client";

export const addMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be less than 100 characters"),

  email: z.email("Invalid email address"),

  role: z.enum([MembershipRole.ADMIN, MembershipRole.MEMBER]),
});

export const updateMemberSchema = z.object({
  role: z.enum([MembershipRole.ADMIN, MembershipRole.MEMBER]),
});
