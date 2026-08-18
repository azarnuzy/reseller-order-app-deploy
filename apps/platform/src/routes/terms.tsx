import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "../modules/legal/terms-page";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});
