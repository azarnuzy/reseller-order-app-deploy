import { queryOptions } from "@tanstack/react-query";
import { getProductBySku } from "../product-api";

export const productQueryKey = ["products"] as const;

export function productBySkuQueryOptions(sku: string) {
  return queryOptions({
    queryKey: [...productQueryKey, sku],
    queryFn: () => getProductBySku(sku),
    retry: false,
  });
}
