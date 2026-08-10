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

type AgentTurnRequest = ReturnType<typeof createAgentTurnRequest>;
type AgentTurnStream = ReturnType<AgentTurnRequest["stream"]>;

export function runAgentTurn(
  options: AgentTurnContext & { responseMode: "stream" },
): AgentTurnStream;
export function runAgentTurn(
  options: AgentTurnContext & { responseMode: "final" },
): Promise<string>;
export function runAgentTurn(options: RunAgentTurnOptions): AgentTurnStream | Promise<string> {
  const request = createAgentTurnRequest(options);
  if (options.responseMode === "stream") return request.stream();

  return request.send().then((response) => response.output);
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
