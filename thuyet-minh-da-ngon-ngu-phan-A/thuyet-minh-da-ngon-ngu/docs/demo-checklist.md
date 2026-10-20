# Checklist chuẩn bị demo giữa kỳ (tuần 7)

Phụ trách: **A** (kiểm tra hạ tầng, link, README). B demo mobile, C demo web và slide tiến độ.

## Bảng liên kết cần có (điền vào, kiểm tra từng cái)

| Mục                              | Link / vị trí              | Đã mở được? | Người kiểm |
| -------------------------------- | -------------------------- | ----------- | ---------- |
| API health                       | `https://.../health`       | ☐           | A          |
| Swagger                          | `https://.../docs`         | ☐           | A          |
| Web production (Vercel)          |                            | ☐           | C          |
| APK (bản dùng để demo)           | (link EAS + bản lưu Drive) | ☐           | B          |
| Repo GitHub (công khai cho thầy) |                            | ☐           | A          |
| Video/ảnh dự phòng               | Thư mục Drive              | ☐           | C          |

## T-3 ngày

- [ ] `main` CI xanh; không còn PR chờ dở quan trọng
- [ ] Không còn secret/`.env` trong repo (`git log -p` tìm thử "token", "key")
- [ ] README đủ: mô tả, cách chạy, link, ảnh chụp, thành viên và phân công
- [ ] Chạy `./scripts/smoke-test.sh <URL Render>` → **TẤT CẢ ĐẠT**
- [ ] Build APK bản cuối, cài thử trên **ít nhất 2 điện thoại** khác nhau
- [ ] `CORS_ORIGINS` trên Render đúng URL web production (mở web, thấy dữ liệu, console không lỗi CORS)
- [ ] Mỗi thành viên có commit và đã review PR của người khác trong tuần (xem Insights → Contributors)

## T-1 ngày

- [ ] In mã QR `TM-001` … `TM-006` (hoặc mở trên màn hình thứ 2) và thử quét bằng APK
- [ ] Thử TTS bằng cả 4 ngôn ngữ trên điện thoại demo; ghi lại ngôn ngữ nào **thiếu giọng** để né khi demo
- [ ] Quay video demo (1–2 phút) + chụp ảnh các màn hình chính làm dự phòng
- [ ] Chạy thử toàn bộ kịch bản 1 lần có bấm giờ
- [ ] Chuẩn bị phương án local: `pnpm dev:api` chạy được, điện thoại cùng Wi-Fi gọi được IP LAN
- [ ] Sạc đầy pin, tắt thông báo, bật không làm phiền

## Buổi demo (T-0)

- [ ] **30 phút trước:** chạy `./scripts/smoke-test.sh` để **đánh thức Render** (lần đầu có thể mất 30–60 giây)
- [ ] Mở sẵn: Swagger, web production, GitHub Actions (CI xanh), app trên điện thoại
- [ ] Mạng dự phòng: điện thoại phát 4G cho laptop nếu Wi-Fi hội trường yếu

## Kịch bản gợi ý (khoảng 6–7 phút)

| Phút | Ai  | Nội dung                                                                               |
| ---- | --- | -------------------------------------------------------------------------------------- |
| 0:00 | C   | Bối cảnh, bài toán, 3 ưu tiên Must, ảnh Figma                                          |
| 1:00 | A   | Kiến trúc 1 slide (sơ đồ ở `docs/architecture.md`), mở Swagger gọi `qr/TM-001?lang=ja` |
| 2:30 | A   | CI/CD: PR có check xanh + link preview web tự comment + APK build từ Actions           |
| 3:30 | B   | Mobile: chọn ngôn ngữ → danh sách → **quét QR** → nghe thuyết minh                     |
| 5:00 | C   | Web: đổi ngôn ngữ, xem chi tiết, nghe thuyết minh, responsive trên điện thoại          |
| 6:00 | A   | Tiến độ so với kế hoạch (Must xong), kế hoạch tuần 8–9 (GPS, tìm kiếm)                 |

## Nếu có sự cố

| Sự cố                   | Xử lý                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| Render chưa tỉnh        | Chờ 30–60 giây, vừa chờ vừa nói phần kiến trúc; mở `/health` thử lại       |
| Mất mạng                | Chuyển sang video dự phòng + ảnh chụp                                      |
| Thiếu giọng đọc (ja/ko) | Demo bằng vi/en; nói rõ giới hạn thiết bị                                  |
| Không quét được QR      | Dùng danh sách chọn điểm, hoặc gọi `qr/TM-001` ở Swagger để chứng minh API |
| APK không cài được      | Dùng Expo Go (`pnpm --filter @tm/mobile start`)                            |
| iOS                     | Chỉ Expo Go; ghi rõ trong báo cáo vì build iOS cần Apple Developer         |

## Câu thầy có thể hỏi phần A (chuẩn bị sẵn)

- Vì sao dịch sẵn thay vì gọi API dịch lúc chạy? → Ổn định lúc demo, không phụ thuộc khóa API/mạng, chi phí bằng 0.
- Vì sao SQLite? Dữ liệu mất khi Render restart thì sao? → Dữ liệu chỉ đọc, seed tự chạy lại mỗi lần khởi động; cần ghi dữ liệu thì chuyển PostgreSQL chỉ cần đổi adapter.
- CI kiểm tra gì? Làm sao biết migration đúng? → Test áp dụng đúng migration thật lên DB tạm rồi seed.
- Làm sao FE không bị kẹt khi BE chưa xong? → Thống nhất contract từ tuần 1–2 (`openapi.yaml`), dùng MSW/JSON mẫu.
