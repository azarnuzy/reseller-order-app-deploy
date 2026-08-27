import { app, events, getCreatedNoteCount } from "./app";

async function show(label: string, path: string, init: RequestInit = {}) {
  events.length = 0;

  const headers = new Headers(init.headers);
  headers.set("X-Request-Id", "req-demo-001");

  const response = await app.request(path, { ...init, headers });

  console.log(`\n${label}`);
  console.log("status:", response.status);
  console.log("body:", await response.text());
  console.log("events:", events);
  console.log("createdNoteCount:", getCreatedNoteCount());
}

async function main() {
  await show("HEALTH", "/health");

  await show("CREATE VALID", "/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Catatan baru" }),
  });

  await show("CREATE INVALID", "/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });

  await show("CREATE OVERSIZED", "/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "x".repeat(100) }),
  });

  await show("UNKNOWN ROUTE", "/tidak-ada");
  await show("UNEXPECTED ERROR", "/boom");
}

main().catch(console.error);
