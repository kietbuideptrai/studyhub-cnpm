import { Router } from "express";

export const languagesRouter = Router();

const languages = [
  { language_code: "vi", name: "Tiếng Việt" },
  { language_code: "en", name: "English" },
  { language_code: "zh", name: "中文" },
  { language_code: "ja", name: "日本語" },
  { language_code: "ko", name: "한국어" },
] as const;

languagesRouter.get("/", (_request, response) => {
  response.json(languages);
});
