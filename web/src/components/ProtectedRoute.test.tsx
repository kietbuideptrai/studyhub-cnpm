import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "./AdminPages";

beforeEach(() => {
  window.localStorage.clear();
});

describe("ProtectedRoute", () => {
  it("redirects unauthenticated visitors to the admin login page", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthProvider>
          <Routes>
            <Route path="/admin/login" element={<h1>Đăng nhập quản trị</h1>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<h1>Nội dung quản trị</h1>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Đăng nhập quản trị" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Nội dung quản trị" }),
    ).toBeNull();
  });
});
