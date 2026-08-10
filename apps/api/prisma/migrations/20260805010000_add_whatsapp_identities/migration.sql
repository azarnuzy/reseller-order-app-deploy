CREATE TABLE "WhatsAppIdentity" (
  "id" TEXT NOT NULL,
  "senderHash" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chatSessionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WhatsAppIdentity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsAppIdentity_senderHash_key" ON "WhatsAppIdentity"("senderHash");
CREATE UNIQUE INDEX "WhatsAppIdentity_userId_key" ON "WhatsAppIdentity"("userId");
CREATE UNIQUE INDEX "WhatsAppIdentity_chatSessionId_key" ON "WhatsAppIdentity"("chatSessionId");

ALTER TABLE "WhatsAppIdentity"
ADD CONSTRAINT "WhatsAppIdentity_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsAppIdentity"
ADD CONSTRAINT "WhatsAppIdentity_chatSessionId_fkey"
FOREIGN KEY ("chatSessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
