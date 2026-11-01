import { useCallback, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAdminArtifacts,
  updateAdminArtifactPublished,
} from "../api/adminClient";
import type { AdminArtifactListItem } from "../api/adminClient";
import { FontSizePicker } from "./FontSizePicker";

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = location.state as LoginLocationState | null;
  const requestedPath = locationState?.from;
  const requestedPathname = requestedPath?.pathname;
  const returnTo =
    (requestedPathname === "/admin" ||
      requestedPathname?.startsWith("/admin/")) &&
    requestedPathname !== "/admin/login"
      ? `${requestedPathname}${requestedPath?.search ?? ""}${requestedPath?.hash ?? ""}`
      : "/admin";

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(returnTo, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <Link className="admin-back-link" to="/">
          ← Về trang chủ
        </Link>
        <p className="eyebrow">KHU VỰC QUẢN TRỊ</p>
        <h1 id="admin-login-title">Đăng nhập quản trị</h1>
        <p className="admin-login-description">
          Đăng nhập để tiếp tục đến trang quản trị nội dung.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            autoComplete="username"
            autoFocus
            id="admin-email"
            name="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            type="email"
            value={email}
          />

          <label htmlFor="admin-password">Mật khẩu</label>
          <input
            autoComplete="current-password"
            id="admin-password"
            name="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            type="password"
            value={password}
          />

          {errorMessage ? (
            <p className="admin-login-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="button button-primary admin-login-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </section>
    </main>
  );
}

export function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header admin-header">
        <Link className="brand" to="/admin" aria-label="Trang quản trị">
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <span>Quản trị nội dung</span>
        </Link>
        <div className="header-preferences admin-header-preferences">
          <FontSizePicker />
        </div>
        <button
          className="button admin-logout-button"
          onClick={logout}
          type="button"
        >
          Đăng xuất
        </button>
      </header>
      <Outlet />
      <footer className="site-footer">
        <span>Di sản kể chuyện · Quản trị nội dung</span>
      </footer>
    </div>
  );
}

export function AdminDashboard() {
  const { token } = useAuth();
  const [artifacts, setArtifacts] = useState<AdminArtifactListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [updatingArtifactIds, setUpdatingArtifactIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const loadArtifacts = useCallback(async () => {
    if (!token) {
      setLoadError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      setArtifacts(await getAdminArtifacts(token));
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách hiện vật.",
      );
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [token]);

  useEffect(() => {
    void loadArtifacts();
  }, [loadArtifacts, requestVersion]);

  function retryLoad(): void {
    setIsRetrying(true);
    setRequestVersion((version) => version + 1);
  }

  async function togglePublished(artifact: AdminArtifactListItem) {
    const nextPublishedState = !artifact.is_published;
    const action = nextPublishedState ? "hiện" : "ẩn";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${action} hiện vật “${artifact.name}” không?`,
      )
    ) {
      return;
    }

    if (!token || updatingArtifactIds.has(artifact.id)) {
      return;
    }

    setRowErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[artifact.id];
      return nextErrors;
    });
    setStatusMessage(null);
    setUpdatingArtifactIds((currentIds) => new Set(currentIds).add(artifact.id));
    setArtifacts((currentArtifacts) =>
      currentArtifacts.map((currentArtifact) =>
        currentArtifact.id === artifact.id
          ? { ...currentArtifact, is_published: nextPublishedState }
          : currentArtifact,
      ),
    );

    try {
      await updateAdminArtifactPublished(
        artifact.id,
        nextPublishedState,
        token,
      );
      setStatusMessage(
        `Đã ${nextPublishedState ? "hiện" : "ẩn"} hiện vật “${artifact.name}”.`,
      );
    } catch (error) {
      setArtifacts((currentArtifacts) =>
        currentArtifacts.map((currentArtifact) =>
          currentArtifact.id === artifact.id
            ? { ...currentArtifact, is_published: artifact.is_published }
            : currentArtifact,
        ),
      );
      setRowErrors((currentErrors) => ({
        ...currentErrors,
        [artifact.id]:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật trạng thái hiện vật.",
      }));
    } finally {
      setUpdatingArtifactIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(artifact.id);
        return nextIds;
      });
    }
  }

  return (
    <main className="page-section content-width admin-content">
      <p className="eyebrow">KHU VỰC QUẢN TRỊ</p>
      <h1>Quản lý nội dung</h1>
      <p className="admin-dashboard-description">
        Thêm hoặc chỉnh sửa thông tin hiện vật và nội dung thuyết minh đa ngôn
        ngữ.
      </p>
      <Link
        className="button button-primary admin-create-artifact-link"
        to="/admin/artifacts/new"
      >
        Thêm hiện vật
      </Link>

      <section className="admin-artifact-list" aria-labelledby="admin-artifacts-title">
        <h2 id="admin-artifacts-title">Danh sách hiện vật</h2>
        {statusMessage ? (
          <p className="admin-form-message admin-form-success" role="status">
            {statusMessage}
          </p>
        ) : null}
        {isLoading ? (
          <div className="loading-state" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            <span>Đang tải hiện vật...</span>
          </div>
        ) : loadError ? (
          <div className="empty-state error-state" role="alert">
            <h3>Không thể tải danh sách hiện vật</h3>
            <p>{loadError}</p>
            <button
              className="button button-primary"
              disabled={isRetrying}
              onClick={retryLoad}
              type="button"
            >
              {isRetrying ? "Đang thử lại..." : "Thử lại"}
            </button>
          </div>
        ) : artifacts.length === 0 ? (
          <div className="empty-state" role="status">
            <h3>Chưa có hiện vật</h3>
            <p>Thêm hiện vật đầu tiên để bắt đầu quản lý nội dung.</p>
            <Link
              className="button button-primary"
              to="/admin/artifacts/new"
            >
              Thêm hiện vật
            </Link>
          </div>
        ) : (
          <div className="admin-artifact-table-wrapper">
            <table className="admin-artifact-table">
              <thead>
                <tr>
                  <th scope="col">Tên hiện vật</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Danh mục</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">
                    <span className="visually-hidden">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {artifacts.map((artifact) => {
                  const isUpdating = updatingArtifactIds.has(artifact.id);
                  return (
                    <tr key={artifact.id}>
                      <th scope="row">
                        <Link
                          className="admin-artifact-name"
                          to={`/admin/artifacts/${encodeURIComponent(artifact.id)}/edit`}
                        >
                          {artifact.name}
                        </Link>
                        {rowErrors[artifact.id] ? (
                          <span
                            className="admin-artifact-row-error"
                            role="alert"
                          >
                            {rowErrors[artifact.id]}
                          </span>
                        ) : null}
                      </th>
                      <td>{artifact.slug}</td>
                      <td>{artifact.category || "—"}</td>
                      <td>
                        <span
                          className={`admin-published-status ${
                            artifact.is_published
                              ? "is-published"
                              : "is-unpublished"
                          }`}
                        >
                          {artifact.is_published ? "Đang hiện" : "Đang ẩn"}
                        </span>
                      </td>
                      <td>
                        <button
                          aria-label={`${artifact.is_published ? "Ẩn" : "Hiện"} hiện vật ${artifact.name}`}
                          className="admin-visibility-button"
                          disabled={isUpdating}
                          onClick={() => void togglePublished(artifact)}
                          type="button"
                        >
                          {isUpdating
                            ? "Đang cập nhật..."
                            : artifact.is_published
                              ? "Ẩn"
                              : "Hiện"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
