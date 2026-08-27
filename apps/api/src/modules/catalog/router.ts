import { Hono } from "hono";
import { buildProductCatalogFeedCsv } from "./service";

export const catalogRouter = new Hono().get("/feed.csv", async (c) => {
  const csv = await buildProductCatalogFeedCsv();
  return c.text(csv, 200, { "Content-Type": "text/csv; charset=utf-8" });
});
