# Tiến độ phần A (Tech Lead / DevOps / Backend): tuần 1 đến 7

Đối chiếu với `Ke_hoach_lam_viec_nhom`. Kế hoạch lưu ý nhóm bắt đầu ngày 8/9 nên tuần 1–3 phải gộp làm
1 tuần; bảng dưới giữ nguyên thứ tự công việc của kế hoạch.

**Chú thích trạng thái:** ✅ xong và đã kiểm chứng ở máy phát triển · 🟡 đã viết sẵn, **cần A thao tác trên
dịch vụ ngoài** (cần tài khoản/token, xem mục "Việc A phải tự làm") · 👥 việc cả nhóm.

| Tuần | Việc theo kế hoạch                                 | Trạng thái | Sản phẩm / bằng chứng                                                                                                   |
| ---- | -------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1    | Monorepo pnpm                                      | ✅         | `package.json`, `pnpm-workspace.yaml`, cấu trúc `apps/*`, `packages/*`                                                  |
| 1    | ESLint / Prettier                                  | ✅         | `eslint.config.js`, `.prettierrc`, husky + lint-staged (`.husky/pre-commit`)                                            |
| 1    | Tạo repo, mời B/C, branch protection, board Kanban | 🟡         | `scripts/setup-github.sh` (bảo vệ `main`, label, 19 issue khởi đầu), `CONTRIBUTING.md`, template PR/issue, `CODEOWNERS` |
| 1    | Họp chốt tính năng                                 | 👥         | `docs/meetings/2026-09-08-kickoff.md` (bản nháp để chốt), `_template.md`                                                |
| 2    | ERD 3 bảng                                         | ✅         | `docs/erd.md`, `apps/api/prisma/schema.prisma`                                                                          |
| 2    | Express + Prisma + seed                            | ✅         | `apps/api/src/*`, migration `20260910000000_init`, seed 6 điểm × 4 ngôn ngữ, chạy lại nhiều lần không trùng             |
| 2    | **CI** (lint, typecheck, test, build)              | ✅/🟡      | `.github/workflows/ci.yml`; các bước tương ứng đã chạy đạt ở máy; cần đẩy lên GitHub để thấy xanh                       |
| 2    | SRS 2–3 trang (cả nhóm)                            | 👥         | `docs/srs.md` (A soạn khung, B và C bổ sung)                                                                            |
| 3    | 4 endpoint + Swagger                               | ✅         | `apps/api/src/routes.ts`, `openapi.yaml`, `/docs`, `docs/api-contract.md`                                               |
| 3    | Deploy BE lên Render                               | 🟡         | `render.yaml`, `docs/deploy.md` mục 1, `scripts/smoke-test.sh`                                                          |
| 4    | **CD web** (Vercel, preview mỗi PR)                | 🟡         | `.github/workflows/deploy-web.yml`, `apps/web/vercel.json`                                                              |
| 4    | CORS và biến môi trường                            | ✅         | `src/app.ts` (whitelist + regex preview, có test), `.env.example`, bảng biến trong `docs/deploy.md`                     |
| 5    | **EAS Build** từ GitHub Actions, xuất APK          | 🟡         | `.github/workflows/eas-build.yml`, `apps/mobile/eas.json`                                                               |
| 6    | Test API cơ bản, CI xanh                           | ✅         | 20 test (`api.test.ts`), `docs/testing.md`; lint, format, typecheck, test, build đều đạt                                |
| 6    | Sửa lỗi tích hợp                                   | 🟡         | Phụ thuộc FE nối API thật; dùng `smoke-test.sh` và Swagger để khoanh vùng lỗi                                           |
| 7    | Chuẩn bị demo, kiểm tra link web/APK, README       | ✅/🟡      | `docs/demo-checklist.md`, `README.md`; link thật điền sau khi deploy                                                    |

## Đã kiểm chứng những gì (ở máy phát triển)

- `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test` (**20/20**), `pnpm build`: đều đạt.
- Chạy bản build `node dist/server.js` + seed 2 lần liên tiếp (idempotent) + `smoke-test.sh`: **13/13** đạt.
- Cú pháp YAML của 3 workflow, `render.yaml`, `openapi.yaml` và cú pháp `setup-github.sh` hợp lệ.

**Chưa kiểm chứng được (cần môi trường thật):** chạy workflow trên GitHub, deploy Render/Vercel, build EAS,
và lệnh `prisma migrate deploy`. Máy phát triển của mình không tải được engine migrate của Prisma, nên
test áp dụng trực tiếp file `migration.sql`. Migration này viết tay theo đúng định dạng Prisma sinh ra;
lần đầu chạy thật hãy kiểm tra `pnpm --filter @tm/api db:deploy` (xem "Lưu ý").

## Việc A phải tự làm (cần tài khoản của nhóm)

Làm theo thứ tự. Việc 1–3 nên xong trong 48 giờ đầu.

1. **Tạo repo GitHub** (nên public để có branch protection), mời B và C. Đẩy code:
   ```bash
   git init -b main && git add -A && git commit -m "chore: khoi tao monorepo, backend va CI/CD"
   git remote add origin git@github.com:<owner>/<repo>.git && git push -u origin main
   ```
2. **Chạy `GH_A=.. GH_B=.. GH_C=.. ./scripts/setup-github.sh <owner>/<repo>`**: bật branch protection (required check `quality`),
   tạo label và issue. Sau đó sửa `.github/CODEOWNERS` thay `@A-username…` bằng tài khoản thật. Tạo board Kanban
   (GitHub → Projects → Board) và kéo issue vào.
3. **Kiểm tra CI:** mở 1 PR nhỏ, xác nhận check **`quality`** xanh, rồi bật required check (script đã thiết lập).
4. **Render** (tuần 3): làm theo `docs/deploy.md` mục 1; cập nhật URL thật ở README, `openapi.yaml`, `eas.json`.
5. **Vercel + 3 secret** (tuần 4, sau khi C có `apps/web`): `docs/deploy.md` mục 2; điền `CORS_ORIGINS` trên Render.
6. **EXPO_TOKEN + build APK** (tuần 5, sau khi B có `apps/mobile`): `docs/deploy.md` mục 3.
7. **Tuần 7:** làm theo `docs/demo-checklist.md`, chạy `smoke-test.sh` bản Render, lưu APK vào Drive.

## Gợi ý chia commit/PR để lịch sử rõ ràng

Mỗi mục là 1 nhánh + 1 PR (kể cả khi bạn là người viết, hãy nhờ B hoặc C review theo quy tắc nhóm):

| Nhánh                  | Nội dung                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `chore/monorepo-setup` | Monorepo, ESLint, Prettier, husky, `CONTRIBUTING.md`, templates |
| `docs/erd-api-draft`   | `docs/erd.md`, `docs/api-contract.md`, `openapi.yaml`, SRS nháp |
| `feat/api-core`        | Prisma schema, migration, seed, 4 endpoint, Swagger             |
| `ci/github-actions`    | `ci.yml`                                                        |
| `test/api-integration` | Test API, `docs/testing.md`                                     |
| `ci/web-cd`            | `deploy-web.yml`, `vercel.json`, CORS regex preview             |
| `ci/eas-build`         | `eas-build.yml`, `eas.json`                                     |
| `docs/demo-midterm`    | `demo-checklist.md`, `smoke-test.sh`, README                    |

Nếu đã đẩy toàn bộ trong 1 commit thì hãy chia lại các PR về sau; **không sửa ngày commit** cho "đẹp"
vì thầy có thể xem lịch sử thật.

## Lưu ý kỹ thuật cho A

- **Prisma 7** không còn khai báo URL trong `schema.prisma` mà ở `prisma.config.ts`, và dùng driver adapter
  (`@prisma/adapter-libsql`) nên không cần engine Rust lúc chạy. Nếu `db:deploy` báo lỗi lần đầu, chạy
  `pnpm --filter @tm/api exec prisma migrate dev --name init` ở máy có mạng để Prisma tự sinh lại migration,
  rồi thay thư mục `prisma/migrations/20260910000000_init`.
- Prisma được **ghim phiên bản 7.10.1** (client, adapter và CLI phải trùng nhau). Đừng chạy `pnpm up` tùy tiện.
- Khi B và C thêm package, mỗi package nên có script `lint`/`typecheck`/`test`/`build` (tùy loại) để CI tự áp dụng.
- Render free mất DB khi restart (đã xử lý bằng migrate + seed lúc khởi động). Khi làm trang admin (Could), đổi sang PostgreSQL.

## Phần báo cáo cuối kỳ do A viết (ghi chú từ bây giờ)

Kiến trúc (`docs/architecture.md`), thiết kế DB (`docs/erd.md`), CI/CD (`docs/ci-cd.md`), kiểm thử (`docs/testing.md`).
Đây là tài liệu nguồn, khi viết báo cáo chỉ cần trình bày lại, thêm ảnh chụp CI xanh, Swagger, Actions và APK.
