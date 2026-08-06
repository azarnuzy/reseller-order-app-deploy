import { z } from "zod";

export const whatsappVerificationQuerySchema = z.object({
  "hub.challenge": z.string().min(1),
  "hub.mode": z.literal("subscribe"),
  "hub.verify_token": z.string().min(1),
});

const whatsappInboundMessageSchema = z
  .object({
    from: z.string().trim().min(1),
    id: z.string().trim().min(1),
    text: z.unknown().optional(),
    type: z.string().trim().min(1),
  })
  .passthrough();

const whatsappWebhookValueSchema = z
  .object({
    messages: z.array(whatsappInboundMessageSchema).optional(),
    statuses: z.array(z.unknown()).optional(),
  })
  .passthrough();

const whatsappWebhookChangeSchema = z
  .object({
    field: z.string().optional(),
    value: whatsappWebhookValueSchema,
  })
  .passthrough();

const whatsappWebhookEntrySchema = z
  .object({
    changes: z.array(whatsappWebhookChangeSchema).optional(),
  })
  .passthrough();

export const whatsappWebhookPayloadSchema = z
  .object({
    entry: z.array(whatsappWebhookEntrySchema).optional(),
    object: z.string().optional(),
  })
  .passthrough();

const whatsappTextMessageSchema = whatsappInboundMessageSchema.extend({
  text: z.object({ body: z.string().min(1) }).passthrough(),
  type: z.literal("text"),
});

export type WhatsAppTextMessage = {
  metaMessageId: string;
  senderId: string;
  text: string;
};

export function getWhatsAppTextMessages(
  payload: z.output<typeof whatsappWebhookPayloadSchema>,
): WhatsAppTextMessage[] {
  const textMessages: WhatsAppTextMessage[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const message of change.value.messages ?? []) {
        const textMessage = whatsappTextMessageSchema.safeParse(message);
        if (!textMessage.success) continue;

        textMessages.push({
          metaMessageId: textMessage.data.id,
          senderId: textMessage.data.from,
          text: textMessage.data.text.body,
        });
      }
    }
  }

  return textMessages;
}
