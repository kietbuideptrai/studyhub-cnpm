import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp, type TestCtx } from "./testApp.js";

let ctx: TestCtx;
beforeAll(async () => {
  ctx = await createTestApp();
});
afterAll(async () => {
  await ctx.cleanup();
});

describe("GET /health", () => {
  it("tra ve status ok", async () => {
    const res = await request(ctx.app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/v1/languages", () => {
  it("tra ve 4 ngon ngu theo thu tu vi, en, ja, ko", async () => {
    const res = await request(ctx.app).get("/api/v1/languages");
    expect(res.status).toBe(200);
    expect(res.body.data.map((l: { code: string }) => l.code)).toEqual(["vi", "en", "ja", "ko"]);
    expect(res.body.data[0]).toEqual({
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      ttsLocale: "vi-VN",
    });
  });

  it("an ngon ngu bi tat (isActive = false)", async () => {
    await ctx.prisma.language.create({
      data: {
        code: "fr",
        name: "French",
        nativeName: "Français",
        ttsLocale: "fr-FR",
        isActive: false,
      },
    });
    const res = await request(ctx.app).get("/api/v1/languages");
    expect(res.body.data.map((l: { code: string }) => l.code)).not.toContain("fr");
    const bad = await request(ctx.app).get("/api/v1/spots?lang=fr");
    expect(bad.status).toBe(400);
  });
});

describe("GET /api/v1/spots", () => {
  it("mac dinh tra tieng Viet, khong kem narration", async () => {
    const res = await request(ctx.app).get("/api/v1/spots");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(6);
    const first = res.body.data[0];
    expect(first.title).toBe("Dinh Độc Lập");
    expect(first.lang).toBe("vi");
    expect(first.fallback).toBe(false);
    expect(first).not.toHaveProperty("narration");
    expect(first.availableLanguages).toEqual(["en", "ja", "ko", "vi"]);
  });

  it("tra dung ngon ngu theo ?lang=", async () => {
    const en = await request(ctx.app).get("/api/v1/spots?lang=en");
    expect(en.body.data[0].title).toBe("Independence Palace");
    const ja = await request(ctx.app).get("/api/v1/spots?lang=ja");
    expect(ja.body.data[0].title).toBe("独立宮殿");
  });

  it("loc theo ?q= khong phan biet hoa thuong", async () => {
    const res = await request(ctx.app).get("/api/v1/spots?lang=en&q=MARKET");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe("cho-ben-thanh");
  });

  it("400 khi ngon ngu khong ho tro", async () => {
    const res = await request(ctx.app).get("/api/v1/spots?lang=xx");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_LANG");
  });

  it("fallback ve tieng Viet khi thieu ban dich", async () => {
    const spot = await ctx.prisma.spot.create({
      data: { slug: "diem-moi", qrCode: "TM-900", latitude: 10, longitude: 106 },
    });
    await ctx.prisma.spotTranslation.create({
      data: {
        spotId: spot.id,
        languageCode: "vi",
        title: "Điểm mới",
        summary: "s",
        narration: "n",
      },
    });
    const res = await request(ctx.app).get(`/api/v1/spots/${spot.id}?lang=ko`);
    expect(res.status).toBe(200);
    expect(res.body.data.lang).toBe("vi");
    expect(res.body.data.fallback).toBe(true);
    expect(res.body.data.title).toBe("Điểm mới");
  });
});

describe("GET /api/v1/spots/:idOrSlug", () => {
  it("lay theo id, kem narration", async () => {
    const res = await request(ctx.app).get("/api/v1/spots/1?lang=ko");
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("독립궁");
    expect(res.body.data.narration.length).toBeGreaterThan(50);
    expect(res.body.data.latitude).toBeCloseTo(10.777, 3);
  });

  it("lay theo slug", async () => {
    const res = await request(ctx.app).get("/api/v1/spots/nha-tho-duc-ba?lang=en");
    expect(res.body.data.title).toBe("Saigon Notre-Dame Cathedral");
  });

  it("404 khi khong ton tai", async () => {
    const res = await request(ctx.app).get("/api/v1/spots/99999");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("SPOT_NOT_FOUND");
  });
});

describe("GET /api/v1/spots/qr/:code", () => {
  it("tim diem theo ma QR", async () => {
    const res = await request(ctx.app).get("/api/v1/spots/qr/TM-004?lang=en");
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("cho-ben-thanh");
    expect(res.body.data.title).toBe("Ben Thanh Market");
  });

  it("404 khi ma QR la", async () => {
    const res = await request(ctx.app).get("/api/v1/spots/qr/KHONG-CO");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("SPOT_NOT_FOUND");
  });
});

describe("CORS", () => {
  it("cho phep origin trong danh sach", async () => {
    const res = await request(ctx.app)
      .get("/api/v1/languages")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("cho phep ban preview *.vercel.app", async () => {
    const o = "https://thuyet-minh-git-feat-abc.vercel.app";
    const res = await request(ctx.app).get("/api/v1/languages").set("Origin", o);
    expect(res.headers["access-control-allow-origin"]).toBe(o);
  });

  it("khong cap header cho origin la", async () => {
    const res = await request(ctx.app)
      .get("/api/v1/languages")
      .set("Origin", "https://evil.example");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("Swagger / OpenAPI", () => {
  it("/openapi.json co du 4 endpoint doc du lieu", async () => {
    const res = await request(ctx.app).get("/openapi.json");
    expect(res.status).toBe(200);
    expect(Object.keys(res.body.paths)).toEqual(
      expect.arrayContaining([
        "/api/v1/languages",
        "/api/v1/spots",
        "/api/v1/spots/{idOrSlug}",
        "/api/v1/spots/qr/{code}",
      ]),
    );
  });

  it("/docs hien giao dien Swagger UI", async () => {
    const res = await request(ctx.app).get("/docs/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger-ui");
  });
});

describe("Du lieu seed", () => {
  it("moi diem co du 4 ngon ngu va ma QR khong trung", async () => {
    const spots = await ctx.prisma.spot.findMany({
      where: { slug: { not: "diem-moi" } },
      include: { translations: true },
    });
    expect(spots.length).toBeGreaterThanOrEqual(5);
    for (const s of spots) expect(s.translations).toHaveLength(4);
    const codes = spots.map((s) => s.qrCode);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("Duong dan khong ton tai", () => {
  it("tra 404 theo dinh dang loi chung", async () => {
    const res = await request(ctx.app).get("/api/v1/khong-co");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
