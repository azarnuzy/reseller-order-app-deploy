import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { anonymousUserId } from "../../anonymous-user";
import { invalidRequest } from "../../request-validation";
import { chatSessionParamsSchema } from "./schema";
import { createChatSession, deleteChatSession } from "./service";

export const chatSessionsRouter = new Hono()
  .post("/", async (c) => {
    return c.json({ session: await createChatSession(anonymousUserId) }, 201);
  })
  .delete(
    "/:sessionId",
    zValidator("param", chatSessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      return c.json({ session: await deleteChatSession(sessionId, anonymousUserId) }, 200);
    },
  );
