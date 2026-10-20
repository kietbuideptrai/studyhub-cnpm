-- CreateTable
CREATE TABLE "languages" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "native_name" TEXT NOT NULL,
    "tts_locale" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "spots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "image_url" TEXT
);

-- CreateTable
CREATE TABLE "spot_translations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spot_id" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "narration" TEXT NOT NULL,
    CONSTRAINT "spot_translations_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "spot_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "spots_slug_key" ON "spots"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spots_qr_code_key" ON "spots"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "spot_translations_spot_id_language_code_key" ON "spot_translations"("spot_id", "language_code");
