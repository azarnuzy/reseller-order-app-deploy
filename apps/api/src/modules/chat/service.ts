import {
  createConfiguredModel,
  createResellerOrderAgent,
  getAgentTracing,
  ResellerApiClient,
  resellerTraceOptions,
} from "@repo/agent";
import { agentApiConfig } from "@repo/config";
import { chatMemory } from "./memory";

type AgentTurnContext = {
  message: string;
  sessionId: string;
  userId: string;
};

export type RunAgentTurnOptions = AgentTurnContext & {
  responseMode: "final" | "stream";
};

export type FinalAgentTurnResult = {
  productDetail?: { sku: string };
  text: string;
};

type AgentTurnRequest = ReturnType<typeof createAgentTurnRequest>;
type AgentTurnStream = ReturnType<AgentTurnRequest["stream"]>;

export function runAgentTurn(
  options: AgentTurnContext & { responseMode: "stream" },
): AgentTurnStream;
export function runAgentTurn(
  options: AgentTurnContext & { responseMode: "final" },
): Promise<FinalAgentTurnResult>;
export function runAgentTurn(
  options: RunAgentTurnOptions,
): AgentTurnStream | Promise<FinalAgentTurnResult> {
  const request = createAgentTurnRequest(options);
  if (options.responseMode === "stream") return request.stream();

  return request.send().then((response) => ({
    productDetail: extractProductDetail(response.messages),
    text: response.output,
  }));
}

function extractProductDetail(messages: unknown): { sku: string } | undefined {
  if (!Array.isArray(messages)) return undefined;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!isRecord(message) || message.role !== "tool" || !Array.isArray(message.content)) {
      continue;
    }

    for (const item of message.content) {
      if (!isRecord(item) || item.type !== "tool_result" || item.toolName !== "getProductDetail") {
        continue;
      }

      const sku = readProductSku(item.content);
      if (sku) return { sku };
    }
  }

  return undefined;
}

function readProductSku(content: unknown): string | undefined {
  if (!Array.isArray(content)) return undefined;

  for (const part of content) {
    if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(part.text);
    } catch {
      continue;
    }

    if (
      isRecord(parsed) &&
      parsed.ok === true &&
      isRecord(parsed.data) &&
      typeof parsed.data.sku === "string"
    ) {
      return parsed.data.sku;
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createAgentTurnRequest({ message, sessionId, userId }: AgentTurnContext) {
  const apiClient = new ResellerApiClient({
    baseUrl: agentApiConfig.internalUrl,
    sessionId,
  });
  const agent = createResellerOrderAgent({
    apiClient,
    memory: chatMemory,
    model: createConfiguredModel(),
    tracing: getAgentTracing(),
  });
  const userMessage = {
    content: [{ text: message, type: "text" as const }],
    role: "user" as const,
  };

  return agent
    .session(sessionId, { userId })
    .prompt(userMessage)
    .withTrace({ ...resellerTraceOptions({ sessionId }), userId });
}
