export type Language = "vi" | "en" | "zh" | "ja" | "ko";

export interface ArtifactListItem {
  slug: string;
  image_url: string;
  title: string;
  summary: string;
}

export interface Translation {
  language_code: Language;
  title: string;
  summary: string;
  content: string;
}

export interface ArtifactDetail {
  slug: string;
  image_url: string;
  translation: Translation | null;
  available_languages: Language[];
}

export interface ApiError {
  message: string;
}
