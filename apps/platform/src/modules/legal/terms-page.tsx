import { useTranslation } from "@repo/i18n";
import { ScrollTextIcon } from "lucide-react";
import { LegalDocumentPage } from "./legal-document-page";

const sectionNames = [
  "acceptance",
  "service",
  "orders",
  "ai",
  "acceptableUse",
  "thirdParties",
  "privacy",
  "disclaimers",
  "liability",
  "changes",
  "contact",
] as const;

export function TermsPage() {
  const { t } = useTranslation();

  return (
    <LegalDocumentPage
      backLabel={t("terms.back")}
      description={t("terms.description")}
      effectiveDate={t("terms.effectiveDate")}
      eyebrow={t("terms.eyebrow")}
      icon={ScrollTextIcon}
      sections={sectionNames.map((section) => ({
        body: t(`terms.sections.${section}.body`),
        title: t(`terms.sections.${section}.title`),
      }))}
      summary={t("terms.summary")}
      title={t("terms.title")}
    />
  );
}
