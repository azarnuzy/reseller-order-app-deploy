import type { ProductResponse } from "../products/types";

export type CatalogFeedRow = {
  id: string;
  title: string;
  description: string;
  availability: "in stock" | "out of stock";
  condition: "new";
  price: string;
  link: string;
  imageLink: string;
};

export type CatalogProductResponse = ProductResponse & { currency: string };
