import { createFileRoute } from "@tanstack/react-router";
import { productBySkuQueryOptions } from "../modules/products/hooks/use-product";
import { ProductPage } from "../modules/products/product-page";

export const Route = createFileRoute("/products/$sku")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(productBySkuQueryOptions(params.sku));
  },
  component: ProductPage,
});
