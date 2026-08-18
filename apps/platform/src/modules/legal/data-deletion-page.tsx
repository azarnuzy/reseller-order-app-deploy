import { useTranslation } from "@repo/i18n";
import { UserRoundXIcon } from "lucide-react";
import { LegalDocumentPage } from "./legal-document-page";

const sectionNames = [
  "request",
  "verification",
  "scope",
  "retention",
  "thirdParties",
  "confirmation",
  "contact",
] as const;

export function DataDeletionPage() {
  const { t } = useTranslation();

  return (
    <LegalDocumentPage
      backLabel={t("dataDeletion.back")}
      description={t("dataDeletion.description")}
      effectiveDate={t("dataDeletion.effectiveDate")}
      eyebrow={t("dataDeletion.eyebrow")}
      icon={UserRoundXIcon}
      sections={sectionNames.map((section) => ({
        body: t(`dataDeletion.sections.${section}.body`),
        title: t(`dataDeletion.sections.${section}.title`),
      }))}
      summary={t("dataDeletion.summary")}
      title={t("dataDeletion.title")}
    />
  );
}
