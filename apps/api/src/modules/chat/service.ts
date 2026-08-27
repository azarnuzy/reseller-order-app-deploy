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

export type ProductListSection = { skus: string[]; title: string };

export type FinalAgentTurnResult = {
  productDetail?: { sku: string };
  productList?: { sections: ProductListSection[] };
  text: string;
};

const MAX_PRODUCT_LIST_ITEMS = 10;
const PRODUCT_LIST_TOOL_NAMES = new Set(["getTopProducts", "recommendProducts", "searchProducts"]);

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
    ...extractProductCard(response.messages),
    text: response.output,
  }));
}

function extractProductCard(
  messages: unknown,
): Pick<FinalAgentTurnResult, "productDetail" | "productList"> {
  if (!Array.isArray(messages)) return {};

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!isRecord(message) || message.role !== "tool" || !Array.isArray(message.content)) {
      continue;
    }

    for (const item of message.content) {
      if (!isRecord(item) || item.type !== "tool_result" || typeof item.toolName !== "string") {
        continue;
      }

      if (item.toolName === "getProductDetail") {
        const sku = readProductSku(item.content);
        if (sku) return { productDetail: { sku } };
        continue;
      }

      if (PRODUCT_LIST_TOOL_NAMES.has(item.toolName)) {
        const items = readProductListItems(item.toolName, item.content);
        if (items && items.length > 1) {
          return { productList: { sections: groupIntoSections(items) } };
        }
      }
    }
  }

  return {};
}

function readProductListItems(
  toolName: string,
  content: unknown,
): Array<{ category: string; sku: string }> | undefined {
  if (!Array.isArray(content)) return undefined;

  for (const part of content) {
    if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(part.text);
    } catch {
      continue;
    }

    if (!isRecord(parsed) || parsed.ok !== true || !isRecord(parsed.data)) continue;

    const rawProducts = parsed.data.products;
    if (!Array.isArray(rawProducts)) continue;

    const items = rawProducts
      .map((entry) => toProductListItem(toolName, entry))
      .filter((entry): entry is { category: string; sku: string } => entry !== undefined);

    if (items.length > 0) return items;
  }

  return undefined;
}

function toProductListItem(
  toolName: string,
  entry: unknown,
): { category: string; sku: string } | undefined {
  const product = toolName === "getTopProducts" && isRecord(entry) ? entry.product : entry;

  if (
    !isRecord(product) ||
    typeof product.sku !== "string" ||
    typeof product.category !== "string"
  ) {
    return undefined;
  }

  return { category: product.category, sku: product.sku };
}

function groupIntoSections(items: Array<{ category: string; sku: string }>): ProductListSection[] {
  const sections: ProductListSection[] = [];
  const sectionByCategory = new Map<string, ProductListSection>();

  for (const item of items.slice(0, MAX_PRODUCT_LIST_ITEMS)) {
    let section = sectionByCategory.get(item.category);
    if (!section) {
      section = { skus: [], title: item.category };
      sectionByCategory.set(item.category, section);
      sections.push(section);
    }
    section.skus.push(item.sku);
  }

  return sections;
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
