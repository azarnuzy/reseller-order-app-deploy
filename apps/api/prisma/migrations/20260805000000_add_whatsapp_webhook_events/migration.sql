CREATE TYPE "WhatsAppWebhookEventStatus" AS ENUM ('PROCESSING', 'PROCESSED');

CREATE TABLE "WhatsAppWebhookEvent" (
  "id" TEXT NOT NULL,
  "metaMessageId" TEXT NOT NULL,
  "status" "WhatsAppWebhookEventStatus" NOT NULL DEFAULT 'PROCESSING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "WhatsAppWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsAppWebhookEvent_metaMessageId_key"
ON "WhatsAppWebhookEvent"("metaMessageId");
