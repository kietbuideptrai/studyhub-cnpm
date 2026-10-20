# apps/mobile (B phụ trách)

Ứng dụng React Native (Expo + TypeScript). Thư mục này hiện chỉ có `eas.json` do A cấu hình sẵn
cho pipeline build APK (`.github/workflows/eas-build.yml`).

Khi B khởi tạo Expo (`pnpm create expo-app`), giữ lại `eas.json` này và đặt `name` trong
`package.json` là `@tm/mobile`. Địa chỉ API đọc từ biến `EXPO_PUBLIC_API_URL`
(xem `docs/api-contract.md`).
