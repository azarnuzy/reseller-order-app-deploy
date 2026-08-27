import type { Product } from "@prisma/client";
import { platformConfig } from "@repo/config";
import { HttpError } from "../../http-error";
import { prisma } from "../../prisma";
import { productResponse } from "../products/service";
import { getStorefront } from "../storefront/service";
import type { CatalogFeedRow, CatalogProductResponse } from "./types";

const CSV_HEADER = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
];

export async function buildProductCatalogFeedCsv(): Promise<string> {
  const [{ currency }, products] = await Promise.all([
    getStorefront(),
    prisma.product.findMany({ orderBy: { id: "asc" }, where: { isOrderable: true } }),
  ]);

  const rows = products.map((product) => toCatalogFeedRow(product, currency));
  return [CSV_HEADER, ...rows.map(rowToFields)].map(toCsvLine).join("\n");
}

function toCatalogFeedRow(product: Product, currency: string): CatalogFeedRow {
  return {
    availability: product.stock > 0 ? "in stock" : "out of stock",
    condition: "new",
    description: product.description,
    id: product.sku,
    imageLink: product.thumbnail,
    link: productPageUrl(product.sku),
    price: `${Number(product.price).toFixed(2)} ${currency}`,
    title: product.title,
  };
}

function rowToFields(row: CatalogFeedRow): string[] {
  return [
    row.id,
    row.title,
    row.description,
    row.availability,
    row.condition,
    row.price,
    row.link,
    row.imageLink,
  ];
}

export async function getCatalogProductBySku(sku: string): Promise<CatalogProductResponse> {
  const [{ currency }, product] = await Promise.all([
    getStorefront(),
    prisma.product.findUnique({
      include: { category: { select: { slug: true } } },
      where: { sku },
    }),
  ]);

  if (!product) {
    throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.", { sku });
  }

  return { ...productResponse(product), currency };
}

function productPageUrl(sku: string): string {
  return `${platformConfig.url.replace(/\/$/, "")}/products/${encodeURIComponent(sku)}`;
}

function toCsvLine(fields: string[]): string {
  return fields.map(csvField).join(",");
}

function csvField(value: string): string {
  return /["\r\n,]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
