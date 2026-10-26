import { Router } from "express";
import { asyncHandler, HttpError } from "../middleware/errors";
import {
  getArtifactBySlug,
  getArtifacts,
  isLanguage,
} from "../services/artifacts.service";
import type { Language } from "../services/artifacts.service";

export const artifactsRouter = Router();

artifactsRouter.get(
  "/",
  asyncHandler(async (request, response) => {
    const language = getRequestedLanguage(request.query.lang);
    const query = request.query.q;
    if (query !== undefined && typeof query !== "string") {
      throw new HttpError(400, "Tham số q không hợp lệ");
    }

    response.json(await getArtifacts(language, query));
  }),
);

artifactsRouter.get(
  "/:slug",
  asyncHandler(async (request, response) => {
    const language = getRequestedLanguage(request.query.lang);
    const artifact = await getArtifactBySlug(request.params.slug, language);
    if (!artifact) {
      throw new HttpError(404, "Không tìm thấy hiện vật");
    }

    response.json(artifact);
  }),
);

function getRequestedLanguage(requestedLanguage: unknown): Language {
  if (requestedLanguage === undefined) {
    return "vi";
  }

  if (typeof requestedLanguage !== "string" || !isLanguage(requestedLanguage)) {
    throw new HttpError(400, "Ngôn ngữ không hợp lệ");
  }

  return requestedLanguage;
}
