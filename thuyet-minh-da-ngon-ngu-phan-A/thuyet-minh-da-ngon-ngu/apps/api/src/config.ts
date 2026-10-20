export interface Config {
  port: number;
  databaseUrl: string;
  corsOrigins: string[];
  corsOriginRegex: RegExp | null;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const list = (env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:8081")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    port: Number(env.PORT ?? 3000),
    databaseUrl: env.DATABASE_URL ?? "file:./dev.db",
    corsOrigins: list,
    corsOriginRegex: env.CORS_ORIGIN_REGEX ? new RegExp(env.CORS_ORIGIN_REGEX) : null,
  };
}
