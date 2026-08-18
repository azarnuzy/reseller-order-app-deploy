import { createFileRoute } from "@tanstack/react-router";
import { DataDeletionPage } from "../modules/legal/data-deletion-page";

export const Route = createFileRoute("/data-deletion")({
  component: DataDeletionPage,
});
