import { z } from "zod";


export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters"),

    email: z
        .email("Invalid email address")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    organizationName: z
        .string()
        .trim()
        .min(2, "Organization name must be at least 2 characters")
        .max(100, "Organization name must not exceed 100 characters"),
});