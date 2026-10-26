import "dotenv/config";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to start the backend");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
  max: 10,
});

pool.on("error", (error) => {
  console.error("Unexpected error from an idle PostgreSQL client", error);
});
