# Thuyết minh tự động đa ngôn ngữ

Đồ án môn Công nghệ phần mềm. Du khách quét mã QR (hoặc chọn từ danh sách) tại một điểm tham quan
và nghe thuyết minh bằng ngôn ngữ của mình (Tiếng Việt, English, 日本語, 한국어).

| Thành phần                                 | Công nghệ                                 | Phụ trách |
| ------------------------------------------ | ----------------------------------------- | --------- |
| `apps/api` Backend tối giản + DB           | Node.js, Express 5, Prisma 7, SQLite      | A         |
| `apps/mobile` Ứng dụng di động             | React Native (Expo) + TypeScript          | B         |
| `apps/web` Web                             | React.js (Vite) + TypeScript              | C         |
| `packages/i18n` Dịch giao diện             | vi / en / ja / ko                         | C         |
| CI/CD (`.github/workflows`, `render.yaml`) | GitHub Actions, Render, Vercel, EAS Build | A         |

> Nguyên tắc: **FE + CI/CD làm kỹ, BE + DB làm vừa đủ chạy.** Dịch nội dung được làm sẵn một lần
> (nằm trong seed); việc đọc thành tiếng dùng TTS của thiết bị.

## Chạy thử nhanh (backend)

Yêu cầu: Node.js 22 (`.nvmrc`), pnpm 10 (`corepack enable`).

```bash
pnpm install                      # tự chạy prisma generate
cp apps/api/.env.example apps/api/.env
pnpm --filter @tm/api db:deploy   # tạo bảng từ migration
pnpm --filter @tm/api db:seed     # nạp 6 điểm x 4 ngôn ngữ
pnpm dev:api                      # http://localhost:3000  (Swagger: /docs)
```

Kiểm tra: `./scripts/smoke-test.sh http://localhost:3000`

## Lệnh thường dùng

| Lệnh             | Tác dụng                               |
| ---------------- | -------------------------------------- |
| `pnpm lint`      | ESLint toàn repo                       |
| `pnpm format`    | Prettier tự sửa định dạng              |
| `pnpm typecheck` | Kiểm tra kiểu TypeScript ở mọi package |
| `pnpm test`      | Chạy test ở mọi package                |
| `pnpm build`     | Build mọi package                      |

## Tài liệu

- [Kiến trúc](docs/architecture.md) · [ERD & từ điển dữ liệu](docs/erd.md) · [API contract](docs/api-contract.md)
- [CI/CD](docs/ci-cd.md) · [Hướng dẫn deploy](docs/deploy.md) · [Kiểm thử](docs/testing.md)
- [SRS (bản nháp)](docs/srs.md) · [Checklist demo giữa kỳ](docs/demo-checklist.md)
- [Quy tắc làm việc nhóm](CONTRIBUTING.md) · [Biên bản họp](docs/meetings/) · [Tiến độ phần A](docs/progress/phan-A-tuan-1-7.md)

## Liên kết (cập nhật sau khi deploy)

| Mục          | URL                                         |
| ------------ | ------------------------------------------- |
| API (Render) | https://thuyet-minh-api.onrender.com        |
| Swagger      | https://thuyet-minh-api.onrender.com/docs   |
| Web (Vercel) | _(điền sau khi C deploy)_                   |
| APK (EAS)    | _(điền link từ workflow "Build APK (EAS)")_ |

> Render bản miễn phí "ngủ" sau ~15 phút không có request, lần gọi đầu có thể mất 30–60 giây.
