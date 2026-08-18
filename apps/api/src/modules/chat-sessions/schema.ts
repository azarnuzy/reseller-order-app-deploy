import { z } from "zod";

export const chatSessionParamsSchema = z.object({
  sessionId: z.string().trim().min(1).max(128),
});
