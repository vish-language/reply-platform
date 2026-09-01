import { z } from "zod";

export const createReplySchema = z.object({
  commentId: z
    .string()
    .min(1, "Comment ID is required"),

  content: z
    .string()
    .min(1, "Reply content is required")
    .max(10000, "Reply content is too long"),
});