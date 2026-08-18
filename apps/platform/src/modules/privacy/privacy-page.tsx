import { useTranslation } from "@repo/i18n";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, ShieldCheckIcon, ShoppingBagIcon } from "lucide-react";
import { HeaderControls } from "../app-shell/header-controls";

const sectionNames = [
  "collection",
  "usage",
  "ai",
  "sharing",
  "retention",
  "choices",
  "transfers",
  "updates",
  "contact",
] as const;

export function PrivacyPage() {
  const { t } = useTranslation();

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
          {t("privacy.back")}
        </Link>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-9 dark:border-slate-800 dark:from-blue-950/50 dark:via-slate-900 dark:to-indigo-950/40 sm:px-10 sm:py-12">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <ShieldCheckIcon className="size-4" />
              {t("privacy.eyebrow")}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("privacy.title")}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {t("privacy.description")}
            </p>
            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("privacy.effectiveDate")}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <p className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
              {t("privacy.summary")}
            </p>

            <div className="mt-10 grid gap-9">
              {sectionNames.map((section) => (
                <section className="grid gap-3" key={section}>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t(`privacy.sections.${section}.title`)}
                  </h2>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                    {t(`privacy.sections.${section}.body`)}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
