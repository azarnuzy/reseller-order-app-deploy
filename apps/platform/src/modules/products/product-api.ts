import { createApiClient, fetchProductBySku } from "@repo/api-client";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const apiClient = createApiClient(apiBaseUrl);

export async function getProductBySku(sku: string) {
  return fetchProductBySku(apiClient, sku);
}
