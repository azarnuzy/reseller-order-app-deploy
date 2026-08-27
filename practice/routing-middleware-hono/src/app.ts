import { zValidator } from "@hono/zod-validator";
import { Hono, type MiddlewareHandler } from "hono";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";

type AppEnv = {
  Variables: {
    requestId: string;
  };
};

type Note = {
  id: string;
  title: string;
};

export const events: string[] = [];

const notes = new Map<string, Note>([
  ["note-1", { id: "note-1", title: "Belajar Hono" }],
]);

let createdNoteCount = 0;

export function getCreatedNoteCount() {
  return createdNoteCount;
}

const requestIdMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const requestId = c.req.header("X-Request-Id") ?? "generated-demo-id";
  c.set("requestId", requestId);
  events.push(`request before · ${requestId}`);

  await next();

  c.header("X-Request-Id", requestId);
  events.push(`request after · ${requestId}`);
};

const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(40),
});

const notesRouter = new Hono<AppEnv>();

notesRouter.get("/:noteId", (c) => {
  events.push("handler · get note");
  const note = notes.get(c.req.param("noteId"));

  if (!note) {
    return c.json(
      {
        error: {
          code: "NOTE_NOT_FOUND",
          message: "Note tidak ditemukan.",
        },
      },
      404,
    );
  }

  return c.json({ note }, 200);
});

notesRouter.post(
  "/",
  bodyLimit({
    maxSize: 64,
    onError: (c) =>
      c.json(
        {
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: "Body maksimal 64 byte.",
          },
        },
        413,
      ),
  }),
  zValidator("json", createNoteSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "Title wajib diisi.",
          },
        },
        400,
      );
    }
  }),
  (c) => {
    events.push("handler · create note");
    createdNoteCount += 1;

    const note = {
      id: `note-${notes.size + 1}`,
      title: c.req.valid("json").title,
    };

    notes.set(note.id, note);
    return c.json({ note }, 201);
  },
);

export const app = new Hono<AppEnv>();

app.use("*", requestIdMiddleware);

app.get("/health", (c) => {
  events.push("handler · health");
  return c.json({ ok: true }, 200);
});

app.route("/api/notes", notesRouter);
app.get("/boom", () => {
  throw new Error("detail internal untuk demo");
});

app.notFound((c) =>
  c.json(
    {
      error: {
        code: "NOT_FOUND",
        message: "Route tidak ditemukan.",
      },
    },
    404,
  ),
);

app.onError((_error, c) =>
  c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Terjadi kesalahan tak terduga.",
      },
    },
    500,
  ),
);
