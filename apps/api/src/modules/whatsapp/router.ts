import { createHmac, timingSafeEqual } from "node:crypto";
import { whatsappConfig } from "@repo/config";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { runAgentTurn } from "../chat/service";
import { sendWhatsAppTextMessage } from "./client";
import {
  getWhatsAppTextMessages,
  whatsappVerificationQuerySchema,
  whatsappWebhookPayloadSchema,
} from "./schema";
import {
  claimWhatsAppWebhookEvent,
  markWhatsAppWebhookEventProcessed,
  resolveWhatsAppIdentity,
} from "./service";

const MAX_WHATSAPP_WEBHOOK_BODY_BYTES = 1024 * 1024;
const META_SIGNATURE_PREFIX = "sha256=";

type WhatsAppRouterConfig = Pick<typeof whatsappConfig, "appSecret" | "enabled" | "verifyToken">;

type FinalAgentTurnInput = {
  message: string;
  responseMode: "final";
  sessionId: string;
  userId: string;
};

export type WhatsAppRouterDependencies = {
  claimEvent(metaMessageId: string): Promise<boolean>;
  markEventProcessed(metaMessageId: string): Promise<void>;
  resolveIdentity(senderId: string): Promise<{ chatSessionId: string; userId: string }>;
  runFinalAgentTurn(input: FinalAgentTurnInput): Promise<string>;
  sendTextMessage(recipient: string, text: string): Promise<void>;
};

type CreateWhatsAppRouterOptions = {
  config?: WhatsAppRouterConfig;
  dependencies?: WhatsAppRouterDependencies;
};

const productionDependencies: WhatsAppRouterDependencies = {
  claimEvent: claimWhatsAppWebhookEvent,
  markEventProcessed: markWhatsAppWebhookEventProcessed,
  resolveIdentity: resolveWhatsAppIdentity,
  runFinalAgentTurn: runAgentTurn,
  sendTextMessage: sendWhatsAppTextMessage,
};

export function createWhatsAppRouter({
  config = whatsappConfig,
  dependencies = productionDependencies,
}: CreateWhatsAppRouterOptions = {}) {
  return new Hono()
    .get("/webhook", (c) => {
      if (!config.enabled) return c.notFound();

      const query = whatsappVerificationQuerySchema.safeParse(c.req.query());
      if (!query.success || query.data["hub.verify_token"] !== config.verifyToken) {
        return c.json(
          { error: { code: "INVALID_REQUEST", message: "Webhook verification failed." } },
          403,
        );
      }

      return c.text(query.data["hub.challenge"], 200);
    })
    .post(
      "/webhook",
      bodyLimit({
        maxSize: MAX_WHATSAPP_WEBHOOK_BODY_BYTES,
        onError: (c) =>
          c.json(
            { error: { code: "PAYLOAD_TOO_LARGE", message: "The webhook payload is too large." } },
            413,
          ),
      }),
      async (c) => {
        if (!config.enabled) return c.notFound();

        const rawBody = await c.req.bytes();
        const signature = c.req.header("X-Hub-Signature-256");
        if (!isValidMetaSignature(rawBody, signature, config.appSecret)) {
          return c.json(
            { error: { code: "INVALID_REQUEST", message: "Webhook signature is invalid." } },
            401,
          );
        }

        const payload = parseJson(rawBody);
        const parsedPayload = whatsappWebhookPayloadSchema.safeParse(payload);
        if (!parsedPayload.success) {
          return c.json(
            { error: { code: "INVALID_REQUEST", message: "Webhook payload is invalid." } },
            400,
          );
        }

        for (const message of getWhatsAppTextMessages(parsedPayload.data)) {
          const claimed = await dependencies.claimEvent(message.metaMessageId);
          if (!claimed) continue;

          const identity = await dependencies.resolveIdentity(message.senderId);
          const reply = await dependencies.runFinalAgentTurn({
            message: message.text,
            responseMode: "final",
            sessionId: identity.chatSessionId,
            userId: identity.userId,
          });
          await dependencies.sendTextMessage(message.senderId, reply);

          await dependencies.markEventProcessed(message.metaMessageId);
        }

        return c.json({ received: true }, 200);
      },
    );
}

export const whatsappRouter = createWhatsAppRouter();

function isValidMetaSignature(
  rawBody: Uint8Array,
  signature: string | undefined,
  appSecret: string | undefined,
) {
  if (!signature?.startsWith(META_SIGNATURE_PREFIX) || !appSecret) return false;

  const digestHex = signature.slice(META_SIGNATURE_PREFIX.length);
  if (!/^[a-f\d]{64}$/i.test(digestHex)) return false;

  const expectedDigest = createHmac("sha256", appSecret).update(rawBody).digest();
  const receivedDigest = Buffer.from(digestHex, "hex");

  return (
    receivedDigest.length === expectedDigest.length &&
    timingSafeEqual(receivedDigest, expectedDigest)
  );
}

function parseJson(rawBody: Uint8Array): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(rawBody)) as unknown;
  } catch {
    return undefined;
  }
}
