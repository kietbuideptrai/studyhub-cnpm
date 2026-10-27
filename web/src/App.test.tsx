import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiSamples from "../../docs/api-samples.json";
import { MemoryRouter } from "react-router";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FontSizeProvider } from "./context/FontSizeContext";

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FontSizeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FontSizeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.stubEnv("VITE_DEMO_MODE", "false");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("artifact detail page", () => {
  it("shows a not-found message when the API returns 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(apiSamples.notFound), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderApp("/artifacts/missing-artifact?lang=en");

    expect(
      await screen.findByRole("heading", {
        name: "Không tìm thấy hiện vật",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText("Không có hiện vật với mã missing-artifact."),
    ).toBeTruthy();
  });

  it("shows the missing-translation notice when translation is null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(apiSamples.artifactWithoutTranslation), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderApp("/artifacts/tank-001?lang=vi");

    expect(
      await screen.findByRole("heading", {
        name: "Chưa có thuyết minh bằng Tiếng Việt",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(/Bạn có thể xem thuyết minh bằng một trong các ngôn ngữ/),
    ).toBeTruthy();
  });

  it("uses the documented artifact response as the fetch mock", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(apiSamples.artifactDetail), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderApp("/artifacts/tank-001?lang=en");

    expect(
      await screen.findByRole("heading", { name: "Historic tank" }),
    ).toBeTruthy();
    expect(
      screen.getByText("A historic vehicle in the collection."),
    ).toBeTruthy();
  });
});
