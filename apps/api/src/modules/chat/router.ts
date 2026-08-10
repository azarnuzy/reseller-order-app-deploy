import { createEventStream } from "@anvia/server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { anonymousUserId } from "../../anonymous-user";
import { prisma } from "../../prisma";
import { invalidRequest } from "../../request-validation";
import { requireOwnedChatSession } from "../chat-sessions/service";
import { chatMemory } from "./memory";
import {
  chatMessageRequestSchema,
  chatSessionParamsSchema,
  getLastUserMessageText,
  MAX_CHAT_BODY_BYTES,
} from "./schema";
import { runAgentTurn } from "./service";

export const chatRouter = new Hono()
  .get(
    "/:sessionId/messages",
    zValidator("param", chatSessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      await requireOwnedChatSession(prisma, sessionId, anonymousUserId);
      const messages = await chatMemory.load({ sessionId, userId: anonymousUserId });
      return c.json({ messages }, 200);
    },
  )
  .post(
    "/:sessionId/messages",
    bodyLimit({
      maxSize: MAX_CHAT_BODY_BYTES,
      onError: (c) =>
        c.json(
          {
            error: {
              code: "PAYLOAD_TOO_LARGE",
              message: "The chat request is too large.",
            },
          },
          413,
        ),
    }),
    zValidator("param", chatSessionParamsSchema, invalidRequest),
    zValidator("json", chatMessageRequestSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      await requireOwnedChatSession(prisma, sessionId, anonymousUserId);

      const stream = runAgentTurn({
        message: getLastUserMessageText(c.req.valid("json")),
        responseMode: "stream",
        sessionId,
        userId: anonymousUserId,
      });

      return createEventStream(safeChatStream(stream), { format: "jsonl" });
    },
  );

async function* safeChatStream<TEvent>(stream: AsyncIterable<TEvent>) {
  try {
    yield* stream;
  } catch {
    throw new Error("The assistant is temporarily unavailable. Please try again.");
  }
}
