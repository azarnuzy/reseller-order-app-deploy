import { z } from "zod";

export const catalogProductParamsSchema = z.object({
  sku: z.string().trim().min(1),
});
