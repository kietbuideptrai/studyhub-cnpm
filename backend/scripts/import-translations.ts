import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { pool } from "../src/db/pool";

const LANGUAGES = ["vi", "en", "zh", "ja", "ko"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface CsvRow {
  slug?: string;
  language_code?: string;
  title?: string;
  summary?: string;
  content?: string;
  name?: string;
  image_url?: string;
  category?: string;
}

interface TranslationRow {
  line: number;
  slug: string;
  language: string;
  title: string;
  summary: string;
  content: string;
}

interface ArtifactMeta {
  name: string;
  imageUrl: string;
  category: string;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filePath = args.find((arg) => !arg.startsWith("--"));

  if (!filePath) {
    console.error("Thiếu đường dẫn file CSV. Ví dụ: npm run import:translations -- data/noi-dung-bao-tang.csv --dry-run");
    process.exit(1);
  }

  let rows: CsvRow[];
  try {
    const fileContent = readFileSync(filePath, "utf8");
    rows = parse(fileContent, {
      columns: true,
      bom: true,
      skip_empty_lines: true,
      relax_column_count: false,
    }) as CsvRow[];
  } catch (error) {
    console.error(`Không thể đọc file CSV: ${error.message}`);
    process.exit(1);
  }

  const errors: string[] = [];
  const translations: TranslationRow[] = [];
  const metaBySlug = new Map<string, ArtifactMeta>();
  const seen = new Set<string>();
  let skipped = 0;

  rows.forEach((row, index) => {
    const line = index + 2; // dòng 1 là tiêu đề
    const slug = (row.slug ?? "").trim();
    const language = (row.language_code ?? "").trim().toLowerCase();
    const title = (row.title ?? "").trim();
    const summary = (row.summary ?? "").trim();
    const content = (row.content ?? "").trim();

    if (!title && !summary && !content) {
      skipped += 1;
      return;
    }

    if (!SLUG_PATTERN.test(slug)) {
      errors.push(`Dòng ${line}: slug "${slug}" không hợp lệ (chỉ chữ thường, số, dấu gạch ngang)`);
      return;
    }
    if (!LANGUAGES.includes(language)) {
      errors.push(`Dòng ${line}: mã ngôn ngữ "${language}" sai (chỉ nhận ${LANGUAGES.join(", ")})`);
      return;
    }

    const missing = [
      !title && "title",
      !summary && "summary",
      !content && "content",
    ].filter(Boolean);
    if (missing.length > 0) {
      errors.push(`Dòng ${line} (${slug}/${language}): thiếu ${missing.join(", ")}`);
      return;
    }

    const key = `${slug}/${language}`;
    if (seen.has(key)) {
      errors.push(`Dòng ${line}: trùng cặp ${key} trong file`);
      return;
    }
    seen.add(key);
    translations.push({ line, slug, language, title, summary, content });

    const name = (row.name ?? "").trim();
    const imageUrl = (row.image_url ?? "").trim();
    const category = (row.category ?? "").trim();
    if (name || imageUrl || category) {
      metaBySlug.set(slug, { name, imageUrl, category });
    }
  });

  const slugs = [...new Set(translations.map((item) => item.slug))];
  const idBySlug = new Map<string, string>();
  if (slugs.length > 0) {
    try {
      const found = await pool.query<{ id: string; slug: string }>(
        "SELECT id, slug FROM artifacts WHERE slug = ANY($1)",
        [slugs],
      );
      found.rows.forEach((row) => idBySlug.set(row.slug, row.id));
    } catch (error) {
      console.error(`Lỗi khi truy vấn database: ${error.message}`);
      await pool.end();
      process.exit(1);
    }
  }

  translations.forEach((item) => {
    if (!idBySlug.has(item.slug)) {
      errors.push(`Dòng ${item.line}: slug "${item.slug}" chưa có trong bảng artifacts`);
    }
  });

  if (errors.length > 0) {
    console.error(`Phát hiện ${errors.length} lỗi, chưa ghi gì vào database:`);
    errors.forEach((message) => console.error(" - " + message));
    await pool.end();
    process.exit(1);
  }

  console.log(`Đọc ${rows.length} dòng: ${translations.length} bản dịch hợp lệ, ${skipped} dòng trống bị bỏ qua.`);

  if (dryRun) {
    console.log("Chế độ --dry-run: không ghi vào database.");
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [slug, meta] of metaBySlug) {
      await client.query(
        `UPDATE artifacts
            SET name = COALESCE(NULLIF($2, ''), name),
                image_url = COALESCE(NULLIF($3, ''), image_url),
                category = COALESCE(NULLIF($4, ''), category),
                updated_at = NOW()
          WHERE slug = $1`,
        [slug, meta.name, meta.imageUrl, meta.category],
      );
    }

    for (const item of translations) {
      await client.query(
        `INSERT INTO artifact_translations (artifact_id, language_code, title, summary, content)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (artifact_id, language_code) DO UPDATE
           SET title = EXCLUDED.title,
               summary = EXCLUDED.summary,
               content = EXCLUDED.content,
               updated_at = NOW()`,
        [idBySlug.get(item.slug), item.language, item.title, item.summary, item.content],
      );
    }

    await client.query("COMMIT");
    console.log(`Đã ghi ${translations.length} bản dịch và cập nhật ${metaBySlug.size} hiện vật.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Lỗi khi ghi vào database: ${error.message}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Import thất bại:", error);
  process.exit(1);
});