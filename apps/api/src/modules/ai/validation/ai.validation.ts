import { z } from "zod";


export const generateReplySchema = z.object({

    comment: z
        .string()
        .min(1, "Comment is required"),


    tone: z
        .string()
        .optional()
        .default("professional"),


    language: z
        .string()
        .optional()
        .default("English"),


    instructions: z
        .string()
        .nullable()
        .optional(),

});