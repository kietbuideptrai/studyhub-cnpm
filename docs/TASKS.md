# Backlog MVP — Thuyết minh đa ngôn ngữ

Backlog này phản ánh PRD 1.1 và hiện trạng code đã rà soát ngày 2026-11-02. Ưu tiên luồng QR → nội dung hiện vật → đổi ngôn ngữ → nghe thuyết minh. CMS, lịch sử xem và tốc độ TTS không phải mục tiêu MVP; code liên quan đang có được giữ nguyên, không mở rộng hoặc xóa trong các task này.

## Hiện trạng đã kiểm tra

| Khu vực | Trạng thái hiện tại |
| --- | --- |
| Web | Có trang chủ, danh sách, chi tiết, chọn ngôn ngữ, TTS và demo data; `npm run build` đạt. `npm test` đạt 37/40, 3 test admin API thất bại do `VITE_API_URL` trong `.env.local` làm URL thành absolute thay vì relative như test mong đợi. |
| Mobile | Có danh sách, tìm kiếm, quét QR, yêu cầu quyền camera, chi tiết, TTS và lưu ngôn ngữ; `npm run typecheck` và `npm run lint` đạt. Chưa có automated test suite riêng; cần kiểm thử trên thiết bị thật. |
| Backend | Có API đọc hiện vật/ngôn ngữ và PostgreSQL pool. `GET /api/health` hiện chỉ trả `{ status: "ok" }`, chưa kiểm tra database. `npm run build` hiện lỗi vì cấu hình chưa commit `ignoreDeprecations: "6.0"` không hợp lệ với TypeScript 5.9.3 đang cài. |
| Dữ liệu | `seed.sql` có 8 hiện vật với bản dịch Việt/Anh và URL ảnh placeholder; chưa đạt mốc 3 hiện vật × 5 ngôn ngữ trong PRD. Web demo có nội dung 5 ngôn ngữ nhưng là bản nháp. Chưa xác minh dữ liệu thực trên Supabase trong lần rà soát này. |
| Phạm vi cũ | `docs/TASKS.md` trước đây còn giao CMS, upload ảnh và lịch sử xem như việc cần làm; các mục này không còn là tiêu chí MVP theo PRD 1.1. |

## P0 — Chặn build/test và tích hợp

| ID | Task | Trạng thái | Phụ trách đề xuất | Tiêu chí hoàn thành |
| --- | --- | --- | --- | --- |
| P0-01 | Làm cho web tests độc lập với `.env.local` | Chưa làm | Web | `cd web && npm test` chạy ổn định với cấu hình demo local; 40/40 test qua. Test không phụ thuộc URL hoặc secret của môi trường cá nhân. |
| P0-02 | Giải quyết mismatch cấu hình TypeScript backend | Chặn — cần rà soát thay đổi local | Backend | Rà soát thay đổi local trong `backend/tsconfig.json`; chọn cấu hình tương thích với phiên bản TypeScript khai báo/cài đặt, không ghi đè thay đổi chưa được duyệt. `cd backend && npm run build` thành công. |

## P1 — Hoàn thành yêu cầu MVP cốt lõi

| ID | Task | Trạng thái | Phụ trách đề xuất | Tiêu chí hoàn thành |
| --- | --- | --- | --- | --- |
| P1-01 | Sửa tìm kiếm backend theo tên Việt và Anh | Chưa làm | Backend | `q` tìm trong `artifacts.name` và title bản dịch `en`, không phân biệt hoa/thường, khớp một phần; kết quả không phụ thuộc `lang` đang hiển thị. Bổ sung test cho tìm Việt/Anh khi chọn `vi`, `en` và một ngôn ngữ khác; giữ lọc hiện vật đã xuất bản. |
| P1-02 | Hoàn thiện bộ dữ liệu nghiệm thu | Chưa làm | Backend + Nội dung | Có ít nhất 3 hiện vật với đủ 5 bản dịch `vi/en/zh/ja/ko`, dữ liệu được người phụ trách rà soát. Thay ảnh placeholder bằng URL ảnh được phép sử dụng. Chạy import/seed có kiểm soát và xác nhận API trả đủ dữ liệu; không ghi đè dữ liệu hiện có ngoài dự kiến. |
| P1-03 | Bổ sung fallback tiếng Anh có xác nhận trên web | Chưa làm | Web | Khi thiếu bản dịch đã chọn nhưng có `en`, hiện đúng popup theo PRD. “Xem tiếng Anh” tải nội dung tiếng Anh, ghi nhãn rõ tiếng Anh nhưng không đổi lựa chọn/ngôn ngữ URL đã lưu; “Hủy” không tự đổi ngôn ngữ. Nếu thiếu cả `en`, hiện trạng thái không có nội dung. Đặt thuộc tính `lang` theo nội dung thực tế; TTS không tự phát. Có test cho đủ các nhánh. |
| P1-04 | Đưa TTS web về đúng trạng thái và thông báo PRD | Chưa làm | Web | Đổi ngôn ngữ/rời trang dừng voice và hàng đợi; không có nhiều lượt đọc chồng; không hiện “đang phát” trước khi engine bắt đầu; thiếu voice hoặc lỗi do thiếu voice hiển thị chính xác “Hiện giờ chưa có voice”, vẫn giữ văn bản. Có thể thử phát lại và kiểm tra voice lại. Bổ sung test cho đổi ngôn ngữ, unmount, thiếu voice và lỗi phát. |
| P1-05 | Bổ sung trạng thái readiness backend/database | Chưa làm | Backend | `/api/health` kiểm tra backend và database riêng biệt, trả trạng thái có ý nghĩa khi DB không kết nối được và không làm lộ connection string/chi tiết bí mật. Có test cho DB thành công/thất bại; tài liệu hướng dẫn dùng endpoint trước demo được cập nhật. |
| P1-06 | Chốt vận hành dữ liệu và kiểm tra Supabase | Chưa làm | Backend | Tài liệu nêu rõ cách áp dụng schema, seed/import an toàn và xác minh kết nối; xác nhận database mục tiêu có schema, ít nhất 3×5 bản dịch và API đọc hoạt động. Chỉ chạy import trên database đã xác nhận, không dùng seed ghi đè dữ liệu chưa kiểm tra. |

## P2 — Nghiệm thu trải nghiệm web/mobile

| ID | Task | Trạng thái | Phụ trách đề xuất | Tiêu chí hoàn thành |
| --- | --- | --- | --- | --- |
| P2-01 | Kiểm thử responsive mobile-first trên web | Chưa làm | Web | Kiểm tra viewport 320, 375, 390, 768 và 1440 CSS px; không cuộn ngang ngoài ý muốn, cắt/chồng nội dung; ảnh không méo; popup, ngôn ngữ và điều khiển TTS dùng được. Lưu kết quả Pass/Fail và thiết bị/trình duyệt. |
| P2-02 | Kiểm thử accessibility web | Chưa làm | Web | Hoàn thành luồng chính bằng bàn phím; focus nhìn thấy, popup quản lý/trả focus; zoom 200% không mất chức năng; chữ chính ≥16 CSS px, tương phản văn bản thường ≥4.5:1, nút chính có vùng chạm ≥44×44 CSS px; kiểm tra screen reader, heading, alt text và `lang`. Ghi lại kết quả, sửa lỗi phát hiện. |
| P2-03 | Kiểm thử luồng mobile trên thiết bị thật | Chưa làm | Mobile | Trên Android/iOS mục tiêu, kiểm tra quyền camera (cho phép/từ chối), QR đúng/sai, slug không tồn tại, mất mạng/thử lại, đổi ngôn ngữ khi TTS đang chạy, rời màn hình khi đang đọc, thiếu voice và VoiceOver/TalkBack. Ghi thiết bị/OS và kết quả. |
| P2-04 | Đồng bộ tài liệu checklist mobile với phạm vi MVP | Chưa làm | Mobile + QA | `docs/MOBILE-TEST-CHECKLIST.md` không coi lịch sử là tiêu chí bắt buộc; có các case tìm tiếng Việt/Anh độc lập ngôn ngữ, TTS dừng đúng lúc và accessibility; có cột trạng thái/kết quả cho từng case. |
| P2-05 | Đo mục tiêu tải nội dung trong điều kiện xác định | Chưa làm | Cả nhóm | Chọn và ghi thiết bị, trình duyệt, mạng di động; đo từ lúc mở URL hiện vật đến khi nội dung chính hiển thị. Báo kết quả so với mục tiêu ≤3 giây, không tuyên bố đạt nếu chưa đo. |

## P3 — Đóng gói demo và bàn giao

| ID | Task | Trạng thái | Phụ trách đề xuất | Tiêu chí hoàn thành |
| --- | --- | --- | --- | --- |
| P3-01 | Chạy kiểm thử nghiệm thu xuyên suốt | Chưa làm | Cả nhóm | Kiểm tra QR → trang hiện vật → đổi ngôn ngữ → TTS trên web và app, cùng các nhánh lỗi trong AC của PRD. Ghi bug, kết quả và bằng chứng; không dùng chế độ demo để tuyên bố database đã kết nối. |
| P3-02 | Chuẩn bị bản demo triển khai và QR | Chưa làm | Web + Backend + Mobile | Cấu hình URL HTTPS, CORS và môi trường không chứa secret trong repo; mở trực tiếp/tải lại URL QR thành công; app trên điện thoại truy cập được backend. Có cách dự phòng local khi dịch vụ demo không sẵn sàng. |
| P3-03 | Hoàn thiện hướng dẫn chạy và bàn giao | Chưa làm | Cả nhóm | README hướng dẫn web demo/API thật, backend + Supabase, mobile Expo Go, biến môi trường và kiểm thử; không ghi giá trị secret. Xác nhận các lệnh build/test theo đúng trạng thái hiện tại. |

## Không nằm trong backlog MVP

- Không triển khai hoặc mở rộng CMS, đăng nhập quản trị, CRUD qua giao diện, upload ảnh qua CMS.
- Không mở rộng lịch sử xem hoặc điều chỉnh tốc độ TTS.
- Không xóa các phần CMS/lịch sử đã có nếu chưa đánh giá phụ thuộc và chưa có yêu cầu riêng.
- Yêu thích và chỉnh cỡ chữ mobile là Should; chỉ làm sau P0/P1 và các kiểm thử nghiệm thu bắt buộc.

## Thứ tự đề xuất

1. P0-02 để backend build được; P0-01 để suite web ổn định.
2. P1-01, P1-02 để chốt tìm kiếm và nội dung mẫu.
3. P1-03, P1-04 để hoàn thiện fallback và TTS web theo PRD.
4. P1-05, P1-06 và P2-01–P2-05 để xác minh database, responsive và accessibility.
5. P3-01–P3-03 trước buổi demo/nghiệm thu.

Task không được đánh dấu hoàn thành chỉ vì code đã tồn tại; cần đạt tiêu chí và có kết quả kiểm thử tương ứng.
