# Kiểm thử

## Chiến lược

| Tầng                        | Công cụ                         | Phạm vi                                                | Phụ trách |
| --------------------------- | ------------------------------- | ------------------------------------------------------ | --------- |
| Kiểm thử tích hợp API       | Vitest + Supertest              | Toàn bộ HTTP → Prisma → SQLite (migration + seed thật) | A         |
| Component (mobile)          | Jest / React Native Testing Lib | Màn hình chính                                         | B         |
| Component (web)             | Vitest + Testing Library        | Trang danh sách, chi tiết, bộ chọn ngôn ngữ            | C         |
| Smoke test môi trường thật  | `scripts/smoke-test.sh`         | Render/local: 13 kiểm tra                              | A         |
| Thủ công trên thiết bị thật | Checklist (`demo-checklist.md`) | Quét QR, TTS, đổi ngôn ngữ                             | B, C      |

CI chạy toàn bộ test tự động ở mỗi PR (check `quality`); không merge khi đỏ.

## Chạy test API

```bash
pnpm --filter @tm/api test          # một lần
pnpm --filter @tm/api test:watch    # theo dõi
```

Test **không cần dịch vụ ngoài**: mỗi lần chạy tạo một DB SQLite tạm, áp dụng đúng các file trong
`prisma/migrations/`, seed dữ liệu thật rồi xóa khi xong. Nhờ vậy migration lỗi hoặc seed lỗi sẽ làm CI đỏ.

## Danh sách test tự động (20 test, `apps/api/src/__tests__/api.test.ts`)

| Nhóm               | Test                                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Health             | Trả `status: ok`                                                                                                                                                                         |
| `/languages`       | 4 ngôn ngữ đúng thứ tự vi, en, ja, ko và đúng cấu trúc; ẩn ngôn ngữ `isActive=false`                                                                                                     |
| `/spots`           | Mặc định tiếng Việt và không kèm `narration`; đúng ngôn ngữ theo `?lang=` (en, ja); lọc `?q=` không phân biệt hoa thường; `400 INVALID_LANG`; **fallback tiếng Việt** khi thiếu bản dịch |
| `/spots/:idOrSlug` | Lấy theo id (kèm `narration`); lấy theo slug; `404 SPOT_NOT_FOUND`                                                                                                                       |
| `/spots/qr/:code`  | Tìm đúng điểm theo mã QR; `404` khi mã lạ                                                                                                                                                |
| CORS               | Cho phép origin trong whitelist; cho phép preview `*.vercel.app`; không cấp header cho origin lạ                                                                                         |
| Swagger/OpenAPI    | `/openapi.json` đủ 4 endpoint; `/docs/` hiển thị Swagger UI                                                                                                                              |
| Dữ liệu seed       | Mỗi điểm có đủ 4 bản dịch, mã QR không trùng                                                                                                                                             |
| Đường dẫn lạ       | `404 NOT_FOUND` theo định dạng lỗi chung                                                                                                                                                 |

**Kết quả lần chạy gần nhất (máy phát triển):** 20/20 đạt, ~0,6 giây. Smoke test trên bản build: 13/13 đạt.
`pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build` đều qua.

## Kiểm thử thủ công API (Swagger)

1. Mở `/docs` → _Try it out_ cho từng endpoint.
2. Đối chiếu 4 ngôn ngữ của `TM-001`; thử `lang=xx` (phải 400) và `qr/ABC` (phải 404).

## Việc sẽ mở rộng ở tuần 10 (test plan tổng thể)

- Gộp test thủ công của B và C vào 1 bảng test case (mã, bước, kết quả mong đợi, kết quả thực tế, trạng thái).
- Thêm test hiệu năng đơn giản cho API (ví dụ `autocannon` 50 kết nối/10 giây) và ghi kết quả vào báo cáo.
- Thêm test E2E 1 luồng "quét QR → nghe" nếu còn thời gian (mức Could).
