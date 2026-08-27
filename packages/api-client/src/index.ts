import { hc } from "hono/client";
import type { AppType } from "@repo/api";

export function createApiClient(baseUrl: string) {
  return hc<AppType>(baseUrl);
}

export type ApiClient = ReturnType<typeof createApiClient>;

export type UpdateProfileInput = {
  image?: string | null;
  name: string;
};

export async function fetchCurrentUser(client: ApiClient) {
  const response = await client.profile.$get();

  if (!response.ok) {
    throw new Error("Failed to load current user.");
  }

  const data = await response.json();

  return data.user;
}

export async function updateCurrentUserProfile(client: ApiClient, input: UpdateProfileInput) {
  const response = await client.profile.$patch({
    json: input,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile.");
  }

  const data = await response.json();

  return data.user;
}

export async function fetchProductBySku(client: ApiClient, sku: string) {
  const response = await client.api.catalog.products[":sku"].$get({ param: { sku } });

  if ((response.status as number) === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product.");
  }

  const data = await response.json();

  return data.product;
}
