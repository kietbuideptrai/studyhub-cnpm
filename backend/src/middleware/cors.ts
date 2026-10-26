import type { CorsOptions } from "cors";
import { HttpError } from "./errors";

const localOriginPattern = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
const configuredOrigins = parseConfiguredOrigins(process.env.CORS_ORIGINS);
const allowedOrigins = new Set(configuredOrigins);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new HttpError(403, "Origin không được phép"));
  },
};

function isAllowedOrigin(origin: string): boolean {
  return localOriginPattern.test(origin) || allowedOrigins.has(origin);
}

function parseConfiguredOrigins(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      const parsedOrigin = new URL(origin);
      if (
        (parsedOrigin.protocol !== "http:" && parsedOrigin.protocol !== "https:") ||
        parsedOrigin.origin !== origin
      ) {
        throw new Error(
          `CORS_ORIGINS entries must be exact HTTP(S) origins without paths: ${origin}`,
        );
      }

      return parsedOrigin.origin;
    });
}
