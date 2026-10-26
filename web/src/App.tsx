import {
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router";
import { useState } from "react";
import { useArtifacts } from "./hooks/useArtifacts";
import { useArtifact } from "./hooks/useArtifact";
import { useSpeech } from "./hooks/useSpeech";
import type {
  ArtifactDetail,
  ArtifactListItem,
  Language,
} from "../../shared/types";
import { LanguagePicker } from "./components/LanguagePicker";
import { useLanguage } from "./context/LanguageContext";
import { getLanguageLabel } from "./utils/language";

function AppLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to={{ pathname: "/", search: location.search }}>
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <span>Di sản kể chuyện</span>
        </Link>

        <nav className="primary-nav" aria-label="Điều hướng chính">
          <Link
            aria-current={currentPath === "/" ? "page" : undefined}
            to={{ pathname: "/", search: location.search }}
          >
            Trang chủ
          </Link>
          <Link
            aria-current={currentPath.startsWith("/artifacts") ? "page" : undefined}
            to={{ pathname: "/artifacts", search: location.search }}
          >
            Hiện vật
          </Link>
        </nav>

        <LanguagePicker />
      </header>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artifacts" element={<ArtifactListPage />} />
          <Route path="/artifacts/:slug" element={<ArtifactDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>Khám phá câu chuyện phía sau mỗi hiện vật.</span>
      </footer>
    </div>
  );
}

function HomePage() {
  const location = useLocation();

  return (
    <section className="hero content-width">
      <p className="eyebrow">BẢO TÀNG TRONG TẦM TAY</p>
      <h1>Mỗi hiện vật đều có một câu chuyện.</h1>
      <p className="hero-copy">
        Khám phá những dấu mốc lịch sử qua thuyết minh bằng ngôn ngữ bạn chọn.
      </p>
      <Link
        className="button button-primary"
        to={{ pathname: "/artifacts", search: location.search }}
      >
        Khám phá hiện vật <span aria-hidden="true">→</span>
      </Link>
      <div className="hero-note">
        <span className="status-dot" aria-hidden="true" />
        <span>Nội dung hiện vật sẽ được cập nhật tại đây.</span>
      </div>
    </section>
  );
}

function ArtifactListPage() {
  const location = useLocation();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { state, retry } = useArtifacts(language, searchQuery);

  return (
    <section className="page-section content-width">
      <p className="eyebrow">BỘ SƯU TẬP</p>
      <h1>Hiện vật</h1>
      <div className="artifact-toolbar">
        <label htmlFor="artifact-search">Tìm hiện vật theo tên</label>
        <input
          id="artifact-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          placeholder="Nhập tên hiện vật..."
        />
        {state.status === "success" && (
          <span className="results-count" aria-live="polite">
            {state.data.length} hiện vật
          </span>
        )}
      </div>
      {state.status === "loading" ? (
        <div className="loading-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Đang tải danh sách hiện vật...</span>
        </div>
      ) : state.status === "error" ? (
        <div className="empty-state error-state" role="alert">
          <span className="empty-icon" aria-hidden="true">
            !
          </span>
          <h2>Không thể tải danh sách hiện vật</h2>
          <p>{state.error.message}</p>
          <button className="button button-primary" type="button" onClick={retry}>
            Thử lại
          </button>
        </div>
      ) : state.data.length > 0 ? (
        <div className="artifact-grid">
          {state.data.map((artifact) => (
            <ArtifactCard
              key={artifact.slug}
              artifact={artifact}
              language={language}
              search={location.search}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true">
            ◇
          </span>
          <h2>
            {searchQuery.trim()
              ? "Không tìm thấy hiện vật phù hợp"
              : "Chưa có hiện vật bằng ngôn ngữ này"}
          </h2>
          <p>
            {searchQuery.trim()
              ? `Không có kết quả cho “${searchQuery.trim()}”. Hãy thử từ khóa khác.`
              : `Chưa có hiện vật bằng ${getLanguageLabel(language)}.`}
          </p>
          {searchQuery.trim() && (
            <button
              className="text-button"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Xóa từ khóa tìm kiếm
            </button>
          )}
        </div>
      )}
    </section>
  );
}

interface ArtifactCardProps {
  artifact: ArtifactListItem;
  language: Language;
  search: string;
}

function ArtifactCard({ artifact, language, search }: ArtifactCardProps) {
  return (
    <article className="artifact-card">
      <Link
        className="artifact-card-link"
        to={{ pathname: `/artifacts/${artifact.slug}`, search }}
        aria-label={`Xem hiện vật: ${artifact.title}`}
      >
        <ArtifactImage
          className="artifact-image"
          source={artifact.image_url}
          alt={`Ảnh hiện vật ${artifact.title}`}
          loading="lazy"
        />
        <div className="artifact-card-content">
          <span className="artifact-language">{getLanguageLabel(language)}</span>
          <h2>{artifact.title}</h2>
          <p>{artifact.summary}</p>
          <span className="card-more">
            Xem thuyết minh <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

interface ArtifactImageProps {
  source: string;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
}

function ArtifactImage({
  source,
  alt,
  className,
  loading = "eager",
}: ArtifactImageProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  if (hasLoadError) {
    return (
      <div className={`${className} image-placeholder`} role="img" aria-label={alt}>
        <span aria-hidden="true">◇</span>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={source}
      alt={alt}
      loading={loading}
      onError={() => setHasLoadError(true)}
    />
  );
}

function ArtifactDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { state, isNotFound, retry } = useArtifact(slug, language);

  return (
    <section className="page-section content-width">
      <p className="eyebrow">THUYẾT MINH HIỆN VẬT</p>
      {state.status === "loading" ? (
        <div className="loading-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Đang tải thuyết minh...</span>
        </div>
      ) : state.status === "error" ? (
        <div className="empty-state error-state" role="alert">
          <span className="empty-icon" aria-hidden="true">
            !
          </span>
          <h1>{isNotFound ? "Không tìm thấy hiện vật" : "Không thể tải hiện vật"}</h1>
          <p>
            {isNotFound
              ? `Không có hiện vật với mã ${slug}.`
              : state.error.message}
          </p>
          {!isNotFound && (
            <button className="button button-primary" type="button" onClick={retry}>
              Thử lại
            </button>
          )}
          <Link className="text-link" to="/artifacts">
            Quay lại danh sách hiện vật
          </Link>
        </div>
      ) : state.data.translation ? (
        <ArtifactDetailContent artifact={state.data} language={language} />
      ) : (
        <MissingTranslation
          artifact={state.data}
          language={language}
          slug={slug}
        />
      )}
    </section>
  );
}

interface ArtifactDetailContentProps {
  artifact: ArtifactDetail;
  language: Language;
}

function ArtifactDetailContent({
  artifact,
  language,
}: ArtifactDetailContentProps) {
  const translation = artifact.translation;
  if (!translation) {
    return null;
  }

  const paragraphs = translation.content
    .split(/(?<=[.!?])\s+/u)
    .filter((paragraph) => paragraph.trim().length > 0);
  const speech = useSpeech(translation.content, translation.language_code);

  return (
    <article className="artifact-detail">
      <div className="detail-heading">
        <div>
          <span className="artifact-language">{getLanguageLabel(language)}</span>
          <h1>{translation.title}</h1>
          <p className="detail-summary">{translation.summary}</p>
        </div>
        <div className="speech-controls">
          {speech.unavailable ? (
            <p className="speech-message" role="status">
              Thiết bị không có giọng đọc {getLanguageLabel(language)}. Bạn vẫn có
              thể đọc nội dung bên dưới.
            </p>
          ) : (
            <>
              {speech.status === "idle" ? (
                <button
                  className="button button-listen"
                  type="button"
                  onClick={speech.play}
                  aria-label={`Nghe thuyết minh bằng ${getLanguageLabel(language)}`}
                >
                  <span aria-hidden="true">▶</span> Nghe thuyết minh
                </button>
              ) : (
                <>
                  <button
                    className="button button-listen"
                    type="button"
                    onClick={
                      speech.status === "paused"
                        ? speech.resume
                        : speech.pause
                    }
                  >
                    <span aria-hidden="true">
                      {speech.status === "paused" ? "▶" : "Ⅱ"}
                    </span>
                    {speech.status === "paused" ? "Tiếp tục" : "Tạm dừng"}
                  </button>
                  <button
                    className="button button-stop"
                    type="button"
                    onClick={speech.stop}
                  >
                    Dừng
                  </button>
                </>
              )}
            </>
          )}
          {speech.error && (
            <p className="speech-message speech-error" role="alert">
              {speech.error}
            </p>
          )}
        </div>
      </div>
      <ArtifactImage
        className="detail-image"
        source={artifact.image_url}
        alt={`Ảnh hiện vật ${translation.title}`}
      />
      <div className="detail-content" lang={translation.language_code}>
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

interface MissingTranslationProps {
  artifact: ArtifactDetail;
  language: Language;
  slug: string | undefined;
}

function MissingTranslation({
  artifact,
  language,
  slug,
}: MissingTranslationProps) {
  return (
    <div className="translation-missing" role="status">
      <ArtifactImage
        className="missing-image"
        source={artifact.image_url}
        alt={`Ảnh hiện vật ${slug}`}
      />
      <div className="missing-message">
        <span className="eyebrow">BẢN DỊCH CHƯA CÓ</span>
        <h1>Chưa có thuyết minh bằng {getLanguageLabel(language)}</h1>
        <p>
          Hiện vật này chưa có nội dung trong ngôn ngữ đã chọn. Bạn có thể xem
          thuyết minh bằng một trong các ngôn ngữ hiện có:
        </p>
        <div className="available-languages" aria-label="Ngôn ngữ có sẵn">
          {artifact.available_languages.map((availableLanguage) => (
            <Link
              className="language-chip"
              key={availableLanguage}
              to={{
                pathname: `/artifacts/${artifact.slug}`,
                search: `?lang=${availableLanguage}`,
              }}
              aria-current={availableLanguage === language ? "page" : undefined}
            >
              {getLanguageLabel(availableLanguage)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="page-section content-width">
      <div className="empty-state" role="status">
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn này không tồn tại.</p>
        <Link className="text-link" to="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  return <AppLayout />;
}
