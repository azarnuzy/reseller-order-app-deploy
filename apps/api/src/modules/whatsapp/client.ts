import { whatsappConfig } from "@repo/config";

const META_GRAPH_API_BASE_URL = "https://graph.facebook.com/";
const META_REQUEST_TIMEOUT_MS = 15_000;

export type WhatsAppClientErrorCode = "INVALID_MESSAGE" | "NOT_CONFIGURED" | "SEND_FAILED";

export class WhatsAppClientError extends Error {
  constructor(
    readonly code: WhatsAppClientErrorCode,
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "WhatsAppClientError";
  }
}

export async function sendWhatsAppTextMessage(recipient: string, text: string): Promise<void> {
  if (!recipient.trim() || !text.trim()) {
    throw new WhatsAppClientError(
      "INVALID_MESSAGE",
      "A recipient and message text are required.",
      false,
    );
  }

  const { accessToken, enabled, graphApiVersion, phoneNumberId } = whatsappConfig;
  if (!enabled || !accessToken || !graphApiVersion || !phoneNumberId) {
    throw new WhatsAppClientError("NOT_CONFIGURED", "WhatsApp messaging is not configured.", false);
  }

  const url = new URL(
    `${encodeURIComponent(graphApiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
    META_GRAPH_API_BASE_URL,
  );

  let response: Response;
  try {
    response = await fetch(url, {
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        text: { body: text, preview_url: false },
        to: recipient,
        type: "text",
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(META_REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new WhatsAppClientError("SEND_FAILED", "The WhatsApp message could not be sent.", true);
  }

  if (!response.ok) {
    throw new WhatsAppClientError(
      "SEND_FAILED",
      "The WhatsApp message could not be sent.",
      response.status === 429 || response.status >= 500,
    );
  }
}

export async function sendWhatsAppProductMessage(
  recipient: string,
  productRetailerId: string,
): Promise<void> {
  if (!recipient.trim() || !productRetailerId.trim()) {
    throw new WhatsAppClientError(
      "INVALID_MESSAGE",
      "A recipient and product identifier are required.",
      false,
    );
  }

  const { accessToken, catalogId, enabled, graphApiVersion, phoneNumberId } = whatsappConfig;
  if (!enabled || !accessToken || !graphApiVersion || !phoneNumberId || !catalogId) {
    throw new WhatsAppClientError("NOT_CONFIGURED", "WhatsApp messaging is not configured.", false);
  }

  const url = new URL(
    `${encodeURIComponent(graphApiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
    META_GRAPH_API_BASE_URL,
  );

  let response: Response;
  try {
    response = await fetch(url, {
      body: JSON.stringify({
        interactive: {
          action: { catalog_id: catalogId, product_retailer_id: productRetailerId },
          type: "product",
        },
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "interactive",
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(META_REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new WhatsAppClientError(
      "SEND_FAILED",
      "The WhatsApp product card could not be sent.",
      true,
    );
  }

  if (!response.ok) {
    throw new WhatsAppClientError(
      "SEND_FAILED",
      "The WhatsApp product card could not be sent.",
      response.status === 429 || response.status >= 500,
    );
  }
}
