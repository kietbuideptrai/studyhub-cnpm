import { readFileSync } from "node:fs";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import type { Config } from "./config.js";
import type { Db } from "./db.js";
import { errorHandler, notFoundHandler } from "./errors.js";
import { apiRouter } from "./routes.js";

export type AppOptions = Pick<Config, "corsOrigins" | "corsOriginRegex">;

const openapiDoc = parse(
  readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8"),
) as Record<string, unknown>;

export function createApp(prisma: Db, opts: AppOptions) {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin(origin, cb) {
        // Mobile app / curl khong gui header Origin -> cho qua
        if (!origin) return cb(null, true);
        const ok =
          opts.corsOrigins.includes("*") ||
          opts.corsOrigins.includes(origin) ||
          (opts.corsOriginRegex?.test(origin) ?? false);
        cb(null, ok);
      },
      methods: ["GET", "HEAD", "OPTIONS"],
    }),
  );

  app.get("/health", async (_req, res) => {
    await prisma.language.count();
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/openapi.json", (_req, res) => res.json(openapiDoc));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
  app.get("/", (_req, res) => res.redirect("/docs"));

  app.use("/api/v1", apiRouter(prisma));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
