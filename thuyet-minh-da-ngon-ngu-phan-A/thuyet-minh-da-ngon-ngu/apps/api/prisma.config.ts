import { defineConfig } from "prisma/config";

// Prisma 7: URL cua DB khai bao o day (khong con nam trong schema.prisma)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx src/seed.ts" },
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
});
