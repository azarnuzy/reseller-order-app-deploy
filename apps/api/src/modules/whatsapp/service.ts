import { createHmac, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { whatsappConfig } from "@repo/config";
import { prisma } from "../../prisma";

export type WhatsAppIdentityContext = {
  chatSessionId: string;
  userId: string;
};

export async function claimWhatsAppWebhookEvent(metaMessageId: string): Promise<boolean> {
  const result = await prisma.whatsAppWebhookEvent.createMany({
    data: { metaMessageId },
    skipDuplicates: true,
  });

  return result.count === 1;
}

export async function markWhatsAppWebhookEventProcessed(metaMessageId: string): Promise<void> {
  await prisma.whatsAppWebhookEvent.update({
    where: { metaMessageId },
    data: {
      processedAt: new Date(),
      status: "PROCESSED",
    },
  });
}

export async function resolveWhatsAppIdentity(senderId: string): Promise<WhatsAppIdentityContext> {
  const senderHash = hashWhatsAppSenderId(senderId);
  const existingIdentity = await findWhatsAppIdentity(senderHash);
  if (existingIdentity) return existingIdentity;

  try {
    return await prisma.$transaction(async (transaction) => {
      const userId = `whatsapp-user-${randomUUID()}`;
      await transaction.user.create({
        data: {
          email: `${userId}@reseller.invalid`,
          id: userId,
          name: "WhatsApp Customer",
        },
      });

      const chatSession = await transaction.chatSession.create({
        data: { userId },
        select: { id: true },
      });

      return transaction.whatsAppIdentity.create({
        data: {
          chatSessionId: chatSession.id,
          senderHash,
          userId,
        },
        select: { chatSessionId: true, userId: true },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const concurrentIdentity = await findWhatsAppIdentity(senderHash);
      if (concurrentIdentity) return concurrentIdentity;
    }

    throw error;
  }
}

function hashWhatsAppSenderId(senderId: string): string {
  const secret = whatsappConfig.identityHmacSecret;
  if (!secret) throw new Error("WhatsApp identity configuration is unavailable.");

  return createWhatsAppSenderHash(senderId, secret);
}

export function createWhatsAppSenderHash(senderId: string, secret: string): string {
  if (!senderId || !secret) throw new Error("WhatsApp identity hashing input is unavailable.");
  return createHmac("sha256", secret).update(senderId).digest("hex");
}

function findWhatsAppIdentity(senderHash: string): Promise<WhatsAppIdentityContext | null> {
  return prisma.whatsAppIdentity.findUnique({
    where: { senderHash },
    select: { chatSessionId: true, userId: true },
  });
}
