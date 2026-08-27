import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { invalidRequest } from "../../request-validation";
import { catalogProductParamsSchema } from "./schema";
import { buildProductCatalogFeedCsv, getCatalogProductBySku } from "./service";

export const catalogRouter = new Hono()
  .get("/feed.csv", async (c) => {
    const csv = await buildProductCatalogFeedCsv();
    return c.text(csv, 200, { "Content-Type": "text/csv; charset=utf-8" });
  })
  .get(
    "/products/:sku",
    zValidator("param", catalogProductParamsSchema, invalidRequest),
    async (c) => {
      const { sku } = c.req.valid("param");
      return c.json({ product: await getCatalogProductBySku(sku) }, 200);
    },
  );
