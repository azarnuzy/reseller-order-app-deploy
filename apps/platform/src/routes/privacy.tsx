import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "../modules/privacy/privacy-page";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});
