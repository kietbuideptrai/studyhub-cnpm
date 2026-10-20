# apps/web (C phụ trách)

Web React.js (Vite + TypeScript). Hiện chỉ có `vercel.json` do A cấu hình sẵn cho CD
(`.github/workflows/deploy-web.yml`).

Khi C khởi tạo Vite, giữ lại `vercel.json`, đặt `name` trong `package.json` là `@tm/web`.
Địa chỉ API đọc từ biến `VITE_API_URL` (đặt trong Vercel → Project → Environment Variables).
