# Hướng dẫn deploy từng bước

Thứ tự khuyến nghị: **1) Render (API) → 2) Vercel (web) → 3) EAS (APK)**. Người làm: A.

## 1. API lên Render (tuần 3)

1. Đẩy code lên GitHub (nhánh `main`).
2. [render.com](https://render.com) → **New +** → **Blueprint** → chọn repo. Render đọc `render.yaml`.
3. Khi hỏi biến `CORS_ORIGINS`: tạm để trống (điền sau khi có URL web Vercel).
4. Chờ build xong, mở `https://<tên-dịch-vụ>.onrender.com/health` → thấy `{"status":"ok"}`.
5. Kiểm tra toàn bộ: `./scripts/smoke-test.sh https://<tên-dịch-vụ>.onrender.com`
6. Cập nhật URL thật vào: `README.md`, `apps/api/openapi.yaml` (mục `servers`), `apps/mobile/eas.json`, biến môi trường của web.

Quá trình khởi động chạy `prisma migrate deploy` → `node dist/seed.js` → `node dist/server.js`
(`pnpm --filter @tm/api start:prod`), nên DB luôn có đủ dữ liệu ngay cả khi Render restart.

**Chống "ngủ":** Render free ngủ sau ~15 phút. Có thể tạo monitor miễn phí ở UptimeRobot/cron-job.org
gọi `GET /health` mỗi 10 phút trong tuần demo. Ngoài tuần demo thì không cần.

## 2. Web lên Vercel (tuần 4)

1. vercel.com → **Add New Project** → import repo. Đặt **Root Directory = `apps/web`** và bật
   **Include source files outside of the Root Directory** (vì web dùng `packages/i18n`).
2. Thêm biến môi trường `VITE_API_URL` = URL Render (cả _Production_ và _Preview_).
3. Ở máy: `cd apps/web && npx vercel link` → mở `.vercel/project.json` lấy `orgId`, `projectId`.
4. Tạo token (Account Settings → Tokens). Thêm 3 secret vào GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
5. Mở 1 PR nhỏ đụng `apps/web` → workflow **Deploy web (Vercel)** comment link preview vào PR.
6. Lấy URL production, quay lại Render → `CORS_ORIGINS` = URL đó (ví dụ `https://thuyet-minh.vercel.app`) → lưu, Render tự redeploy.

## 3. APK bằng EAS (tuần 5)

Chuẩn bị (B làm 1 lần): trong `apps/mobile` chạy `npx eas-cli login`, `eas init`, rồi commit `app.json` đã có
`extra.eas.projectId`. Android keystore do EAS tự quản lý.

Phần A:

1. expo.dev → Account settings → **Access tokens** → tạo token → GitHub secret `EXPO_TOKEN`.
2. GitHub → Actions → **Build APK (EAS)** → Run workflow (`preview`).
3. Khi xong, mở _Job summary_ lấy link tải APK, cài thử trên điện thoại Android thật
   (bật "Cài đặt từ nguồn không xác định").
4. Lưu APK vào nơi chắc chắn (Google Drive của nhóm). **Link EAS có thể hết hạn.**
5. Với bản chính thức giữa kỳ: đặt tag `mobile-v0.1.0` để build `production` và ghi link vào README.

**iOS:** build cần tài khoản Apple Developer (99 USD/năm), nhóm không dùng. Demo iOS bằng **Expo Go**
(`pnpm --filter @tm/mobile start` rồi quét QR), và nói rõ giới hạn này trong báo cáo.

## Biến môi trường tổng hợp

| Nơi          | Biến                  | Giá trị                                     |
| ------------ | --------------------- | ------------------------------------------- |
| Render (api) | `DATABASE_URL`        | `file:./prod.db` (đã đặt trong render.yaml) |
| Render (api) | `CORS_ORIGINS`        | URL web production                          |
| Render (api) | `CORS_ORIGIN_REGEX`   | `^https://.*\.vercel\.app$` (preview PR)    |
| Vercel (web) | `VITE_API_URL`        | URL Render                                  |
| EAS (mobile) | `EXPO_PUBLIC_API_URL` | URL Render (đặt trong `eas.json`)           |
| Local (api)  | `.env`                | sao chép từ `apps/api/.env.example`         |

## Chạy local (phương án dự phòng khi mất mạng)

```bash
pnpm --filter @tm/api db:deploy && pnpm --filter @tm/api db:seed && pnpm dev:api
# web:    VITE_API_URL=http://localhost:3000
# mobile: EXPO_PUBLIC_API_URL=http://<IP-LAN-may-ban>:3000   (điện thoại cùng Wi-Fi)
```
