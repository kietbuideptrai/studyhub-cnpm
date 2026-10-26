import { pool } from "../db/pool";

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

interface ArtifactDetailRow extends Omit<ArtifactDetail, "available_languages"> {
  available_languages: string[];
}

export function isLanguage(value: string): value is Language {
  return ["vi", "en", "zh", "ja", "ko"].includes(value);
}

export async function getArtifacts(
  language: Language,
  query?: string,
): Promise<ArtifactListItem[]> {
  const searchTerm = query?.trim();
  const searchCondition = searchTerm
    ? `AND (
        POSITION(LOWER($2) IN LOWER(translations.title)) > 0
        OR POSITION(LOWER($2) IN LOWER(artifacts.name)) > 0
      )`
    : "";
  const parameters: string[] = searchTerm
    ? [language, searchTerm]
    : [language];

  const result = await pool.query<ArtifactListItem>(
    `SELECT
       artifacts.slug,
       artifacts.image_url,
       translations.title,
       translations.summary
     FROM artifacts
     INNER JOIN artifact_translations AS translations
       ON translations.artifact_id = artifacts.id
       AND translations.language_code = $1
     WHERE artifacts.is_published = TRUE
       ${searchCondition}
     ORDER BY translations.title ASC`,
    parameters,
  );

  return result.rows;
}

export async function getArtifactBySlug(
  slug: string,
  language: Language,
): Promise<ArtifactDetail | undefined> {
  const result = await pool.query<ArtifactDetailRow>(
    `SELECT
       artifacts.slug,
       artifacts.image_url,
       (
         SELECT json_build_object(
           'language_code', translation.language_code,
           'title', translation.title,
           'summary', translation.summary,
           'content', translation.content
         )
         FROM artifact_translations AS translation
         WHERE translation.artifact_id = artifacts.id
           AND translation.language_code = $2
       ) AS translation,
       ARRAY(
         SELECT available_translation.language_code
         FROM artifact_translations AS available_translation
         WHERE available_translation.artifact_id = artifacts.id
         ORDER BY available_translation.language_code
       ) AS available_languages
     FROM artifacts
     WHERE artifacts.slug = $1
       AND artifacts.is_published = TRUE`,
    [slug, language],
  );

  const artifact = result.rows[0];
  if (!artifact) {
    return undefined;
  }

  return {
    ...artifact,
    available_languages: artifact.available_languages.map((availableLanguage) => {
      if (!isLanguage(availableLanguage)) {
        throw new Error(
          `Unsupported language code in artifact translations: ${availableLanguage}`,
        );
      }

      return availableLanguage;
    }),
  };
}
