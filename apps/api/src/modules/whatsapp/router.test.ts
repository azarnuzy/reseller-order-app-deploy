import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";
import { createWhatsAppRouter, type WhatsAppRouterDependencies } from "./router";
import { createWhatsAppSenderHash } from "./service";

const appSecret = "test-meta-app-secret";
const verifyToken = "test-verify-token";

type AgentTurn = Parameters<WhatsAppRouterDependencies["runFinalAgentTurn"]>[0];

function createHarness() {
  const agentTurns: AgentTurn[] = [];
  const claimedEvents = new Set<string>();
  const identities = new Map<string, { chatSessionId: string; userId: string }>();
  const processedEvents: string[] = [];
  const sentMessages: Array<{ recipient: string; text: string }> = [];

  const dependencies: WhatsAppRouterDependencies = {
    async claimEvent(metaMessageId) {
      if (claimedEvents.has(metaMessageId)) return false;
      claimedEvents.add(metaMessageId);
      return true;
    },
    async markEventProcessed(metaMessageId) {
      processedEvents.push(metaMessageId);
    },
    async resolveIdentity(senderId) {
      const existing = identities.get(senderId);
      if (existing) return existing;

      const sequence = identities.size + 1;
      const identity = {
        chatSessionId: `opaque-session-${sequence}`,
        userId: `opaque-user-${sequence}`,
      };
      identities.set(senderId, identity);
      return identity;
    },
    async runFinalAgentTurn(input) {
      agentTurns.push(input);
      return { text: `Assistant reply: ${input.message}` };
    },
    async sendProductListMessage() {},
    async sendProductMessage() {},
    async sendTextMessage(recipient, text) {
      sentMessages.push({ recipient, text });
    },
  };
  const router = createWhatsAppRouter({
    config: { appSecret, enabled: true, verifyToken },
    dependencies,
  });

  return { agentTurns, processedEvents, router, sentMessages };
}

test("Meta webhook verification accepts the configured token", async () => {
  const { router } = createHarness();
  const response = await router.request(
    `/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=verified`,
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "verified");
});

test("Meta webhook verification rejects an invalid token", async () => {
  const { router } = createHarness();
  const response = await router.request(
    "/webhook?hub.mode=subscribe&hub.verify_token=invalid&hub.challenge=denied",
  );

  assert.equal(response.status, 403);
});

test("a valid text webhook runs the shared agent and sends its final reply", async () => {
  const { agentTurns, processedEvents, router, sentMessages } = createHarness();
  const rawSenderId = "628123456789";
  const response = await postWebhook(
    router,
    textPayload("wamid.text-1", rawSenderId, "Show catalog"),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(agentTurns, [
    {
      message: "Show catalog",
      responseMode: "final",
      sessionId: "opaque-session-1",
      userId: "opaque-user-1",
    },
  ]);
  assert.deepEqual(sentMessages, [
    { recipient: rawSenderId, text: "Assistant reply: Show catalog" },
  ]);
  assert.deepEqual(processedEvents, ["wamid.text-1"]);
  assert.equal(JSON.stringify(agentTurns).includes(rawSenderId), false);
});

test("an invalid webhook signature has no side effects", async () => {
  const { agentTurns, processedEvents, router, sentMessages } = createHarness();
  const body = JSON.stringify(textPayload("wamid.invalid", "628000000001", "Hello"));
  const response = await router.request("/webhook", {
    body,
    headers: { "Content-Type": "application/json", "X-Hub-Signature-256": "sha256=invalid" },
    method: "POST",
  });

  assert.equal(response.status, 401);
  assert.deepEqual(agentTurns, []);
  assert.deepEqual(sentMessages, []);
  assert.deepEqual(processedEvents, []);
});

test("a duplicate webhook delivery runs and replies once", async () => {
  const { agentTurns, processedEvents, router, sentMessages } = createHarness();
  const payload = textPayload("wamid.duplicate", "628000000002", "Confirm exact summary");

  assert.equal((await postWebhook(router, payload)).status, 200);
  assert.equal((await postWebhook(router, payload)).status, 200);
  assert.equal(agentTurns.length, 1);
  assert.equal(sentMessages.length, 1);
  assert.deepEqual(processedEvents, ["wamid.duplicate"]);
});

test("different senders use isolated sessions while returning senders reuse theirs", async () => {
  const { agentTurns, router } = createHarness();

  await postWebhook(router, textPayload("wamid.sender-a-1", "628000000010", "First"));
  await postWebhook(router, textPayload("wamid.sender-b-1", "628000000020", "Second"));
  await postWebhook(router, textPayload("wamid.sender-a-2", "628000000010", "Third"));

  assert.notEqual(agentTurns[0]?.sessionId, agentTurns[1]?.sessionId);
  assert.notEqual(agentTurns[0]?.userId, agentTurns[1]?.userId);
  assert.equal(agentTurns[0]?.sessionId, agentTurns[2]?.sessionId);
  assert.equal(agentTurns[0]?.userId, agentTurns[2]?.userId);
});

test("delivery statuses are acknowledged without running an action", async () => {
  const { agentTurns, processedEvents, router, sentMessages } = createHarness();
  const response = await postWebhook(router, {
    entry: [{ changes: [{ field: "messages", value: { statuses: [{ id: "status-1" }] } }] }],
    object: "whatsapp_business_account",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(agentTurns, []);
  assert.deepEqual(sentMessages, []);
  assert.deepEqual(processedEvents, []);
});

test("sender hashing is stable, isolated, and does not contain the raw sender ID", () => {
  const senderA = "628000000030";
  const senderB = "628000000040";
  const hashA = createWhatsAppSenderHash(senderA, "identity-test-secret");

  assert.equal(hashA, createWhatsAppSenderHash(senderA, "identity-test-secret"));
  assert.notEqual(hashA, createWhatsAppSenderHash(senderB, "identity-test-secret"));
  assert.equal(hashA.includes(senderA), false);
  assert.match(hashA, /^[a-f\d]{64}$/);
});

function textPayload(metaMessageId: string, senderId: string, text: string) {
  return {
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              messages: [{ from: senderId, id: metaMessageId, text: { body: text }, type: "text" }],
            },
          },
        ],
      },
    ],
    object: "whatsapp_business_account",
  };
}

async function postWebhook(router: ReturnType<typeof createWhatsAppRouter>, payload: unknown) {
  const body = JSON.stringify(payload);
  const signature = createHmac("sha256", appSecret).update(body).digest("hex");
  return router.request("/webhook", {
    body,
    headers: {
      "Content-Type": "application/json",
      "X-Hub-Signature-256": `sha256=${signature}`,
    },
    method: "POST",
  });
}
