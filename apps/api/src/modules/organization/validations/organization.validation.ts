import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),

  isActive: z.boolean(),
});
