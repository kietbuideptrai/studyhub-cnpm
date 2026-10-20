import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/client.js";

export type Db = PrismaClient;

/** Tao PrismaClient (Prisma 7 dung driver adapter, khong con query engine Rust). */
export function createPrisma(url: string): Db {
  return new PrismaClient({ adapter: new PrismaLibSql({ url }) });
}
