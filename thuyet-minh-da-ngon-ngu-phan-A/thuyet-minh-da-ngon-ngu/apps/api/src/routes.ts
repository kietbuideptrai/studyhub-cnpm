import { Router } from "express";
import type { Db } from "./db.js";
import { HttpError } from "./errors.js";

const DEFAULT_LANG = "vi";

/** Doc ?lang= va kiem tra ngon ngu co ton tai + dang bat. */
async function resolveLang(prisma: Db, raw: unknown): Promise<string> {
  const lang = typeof raw === "string" && raw ? raw : DEFAULT_LANG;
  const found = await prisma.language.findFirst({ where: { code: lang, isActive: true } });
  if (!found) {
    throw new HttpError(400, "INVALID_LANG", `Ngôn ngữ '${lang}' chưa được hỗ trợ`);
  }
  return lang;
}

type SpotWithTranslations = Awaited<ReturnType<typeof loadSpot>>;

function loadSpot(prisma: Db, where: { id: number } | { slug: string } | { qrCode: string }) {
  return prisma.spot.findUnique({
    where,
    include: { translations: true },
  });
}

/** Chon ban dich theo lang; thieu thi roi ve tieng Viet (fallback = true). */
function pickTranslation<T extends { languageCode: string }>(list: T[], lang: string) {
  const exact = list.find((t) => t.languageCode === lang);
  if (exact) return { tr: exact, fallback: false };
  const vi = list.find((t) => t.languageCode === DEFAULT_LANG) ?? list[0];
  return { tr: vi, fallback: true };
}

function toDetail(spot: NonNullable<SpotWithTranslations>, lang: string) {
  const { tr, fallback } = pickTranslation(spot.translations, lang);
  if (!tr) throw new HttpError(404, "TRANSLATION_NOT_FOUND", "Điểm chưa có nội dung thuyết minh");
  return {
    id: spot.id,
    slug: spot.slug,
    qrCode: spot.qrCode,
    latitude: spot.latitude,
    longitude: spot.longitude,
    imageUrl: spot.imageUrl,
    lang: tr.languageCode,
    fallback,
    title: tr.title,
    summary: tr.summary,
    narration: tr.narration,
    availableLanguages: spot.translations.map((t) => t.languageCode).sort(),
  };
}

export function apiRouter(prisma: Db) {
  const r = Router();

  r.use((_req, res, next) => {
    res.set("Cache-Control", "public, max-age=60");
    next();
  });

  // 1) Danh sach ngon ngu
  r.get("/languages", async (_req, res) => {
    const rows = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    res.json({
      data: rows.map(({ code, name, nativeName, ttsLocale }) => ({
        code,
        name,
        nativeName,
        ttsLocale,
      })),
    });
  });

  // 2) Danh sach diem (khong tra narration de nhe) - ho tro ?lang= va ?q=
  r.get("/spots", async (req, res) => {
    const lang = await resolveLang(prisma, req.query.lang);
    const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
    const spots = await prisma.spot.findMany({
      orderBy: { id: "asc" },
      include: { translations: true },
    });
    const data = spots
      .map((s) => {
        const { narration: _narration, availableLanguages, ...rest } = toDetail(s, lang);
        return { ...rest, availableLanguages };
      })
      .filter(
        (s) => !q || s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q),
      );
    res.json({ data });
  });

  // 4) Tim diem theo ma QR (dat TRUOC /spots/:idOrSlug de khong bi nuot)
  r.get("/spots/qr/:code", async (req, res) => {
    const lang = await resolveLang(prisma, req.query.lang);
    const spot = await loadSpot(prisma, { qrCode: req.params.code });
    if (!spot) throw new HttpError(404, "SPOT_NOT_FOUND", "Không tìm thấy điểm ứng với mã QR này");
    res.json({ data: toDetail(spot, lang) });
  });

  // 3) Chi tiet diem theo id so hoac slug
  r.get("/spots/:idOrSlug", async (req, res) => {
    const lang = await resolveLang(prisma, req.query.lang);
    const key = req.params.idOrSlug;
    const spot = await loadSpot(prisma, /^\d+$/.test(key) ? { id: Number(key) } : { slug: key });
    if (!spot) throw new HttpError(404, "SPOT_NOT_FOUND", "Không tìm thấy điểm tham quan");
    res.json({ data: toDetail(spot, lang) });
  });

  return r;
}
