import { z } from "zod";

export const createCommentSchema = z.object({
  authorName: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name is too long"),

  authorEmail: z.email("Invalid email address").optional(),

  content: z
    .string()
    .min(1, "Comment content is required")
    .max(10000, "Comment content is too long"),
});
