import { z } from "zod";

export const updateAISettingsSchema = z.object({
  autoReplyEnabled: z.boolean().optional(),

  tone: z
    .string()
    .min(1, "Tone cannot be empty")
    .max(50, "Tone is too long")
    .optional(),

  language: z
    .string()
    .min(1, "Language cannot be empty")
    .max(50, "Language is too long")
    .optional(),

  instructions: z
    .string()
    .max(5000, "Instructions are too long")
    .nullable()
    .optional(),
});