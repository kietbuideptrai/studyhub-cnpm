# Web

Ứng dụng web dùng React, Vite và TypeScript. Các URL hiện vật dạng
`/artifacts/<slug>` được phục vụ bởi React Router; `vercel.json` rewrite các
đường dẫn về `index.html` để truy cập trực tiếp hoặc tải lại trang không trả 404.

## Yêu cầu

- Node.js phiên bản LTS
- npm

## Cài đặt

Từ thư mục `web/`:

```bash
npm install
cp .env.example .env.local
```

## Biến môi trường

| Biến | Mô tả | Ví dụ local |
| --- | --- | --- |
| `VITE_API_URL` | URL gốc của backend API | `http://localhost:3000` |
| `VITE_PUBLIC_URL` | URL gốc công khai của web, dùng để tạo liên kết hiện vật và mã QR | `http://localhost:5173` |
| `VITE_DEMO_MODE` | Dùng dữ liệu demo cục bộ thay cho API thật (`true` hoặc `false`) | `true` |

Đặt các URL gốc, không thêm dấu `/` ở cuối. Với môi trường triển khai, dùng URL
HTTPS thực tế của backend và domain Vercel tương ứng.

Khi `VITE_DEMO_MODE=true`, web dùng bộ dữ liệu 8 hiện vật trong
`shared/demoArtifacts.ts`, có nội dung nháp tiếng Việt, Anh, Trung, Nhật và Hàn;
ảnh được lưu trong `web/public/images/artifacts/`. Không cần backend hoặc
database để chạy luồng tham quan. Chế độ này chỉ thay API đọc công khai; đăng
nhập và các thao tác quản trị vẫn cần các endpoint backend tương ứng. Nội dung
thuyết minh đa ngôn ngữ là bản nháp, cần được bảo tàng/chuyên gia lịch sử kiểm
chứng trước khi sử dụng chính thức. Đặt thành `false` khi tích hợp backend thật.

## Chạy local

```bash
npm run dev
```

Mở URL được Vite hiển thị (mặc định `http://localhost:5173`). Nếu thay đổi
`VITE_DEMO_MODE` trong `.env.local`, khởi động lại Vite để nạp cấu hình mới.
Khi `VITE_DEMO_MODE=false`, đảm bảo backend đang chạy tại URL cấu hình trong
`VITE_API_URL`.

## Kiểm thử

```bash
npm test
```

## Build production

```bash
npm run build
```

Build được tạo trong `dist/`.

## Triển khai lên Vercel

1. Import repository vào Vercel.
2. Đặt **Root Directory** là `web`.
3. Dùng framework preset **Vite**; build command là `npm run build`, output
   directory là `dist`.
4. Trong **Project Settings → Environment Variables**, cấu hình:
   - `VITE_API_URL`: URL HTTPS của backend đã triển khai.
   - `VITE_PUBLIC_URL`: domain công khai của web, ví dụ
     `https://studyhub.example.com` (không có dấu `/` cuối).
   - `VITE_DEMO_MODE=false` để dùng backend đã triển khai thay vì dữ liệu demo.
5. Triển khai lại sau khi thay đổi biến môi trường. Kiểm tra mở trực tiếp và tải
   lại một URL `/artifacts/<slug>` để xác nhận rewrite hoạt động.
