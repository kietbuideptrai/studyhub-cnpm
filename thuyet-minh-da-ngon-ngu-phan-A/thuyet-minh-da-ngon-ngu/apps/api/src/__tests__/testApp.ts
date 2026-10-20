import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { createApp } from "../app.js";
import { createPrisma, type Db } from "../db.js";
import { seedDatabase } from "../seedData.js";

const MIGRATIONS = new URL("../../prisma/migrations/", import.meta.url);

export interface TestCtx {
  prisma: Db;
  app: ReturnType<typeof createApp>;
  cleanup: () => Promise<void>;
}

/** DB SQLite tam: ap dung dung cac file migration that, roi seed du lieu that. */
export async function createTestApp(opts?: { seed?: boolean }): Promise<TestCtx> {
  const dir = mkdtempSync(join(tmpdir(), "tm-api-"));
  const url = `file:${join(dir, "test.db")}`;

  const raw = createClient({ url });
  const folders = readdirSync(MIGRATIONS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  for (const f of folders) {
    const sql = readFileSync(new URL(`${f}/migration.sql`, MIGRATIONS), "utf8");
    await raw.executeMultiple(sql);
  }
  raw.close();

  const prisma = createPrisma(url);
  if (opts?.seed !== false) await seedDatabase(prisma);

  const app = createApp(prisma, {
    corsOrigins: ["http://localhost:5173"],
    corsOriginRegex: /^https:\/\/.*\.vercel\.app$/,
  });
  return {
    prisma,
    app,
    cleanup: async () => {
      await prisma.$disconnect();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
