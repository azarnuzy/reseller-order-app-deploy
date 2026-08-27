import { useTranslation } from "@repo/i18n";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, MessageCircleIcon, PackageXIcon, ShoppingBagIcon } from "lucide-react";
import { HeaderControls } from "../app-shell/header-controls";
import { productBySkuQueryOptions } from "./hooks/use-product";
import { buildWhatsAppOrderLink } from "./whatsapp-link";

const routeApi = getRouteApi("/products/$sku");

export function ProductPage() {
  const { sku } = routeApi.useParams();
  const { t } = useTranslation();
  const { data: product } = useQuery(productBySkuQueryOptions(sku));

  if (product === undefined) {
    return null;
  }

  return (
    <div className="h-dvh overflow-y-auto bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
              <ShoppingBagIcon className="size-4" />
            </span>
            <span className="truncate font-semibold">{t("nav.brand")}</span>
          </Link>
          <HeaderControls />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          to="/"
        >
          <ArrowLeftIcon className="size-4" />
          {t("product.back")}
        </Link>

        {product ? <ProductDetail product={product} /> : <ProductNotFound />}
      </main>
    </div>
  );
}

type CatalogProduct = {
  currency: string;
  description: string;
  discountedPrice: number;
  discountPercentage: number;
  price: number;
  sku: string;
  thumbnail: string;
  title: string;
};

function ProductDetail({ product }: { product: CatalogProduct }) {
  const { t } = useTranslation();
  const hasDiscount = product.discountPercentage > 0;
  const whatsappLink = buildWhatsAppOrderLink(
    t("product.whatsappMessage", { sku: product.sku, title: product.title }),
  );

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="relative grid place-items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 dark:from-blue-950/50 dark:via-slate-900 dark:to-indigo-950/40 sm:p-12">
          {hasDiscount ? (
            <Badge className="absolute left-6 top-6 bg-white text-blue-600 shadow-sm hover:bg-white">
              -{formatPercent(product.discountPercentage)}
            </Badge>
          ) : null}
          <img
            alt={product.title}
            className="aspect-square w-full max-w-sm object-contain"
            src={product.thumbnail}
          />
        </div>

        <div className="grid content-start gap-5 px-6 py-9 sm:px-10 sm:py-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-600">
              {product.sku}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            {hasDiscount ? (
              <span className="text-lg text-slate-400 line-through">
                {money(product.price, product.currency)}
              </span>
            ) : null}
            <span className="text-3xl font-bold text-blue-600">
              {money(product.discountedPrice, product.currency)}
            </span>
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {product.description}
          </p>

          <Button asChild className="mt-2 w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto" size="lg">
            <a href={whatsappLink} rel="noreferrer" target="_blank">
              <MessageCircleIcon className="size-4" />
              {t("product.orderCta")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductNotFound() {
  const { t } = useTranslation();

  return (
    <section className="mt-8 grid place-items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <PackageXIcon className="size-10 text-slate-400" />
      <h1 className="text-xl font-bold">{t("product.notFound.title")}</h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        {t("product.notFound.description")}
      </p>
    </section>
  );
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { currency, style: "currency" }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}
