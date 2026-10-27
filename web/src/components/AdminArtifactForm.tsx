import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  ADMIN_LANGUAGES,
  createAdminArtifact,
  getAdminArtifact,
  saveAdminArtifactTranslation,
  updateAdminArtifact,
} from "../api/adminClient";
import type {
  AdminArtifactInput,
  AdminArtifactTranslation,
} from "../api/adminClient";
import { useAuth } from "../context/AuthContext";
import { getLanguageLabel } from "../utils/language";

type TranslationLanguage = (typeof ADMIN_LANGUAGES)[number];

interface TranslationFields {
  title: string;
  summary: string;
  content: string;
}

interface ArtifactFields extends AdminArtifactInput {}

const EMPTY_TRANSLATION: TranslationFields = {
  title: "",
  summary: "",
  content: "",
};

const EMPTY_TRANSLATIONS: Record<TranslationLanguage, TranslationFields> = {
  vi: { ...EMPTY_TRANSLATION },
  en: { ...EMPTY_TRANSLATION },
  zh: { ...EMPTY_TRANSLATION },
  ja: { ...EMPTY_TRANSLATION },
  ko: { ...EMPTY_TRANSLATION },
};

const EMPTY_ARTIFACT: ArtifactFields = {
  name: "",
  slug: "",
  category: "",
  image_url: "",
};

interface AdminArtifactFormPageProps {
  mode: "create" | "edit";
}

function isTranslationLanguage(value: string): value is TranslationLanguage {
  return ADMIN_LANGUAGES.some((language) => language === value);
}

function parseAdminArtifact(value: unknown): {
  artifact: ArtifactFields;
  translations: Record<TranslationLanguage, TranslationFields>;
  isPublished: boolean | null;
} {
  if (typeof value !== "object" || value === null) {
    throw new Error("Dữ liệu hiện vật từ máy chủ không hợp lệ.");
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.name !== "string" ||
    typeof record.slug !== "string" ||
    typeof record.category !== "string" ||
    typeof record.image_url !== "string"
  ) {
    throw new Error("Dữ liệu hiện vật từ máy chủ không đầy đủ.");
  }
  if (
    record.is_published !== undefined &&
    typeof record.is_published !== "boolean"
  ) {
    throw new Error("Trạng thái hiện vật từ máy chủ không hợp lệ.");
  }

  const translations = { ...EMPTY_TRANSLATIONS };
  if (record.translations !== undefined) {
    if (!Array.isArray(record.translations)) {
      throw new Error("Danh sách bản dịch từ máy chủ không hợp lệ.");
    }

    for (const translation of record.translations) {
      if (typeof translation !== "object" || translation === null) {
        throw new Error("Dữ liệu bản dịch từ máy chủ không hợp lệ.");
      }

      const item = translation as Record<string, unknown>;
      if (
        typeof item.language_code !== "string" ||
        !isTranslationLanguage(item.language_code) ||
        typeof item.title !== "string" ||
        typeof item.summary !== "string" ||
        typeof item.content !== "string"
      ) {
        throw new Error("Dữ liệu bản dịch từ máy chủ không đầy đủ.");
      }

      translations[item.language_code] = {
        title: item.title,
        summary: item.summary,
        content: item.content,
      };
    }
  }

  return {
    artifact: {
      name: record.name,
      slug: record.slug,
      category: record.category,
      image_url: record.image_url,
    },
    translations,
    isPublished:
      typeof record.is_published === "boolean" ? record.is_published : null,
  };
}

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-");
}

function hasTranslationContent(translation: TranslationFields): boolean {
  return Object.values(translation).some((value) => value.trim().length > 0);
}

export function AdminArtifactFormPage({
  mode,
}: AdminArtifactFormPageProps) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [artifact, setArtifact] = useState<ArtifactFields>(EMPTY_ARTIFACT);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [translations, setTranslations] =
    useState<Record<TranslationLanguage, TranslationFields>>(
      EMPTY_TRANSLATIONS,
    );
  const [activeLanguage, setActiveLanguage] =
    useState<TranslationLanguage>("vi");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(() => {
    const navigationState: unknown = location.state;
    if (
      typeof navigationState === "object" &&
      navigationState !== null &&
      "successMessage" in navigationState &&
      typeof navigationState.successMessage === "string"
    ) {
      return navigationState.successMessage;
    }

    return null;
  });
  const [isDirty, setIsDirty] = useState(false);
  const [savedSlug, setSavedSlug] = useState("");
  const [hasManualSlug, setHasManualSlug] = useState(false);
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const currentArtifactId = useRef(id);
  const dirtyRef = useRef(isDirty);
  const configuredPublicUrl = import.meta.env.VITE_PUBLIC_URL?.trim();
  const publicBaseUrl = (configuredPublicUrl || window.location.origin).replace(
    /\/+$/u,
    "",
  );
  const publicArtifactUrl = artifact.slug.trim()
    ? `${publicBaseUrl}/artifacts/${encodeURIComponent(artifact.slug.trim())}`
    : "";

  useEffect(() => {
    currentArtifactId.current = id;
  }, [id]);

  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  const loadArtifact = useCallback(async () => {
    if (mode !== "edit" || !id || !token) {
      return;
    }

    setIsLoading(true);
    setHasLoadError(false);
    setErrorMessage(null);

    try {
      const response: unknown = await getAdminArtifact(id, token);
      if (
        typeof response !== "object" ||
        response === null ||
        !("id" in response) ||
        response.id !== id
      ) {
        throw new Error("Máy chủ trả về hiện vật không khớp với mã yêu cầu.");
      }
      const parsed = parseAdminArtifact(response);
      setArtifact(parsed.artifact);
      setSavedSlug(parsed.artifact.slug);
      setIsPublished(parsed.isPublished);
      setTranslations(parsed.translations);
      setHasManualSlug(true);
      setHasImageLoadError(false);
      setIsDirty(false);
    } catch (error) {
      setHasLoadError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải hiện vật. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, mode, token]);

  useEffect(() => {
    if (mode === "edit") {
      void loadArtifact();
    }
  }, [loadArtifact, mode]);

  useEffect(() => {
    let isCancelled = false;
    setQrDataUrl(null);
    setQrErrorMessage(null);

    if (mode !== "edit" || !publicArtifactUrl) {
      setIsQrLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    setIsQrLoading(true);
    QRCode.toDataURL(publicArtifactUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 256,
    })
      .then((dataUrl) => {
        if (!isCancelled) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setQrErrorMessage("Không thể tạo mã QR. Vui lòng thử lại.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsQrLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [mode, publicArtifactUrl]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirtyRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    function handleInternalLinkClick(event: globalThis.MouseEvent) {
      if (
        !dirtyRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const logoutButton = target.closest<HTMLButtonElement>(
        ".admin-logout-button",
      );
      if (logoutButton) {
        if (
          !window.confirm(
            "Bạn có thay đổi chưa lưu. Đăng xuất và bỏ thay đổi?",
          )
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin ||
        link.href === window.location.href
      ) {
        return;
      }

      if (!window.confirm("Bạn có thay đổi chưa lưu. Rời trang và bỏ thay đổi?")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    function handlePopState() {
      if (
        dirtyRef.current &&
        !window.confirm("Bạn có thay đổi chưa lưu. Rời trang và bỏ thay đổi?")
      ) {
        window.history.forward();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleInternalLinkClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleInternalLinkClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (mode === "edit" && !id) {
    return <Navigate to="/admin" replace />;
  }

  function updateArtifactField(
    field: keyof ArtifactFields,
    value: string,
  ): void {
    setArtifact((currentArtifact) => ({
      ...currentArtifact,
      [field]: value,
    }));
    setIsDirty(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (field === "slug") {
      setLinkMessage(null);
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>): void {
    const name = event.currentTarget.value;
    setArtifact((currentArtifact) => ({
      ...currentArtifact,
      name,
      slug: hasManualSlug ? currentArtifact.slug : slugFromName(name),
    }));
    setIsDirty(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setLinkMessage(null);
  }

  async function copyPublicArtifactUrl(): Promise<void> {
    if (!publicArtifactUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(publicArtifactUrl);
      setLinkMessage("Đã sao chép đường dẫn công khai.");
    } catch {
      setLinkMessage(
        "Không thể sao chép đường dẫn. Hãy chọn và sao chép URL hiển thị.",
      );
    }
  }

  function openPublicArtifact(): void {
    if (publicArtifactUrl) {
      window.open(publicArtifactUrl, "_blank", "noopener,noreferrer");
    }
  }

  function updateTranslationField(
    field: keyof TranslationFields,
    value: string,
  ): void {
    setTranslations((currentTranslations) => ({
      ...currentTranslations,
      [activeLanguage]: {
        ...currentTranslations[activeLanguage],
        [field]: value,
      },
    }));
    setIsDirty(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const name = artifact.name.trim();
    const slug = sanitizeSlug(artifact.slug);
    if (!name) {
      setErrorMessage("Vui lòng nhập tên hiện vật.");
      return;
    }
    if (!slug) {
      setErrorMessage("Vui lòng nhập slug gồm chữ thường, số và dấu gạch ngang.");
      return;
    }
    if (!token) {
      setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSaving(true);
    try {
      const artifactInput: AdminArtifactInput = {
        name,
        slug,
        category: artifact.category.trim(),
        image_url: artifact.image_url.trim(),
      };

      let savedArtifactId = currentArtifactId.current;
      if (savedArtifactId) {
        await updateAdminArtifact(savedArtifactId, artifactInput, token);
      } else {
        const createdArtifact: unknown = await createAdminArtifact(
          artifactInput,
          token,
        );
        if (
          typeof createdArtifact !== "object" ||
          createdArtifact === null ||
          !("id" in createdArtifact) ||
          typeof createdArtifact.id !== "string" ||
          createdArtifact.id.trim().length === 0
        ) {
          throw new Error("Máy chủ chưa trả về id hiện vật hợp lệ.");
        }
        savedArtifactId = createdArtifact.id;
        currentArtifactId.current = savedArtifactId;
      }

      const translationsToSave = ADMIN_LANGUAGES.filter((language) =>
        hasTranslationContent(translations[language]),
      );
      for (const language of translationsToSave) {
        const translation: AdminArtifactTranslation = {
          language_code: language,
          title: translations[language].title.trim(),
          summary: translations[language].summary.trim(),
          content: translations[language].content.trim(),
        };
        await saveAdminArtifactTranslation(savedArtifactId, translation, token);
      }

      setArtifact((currentArtifact) => ({ ...currentArtifact, slug }));
      setSavedSlug(slug);
      setIsDirty(false);
      dirtyRef.current = false;
      setSuccessMessage("Đã lưu hiện vật và các bản dịch có nội dung.");
      if (mode === "create") {
        navigate(`/admin/artifacts/${encodeURIComponent(savedArtifactId)}/edit`, {
          replace: true,
          state: {
            successMessage: "Đã tạo hiện vật và lưu các bản dịch có nội dung.",
          },
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu hiện vật. Vui lòng thử lại.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AdminArtifactFormState
        title="Đang tải hiện vật..."
        role="status"
      />
    );
  }

  if (hasLoadError) {
    return (
      <AdminArtifactFormState
        title="Không thể tải hiện vật"
        message={errorMessage ?? undefined}
        action={
          <button
            className="button button-primary"
            onClick={() => void loadArtifact()}
            type="button"
          >
            Thử lại
          </button>
        }
      />
    );
  }

  return (
    <section className="page-section content-width admin-form-page">
      <Link
        className="admin-back-link"
        to="/admin"
      >
        ← Về danh sách quản trị
      </Link>
      <p className="eyebrow">KHU VỰC QUẢN TRỊ</p>
      <h1>{mode === "create" ? "Thêm hiện vật" : "Chỉnh sửa hiện vật"}</h1>

      <form className="admin-artifact-form" onSubmit={handleSave}>
        <section className="admin-form-section" aria-labelledby="artifact-fields">
          <h2 id="artifact-fields">Thông tin hiện vật</h2>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-full" htmlFor="artifact-name">
              Tên hiện vật <span aria-hidden="true">*</span>
              <input
                autoComplete="off"
                id="artifact-name"
                maxLength={200}
                onChange={handleNameChange}
                required
                value={artifact.name}
              />
            </label>

            <label className="admin-field" htmlFor="artifact-slug">
              Slug <span aria-hidden="true">*</span>
              <input
                autoComplete="off"
                id="artifact-slug"
                onChange={(event) => {
                  setHasManualSlug(true);
                  updateArtifactField(
                    "slug",
                    sanitizeSlug(event.currentTarget.value).replace(/^-+/g, ""),
                  );
                }}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
                value={artifact.slug}
              />
              <span className="admin-field-hint">
                Chỉ dùng chữ thường không dấu, số và dấu gạch ngang.
              </span>
            </label>

            <label className="admin-field" htmlFor="artifact-category">
              Danh mục
              <input
                id="artifact-category"
                onChange={(event) =>
                  updateArtifactField("category", event.currentTarget.value)
                }
                value={artifact.category}
              />
            </label>

            <label className="admin-field admin-field-full" htmlFor="artifact-image-url">
              Đường dẫn ảnh (image_url)
              <input
                autoComplete="url"
                id="artifact-image-url"
                inputMode="url"
                onChange={(event) => {
                  updateArtifactField("image_url", event.currentTarget.value);
                  setHasImageLoadError(false);
                }}
                placeholder="https://example.com/image.jpg"
                type="url"
                value={artifact.image_url}
              />
            </label>
          </div>

          {artifact.image_url.trim() ? (
            <div className="admin-image-preview">
              <span className="admin-field-label">Xem trước ảnh</span>
              {hasImageLoadError ? (
                <p className="admin-image-error" role="status">
                  Không thể tải ảnh xem trước từ đường dẫn này.
                </p>
              ) : (
                <img
                  alt={`Xem trước ${artifact.name || "ảnh hiện vật"}`}
                  onError={() => setHasImageLoadError(true)}
                  onLoad={() => setHasImageLoadError(false)}
                  src={artifact.image_url}
                />
              )}
            </div>
          ) : (
            <p className="admin-image-empty" role="status">
              Chưa có ảnh để xem trước.
            </p>
          )}
        </section>

        {mode === "edit" && publicArtifactUrl ? (
          <section
            className="admin-form-section artifact-link-section"
            aria-labelledby="artifact-link-title"
          >
            <h2 id="artifact-link-title">Liên kết công khai</h2>
            <p className="artifact-public-url">
              <a
                href={publicArtifactUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {publicArtifactUrl}
              </a>
            </p>
            {artifact.slug !== savedSlug ? (
              <p className="admin-field-hint">
                Slug có thay đổi chưa lưu. Đường dẫn này sẽ có hiệu lực sau khi
                lưu hiện vật.
              </p>
            ) : null}
            {isPublished === false ? (
              <p className="admin-form-message admin-form-warning" role="status">
                Hiện vật đang ẩn; khách truy cập chưa xem được đường dẫn này.
              </p>
            ) : null}
            <div className="artifact-link-actions">
              <button
                className="button admin-cancel-button"
                onClick={() => void copyPublicArtifactUrl()}
                type="button"
              >
                Sao chép
              </button>
              <button
                className="button admin-cancel-button"
                onClick={openPublicArtifact}
                type="button"
              >
                Mở trong tab mới
              </button>
            </div>
            {linkMessage ? (
              <p className="admin-form-message admin-form-success" role="status">
                {linkMessage}
              </p>
            ) : null}
            <div className="artifact-qr-preview">
              <span className="admin-field-label">Mã QR</span>
              {isQrLoading ? (
                <p className="admin-field-hint" role="status">
                  Đang tạo mã QR...
                </p>
              ) : qrErrorMessage ? (
                <p className="admin-image-error" role="alert">
                  {qrErrorMessage}
                </p>
              ) : qrDataUrl ? (
                <>
                  <img
                    alt={`Mã QR dẫn đến ${publicArtifactUrl}`}
                    height={256}
                    src={qrDataUrl}
                    width={256}
                  />
                  <a
                    className="button button-primary artifact-qr-download"
                    download={`${artifact.slug}-qr.png`}
                    href={qrDataUrl}
                  >
                    Tải PNG
                  </a>
                </>
              ) : null}
            </div>
          </section>
        ) : null}

        <section
          className="admin-form-section"
          aria-labelledby="translation-fields"
        >
          <h2 id="translation-fields">Bản dịch</h2>
          <div
            aria-label="Ngôn ngữ bản dịch"
            className="translation-tabs"
            role="tablist"
          >
            {ADMIN_LANGUAGES.map((language) => {
              const hasContent = hasTranslationContent(translations[language]);
              return (
                <button
                  aria-controls={`translation-panel-${language}`}
                  aria-selected={activeLanguage === language}
                  className="translation-tab"
                  id={`translation-tab-${language}`}
                  key={language}
                  onClick={() => setActiveLanguage(language)}
                  role="tab"
                  type="button"
                >
                  {getLanguageLabel(language)}
                  {hasContent ? (
                    <span
                      aria-label="Có nội dung"
                      className="translation-tab-dot"
                      role="img"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div
            aria-labelledby={`translation-tab-${activeLanguage}`}
            className="translation-panel"
            id={`translation-panel-${activeLanguage}`}
            role="tabpanel"
          >
            <label className="admin-field" htmlFor={`translation-title-${activeLanguage}`}>
              Tiêu đề (title)
              <input
                id={`translation-title-${activeLanguage}`}
                onChange={(event) =>
                  updateTranslationField("title", event.currentTarget.value)
                }
                value={translations[activeLanguage].title}
              />
            </label>
            <label className="admin-field" htmlFor={`translation-summary-${activeLanguage}`}>
              Mô tả ngắn (summary)
              <textarea
                id={`translation-summary-${activeLanguage}`}
                onChange={(event) =>
                  updateTranslationField("summary", event.currentTarget.value)
                }
                rows={3}
                value={translations[activeLanguage].summary}
              />
            </label>
            <label className="admin-field" htmlFor={`translation-content-${activeLanguage}`}>
              Nội dung thuyết minh (content)
              <textarea
                id={`translation-content-${activeLanguage}`}
                onChange={(event) =>
                  updateTranslationField("content", event.currentTarget.value)
                }
                rows={9}
                value={translations[activeLanguage].content}
              />
            </label>
          </div>
        </section>

        {errorMessage ? (
          <p className="admin-form-message admin-form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="admin-form-message admin-form-success" role="status">
            {successMessage}
          </p>
        ) : null}

        <div className="admin-form-actions">
          <Link
            className="button admin-cancel-button"
            to="/admin"
          >
            Hủy
          </Link>
          <button
            className="button button-primary admin-save-button"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Đang lưu..." : "Lưu hiện vật"}
          </button>
        </div>
      </form>
    </section>
  );
}

interface AdminArtifactFormStateProps {
  title: string;
  message?: string;
  role?: "status" | "alert";
  action?: ReactNode;
}

function AdminArtifactFormState({
  title,
  message,
  role = "alert",
  action,
}: AdminArtifactFormStateProps) {
  return (
    <section className="page-section content-width">
      <div className="empty-state" role={role}>
        <h1>{title}</h1>
        {message ? <p>{message}</p> : null}
        {action}
      </div>
    </section>
  );
}
