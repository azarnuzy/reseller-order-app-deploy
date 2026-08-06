import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { invalidRequest } from "../../request-validation";
import { requireChatSessionOwner } from "../chat-sessions/service";
import { confirmOrderSchema, orderParamsSchema } from "./schema";
import { confirmOrder, getOrder } from "./service";

export const ordersRouter = new Hono()
  .post(
    "/:sessionId/orders",
    zValidator("param", orderParamsSchema.omit({ orderNumber: true }), invalidRequest),
    zValidator("json", confirmOrderSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      const result = await confirmOrder(sessionId, userId, c.req.valid("json").draftVersion);
      return c.json(result, 200);
    },
  )
  .get(
    "/:sessionId/orders/:orderNumber",
    zValidator("param", orderParamsSchema, invalidRequest),
    async (c) => {
      const { orderNumber, sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json({ order: await getOrder(sessionId, userId, orderNumber) }, 200);
    },
  );
