import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { invalidRequest } from "../../request-validation";
import { requireChatSessionOwner } from "../chat-sessions/service";
import {
  addDraftItemSchema,
  draftItemParamsSchema,
  saveCustomerDataSchema,
  sessionParamsSchema,
  updateDraftItemSchema,
} from "./schema";
import {
  addDraftItem,
  cancelDraft,
  getActiveDraft,
  getLatestCustomerData,
  getOrderSummary,
  removeDraftItem,
  saveCustomerData,
  updateDraftItem,
  validateDraft,
} from "./service";

export const draftsRouter = new Hono()
  .get("/:sessionId/draft", zValidator("param", sessionParamsSchema, invalidRequest), async (c) => {
    const { sessionId } = c.req.valid("param");
    const userId = await requireChatSessionOwner(sessionId);
    return c.json({ draft: await getActiveDraft(sessionId, userId) }, 200);
  })
  .post(
    "/:sessionId/draft/items",
    zValidator("param", sessionParamsSchema, invalidRequest),
    zValidator("json", addDraftItemSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json(
        {
          draft: await addDraftItem(sessionId, userId, c.req.valid("json")),
        },
        201,
      );
    },
  )
  .patch(
    "/:sessionId/draft/items/:itemId",
    zValidator("param", draftItemParamsSchema, invalidRequest),
    zValidator("json", updateDraftItemSchema, invalidRequest),
    async (c) => {
      const { itemId, sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json(
        {
          draft: await updateDraftItem(sessionId, userId, itemId, c.req.valid("json").quantity),
        },
        200,
      );
    },
  )
  .delete(
    "/:sessionId/draft/items/:itemId",
    zValidator("param", draftItemParamsSchema, invalidRequest),
    async (c) => {
      const { itemId, sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json({ draft: await removeDraftItem(sessionId, userId, itemId) }, 200);
    },
  )
  .put(
    "/:sessionId/draft/customer",
    zValidator("param", sessionParamsSchema, invalidRequest),
    zValidator("json", saveCustomerDataSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json(
        {
          draft: await saveCustomerData(sessionId, userId, c.req.valid("json")),
        },
        200,
      );
    },
  )
  .get(
    "/:sessionId/customer/latest",
    zValidator("param", sessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json({ customer: await getLatestCustomerData(sessionId, userId) }, 200);
    },
  )
  .post(
    "/:sessionId/draft/validate",
    zValidator("param", sessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json(await validateDraft(sessionId, userId), 200);
    },
  )
  .post(
    "/:sessionId/draft/summary",
    zValidator("param", sessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json({ summary: await getOrderSummary(sessionId, userId) }, 200);
    },
  )
  .delete(
    "/:sessionId/draft",
    zValidator("param", sessionParamsSchema, invalidRequest),
    async (c) => {
      const { sessionId } = c.req.valid("param");
      const userId = await requireChatSessionOwner(sessionId);
      return c.json({ draft: await cancelDraft(sessionId, userId) }, 200);
    },
  );
