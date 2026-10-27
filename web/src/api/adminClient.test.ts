import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADMIN_UNAUTHORIZED_EVENT,
  createAdminArtifact,
  getAdminArtifacts,
  loginAdmin,
  requestAdmin,
  saveAdminArtifactTranslation,
  updateAdminArtifact,
  updateAdminArtifactPublished,
} from "./adminClient";
import { ApiRequestError } from "./client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("admin API client", () => {
  it("posts the email and password to the PRD login endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ token: "admin-token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(loginAdmin("admin@example.com", "secret")).resolves.toEqual({
      token: "admin-token",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "admin@example.com", password: "secret" }),
      }),
    );
  });

  it("surfaces the message field returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Thông tin đăng nhập không đúng." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(loginAdmin("admin@example.com", "wrong")).rejects.toMatchObject({
      message: "Thông tin đăng nhập không đúng.",
      status: 401,
    });
  });

  it("sends the bearer token and dispatches logout on an admin 401", async () => {
    const dispatchEvent = vi.fn();
    vi.stubGlobal("window", { dispatchEvent });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Phiên đăng nhập hết hạn." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(
      requestAdmin("/api/admin/artifacts", "admin-token"),
    ).rejects.toMatchObject({
      message: "Phiên đăng nhập hết hạn.",
      status: 401,
    } satisfies Partial<ApiRequestError>);

    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: ADMIN_UNAUTHORIZED_EVENT }),
    );
  });

  it("uses the PRD create, update, and translation endpoints", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "artifact-id" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    const artifact = {
      name: "Hiện vật",
      slug: "hien-vat",
      category: "Lịch sử",
      image_url: "https://example.test/image.jpg",
    };
    const translation = {
      language_code: "vi" as const,
      title: "Hiện vật",
      summary: "Mô tả",
      content: "Nội dung",
    };

    await expect(createAdminArtifact(artifact, "admin-token")).resolves.toEqual({
      id: "artifact-id",
    });
    await expect(
      updateAdminArtifact("artifact-id", artifact, "admin-token"),
    ).resolves.toBeUndefined();
    await expect(
      saveAdminArtifactTranslation(
        "artifact-id",
        translation,
        "admin-token",
      ),
    ).resolves.toBeUndefined();

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options?.method])).toEqual([
      ["/api/admin/artifacts", "POST"],
      ["/api/admin/artifacts/artifact-id", "PATCH"],
      ["/api/admin/artifacts/artifact-id/translations/vi", "PUT"],
    ]);
    expect(JSON.parse(String(fetchMock.mock.calls[2][1]?.body))).toEqual(
      translation,
    );
    expect(
      new Headers(fetchMock.mock.calls[0][1]?.headers).get("Authorization"),
    ).toBe("Bearer admin-token");
  });

  it("loads and validates the admin artifact list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            artifacts: [
              {
                id: "artifact-id",
                name: "Hiện vật",
                slug: "hien-vat",
                category: "Lịch sử",
                is_published: true,
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(getAdminArtifacts("admin-token")).resolves.toEqual([
      {
        id: "artifact-id",
        name: "Hiện vật",
        slug: "hien-vat",
        category: "Lịch sử",
        is_published: true,
      },
    ]);
  });

  it("patches the publication state with the expected payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      updateAdminArtifactPublished("artifact/id", false, "admin-token"),
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/artifacts/artifact%2Fid",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ is_published: false }),
      }),
    );
  });

  it("rejects malformed artifact list data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([{ id: "missing-fields" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getAdminArtifacts("admin-token")).rejects.toThrow(
      "Dữ liệu hiện vật từ máy chủ không đầy đủ.",
    );
  });
});
