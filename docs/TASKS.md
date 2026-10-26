# Task theo ngày và prompt mẫu cho Copilot

Danh sách task cho 3 người trong 3 ngày đầu (mục tiêu 40%), kèm prompt mẫu để dán vào Copilot Chat, rồi tổng quan task tuần 2–5.

## Cách dùng

1. Lưu PRD vào repo thành `docs/PRD.md` để Copilot đọc được khi bạn nhắc tới mục liên quan.
2. Đầu mỗi phiên chat, dán **prompt nền** bên dưới.
3. Làm từng task nhỏ, chạy thử ngay rồi mới sang task tiếp theo; không sinh cả dự án một lần.
4. Đọc lại code Copilot sinh ra, nhất là phần đăng nhập, truy vấn database và TTS.

## Prompt nền (dán đầu mỗi phiên)

```text
Bối cảnh: đồ án Thuyết minh tự động đa ngôn ngữ. Du khách quét QR để mở trang hiện vật, chọn ngôn ngữ (vi, en, zh, ja, ko), đọc và nghe thuyết minh bằng TTS.
Stack: TypeScript. Web: React + Vite. Backend: Node.js + Express + PostgreSQL (Supabase). Mobile: React Native + Expo.
Đặc tả nằm trong docs/PRD.md; hãy đọc mục liên quan trước khi viết code và giữ đúng tên trường, tên endpoint trong đó.
Quy tắc: TypeScript strict, đặt tên rõ ràng, luôn xử lý trạng thái đang tải, lỗi và không có dữ liệu, không thêm thư viện nếu không cần. Cuối câu trả lời liệt kê file đã tạo hoặc sửa.
```

## Ngày 1 — Khung dự án (mục tiêu 10–15%)

### Việc chung của cả nhóm (buổi sáng, làm trước hết)

| ID | Task | Người làm |
| --- | --- | --- |
| G1 | Tạo repo Git, quy ước nhánh, đưa PRD vào `docs/PRD.md` | A |
| G2 | Chốt kiểu dữ liệu và ví dụ JSON cho API (mục 6 PRD) | Cả nhóm |

Prompt cho G2 (một người chạy, cả nhóm dùng chung kết quả):

```text
Dựa trên mục 6 của docs/PRD.md, tạo file shared/types.ts gồm các kiểu: Language, ArtifactListItem, ArtifactDetail, Translation, ApiError. ApiError chỉ gồm { message: string } vì PRD chưa quy định payload lỗi.
Tạo thêm docs/api-samples.json chứa ví dụ phản hồi cho: GET /api/artifacts?lang=vi, GET /api/artifacts/tank-001?lang=en (có bản dịch) và trường hợp translation = null kèm available_languages.
Giữ đúng tên trường trong PRD.
```

### Thành viên B — Backend

**B1. Khởi tạo Express + TypeScript**

```text
Khởi tạo backend Express + TypeScript trong thư mục backend/ với cấu trúc src/routes, src/services, src/db. Bật CORS, dotenv, JSON parser. Thêm GET /api/health trả về {status: 'ok'}. Thêm script dev và build. Cho tôi lệnh cài đặt và nội dung từng file.
```

**B2. Schema và dữ liệu mẫu**

```text
Viết file SQL tạo 3 bảng theo mục 6.1 của PRD: artifacts, artifact_translations, admin_users. Ràng buộc: slug unique; unique (artifact_id, language_code); có created_at, updated_at.
Viết thêm seed.sql với 5 hiện vật mẫu, mỗi hiện vật có bản dịch tiếng Việt và tiếng Anh (3-4 câu mỗi bản).
```

**B3. API danh sách và chi tiết (tạm dùng dữ liệu mẫu)**

```text
Viết route GET /api/artifacts (hỗ trợ ?lang và ?q) và GET /api/artifacts/:slug (?lang) theo mục 6.2 của PRD, tạm đọc từ docs/api-samples.json. Trả 404 với { message: 'Không tìm thấy hiện vật' } khi không có slug. Khi thiếu bản dịch, trả translation = null kèm available_languages.
```

### Thành viên A — Frontend Web

**A1. Khởi tạo React + Vite + Router**

```text
Khởi tạo web React + Vite + TypeScript trong thư mục web/. Cài react-router. Tạo 3 route: / (trang chủ), /artifacts (danh sách), /artifacts/:slug (chi tiết). Tạo layout có header và thanh chọn ngôn ngữ (vi, en, zh, ja, ko). Chưa gọi API.
```

**A2. Trang danh sách và tìm kiếm (dữ liệu mẫu)**

```text
Tạo trang /artifacts hiển thị danh sách hiện vật dạng thẻ (ảnh, tên, mô tả ngắn) từ docs/api-samples.json. Thêm ô tìm kiếm theo tên, lọc ở phía client. Có thông báo khi không có kết quả. Giao diện responsive, chữ dễ đọc, ảnh có alt text.
```

**A3. Trang chi tiết (dữ liệu mẫu)**

```text
Tạo trang /artifacts/:slug hiển thị ảnh, tiêu đề và nội dung theo ngôn ngữ đang chọn, chia đoạn dễ đọc. Có nút Nghe thuyết minh (chưa cần chạy). Hiển thị thông báo rõ ràng khi slug không tồn tại hoặc chưa có bản dịch.
```

### Thành viên C — Mobile

**C1. Khởi tạo Expo và điều hướng**

```text
Khởi tạo app Expo + TypeScript trong thư mục mobile/ với điều hướng tab: Trang chủ, Hiện vật, Quét QR, Yêu thích, Cá nhân. Tab Quét QR nằm giữa và nổi bật hơn (nút tròn lớn). Mỗi tab tạm là màn hình trống có tiêu đề.
```

**C2. Danh sách hiện vật và tìm kiếm (dữ liệu mẫu)**

```text
Tạo màn hình Hiện vật dùng FlatList hiển thị thẻ hiện vật từ docs/api-samples.json, có ô tìm kiếm theo tên và thông báo khi không có kết quả. Bấm vào thẻ mở màn hình chi tiết hiển thị tiêu đề và nội dung.
```

**C3. Màn hình quét QR**

```text
Tạo màn hình Quét QR dùng expo-camera: xin quyền camera, quét mã QR, đọc URL, tách slug ở cuối đường dẫn /artifacts/:slug rồi chuyển sang màn hình chi tiết. Nếu QR không hợp lệ thì hiện thông báo và cho quét lại. Xử lý trường hợp người dùng từ chối quyền camera.
```

## Ngày 2 — Tích hợp luồng hiện vật (mục tiêu 25–30%)

### Thành viên B — Backend

**B4. Nối Supabase PostgreSQL**

```text
Thay phần đọc JSON mẫu bằng truy vấn PostgreSQL (Supabase) cho GET /api/artifacts và GET /api/artifacts/:slug. Dùng biến môi trường cho chuỗi kết nối, có file .env.example. Danh sách phải trả đúng title và summary theo ?lang, lọc theo ?q, chỉ lấy hiện vật is_published = true.
```

**B5. Xử lý lỗi, languages và triển khai**

```text
Thêm GET /api/languages, middleware xử lý lỗi thống nhất trả { message: '...' }, cấu hình CORS cho domain web và localhost. Viết hướng dẫn triển khai Express lên Render hoặc Railway (biến môi trường, lệnh build, lệnh start).
```

### Thành viên A — Frontend Web

**A4. Gọi API thật**

```text
Tạo lớp gọi API trong web/src/api (dùng VITE_API_URL) và hook useArtifacts, useArtifact(slug, lang). Thay dữ liệu mẫu bằng API thật. Xử lý đang tải, lỗi mạng (có nút Thử lại), 404 và translation = null. Dùng kiểu trong shared/types.ts.
```

**A5. Chọn ngôn ngữ và ghi nhớ**

```text
Thêm chọn ngôn ngữ vào context toàn cục: lưu vào localStorage, đọc tham số ?lang= trên URL (ưu tiên URL), cập nhật URL khi đổi ngôn ngữ. Khi đổi ngôn ngữ ở trang chi tiết thì tải lại nội dung đúng ngôn ngữ.
```

**A6. TTS bằng Web Speech API**

```text
Viết hook useSpeech dùng window.speechSynthesis: nhận text và mã ngôn ngữ, ánh xạ vi->vi-VN, en->en-US, zh->zh-CN, ja->ja-JP, ko->ko-KR. Cắt text theo câu và đọc lần lượt. Có play, pause, resume, stop. Tự dừng khi đổi ngôn ngữ hoặc rời trang. Nếu thiết bị không có giọng cho ngôn ngữ đó, trả về cờ unavailable để giao diện hiện thông báo. Chỉ phát sau khi người dùng bấm nút (yêu cầu của iOS Safari).
```

### Thành viên C — Mobile

**C4. Gọi API thật**

```text
Tạo lớp gọi API trong mobile/src/api (URL lấy từ cấu hình, có thể đổi khi chạy trên điện thoại thật) và hook lấy danh sách, chi tiết theo slug và ngôn ngữ. Thay dữ liệu mẫu bằng API thật; xử lý đang tải, lỗi mạng có nút Thử lại, 404 và translation = null.
```

**C5. Chi tiết, chọn ngôn ngữ và TTS**

```text
Trên màn hình chi tiết thêm chọn ngôn ngữ (lưu bằng AsyncStorage) và nút Nghe thuyết minh dùng expo-speech với mã ngôn ngữ vi-VN, en-US, zh-CN, ja-JP, ko-KR. Cắt text theo câu. Kiểm tra tài liệu Expo Speech: nếu pause/resume không hỗ trợ trên Android thì dùng cách dừng và đọc lại từ câu hiện tại. Dừng đọc khi đổi ngôn ngữ hoặc rời màn hình.
```

## Ngày 3 — Bản demo xuyên suốt (mục tiêu 40%)

| ID | Task | Người làm | Kết quả cần đạt |
| --- | --- | --- | --- |
| D1 | Nhập bộ dữ liệu mẫu hoàn chỉnh vào database (5 hiện vật, tối thiểu 3 ngôn ngữ) | B | Web và app đọc được dữ liệu thật |
| D2 | Triển khai backend và kiểm tra `/api/health` | B | URL backend công khai |
| D3 | Triển khai web lên Vercel, trỏ về backend | A | Web chạy trên URL công khai |
| D4 | Tạo mã QR cho 5 hiện vật từ URL web | A | 5 ảnh QR in thử được |
| D5 | Chạy app trên điện thoại thật qua Expo Go | C | Quét QR rồi mở đúng hiện vật |
| D6 | Chạy luồng QR → chi tiết → đổi ngôn ngữ → nghe trên cả web và app | Cả nhóm | Ghi lại lỗi còn tồn đọng |
| D7 | Chốt kế hoạch 4 tuần tiếp theo | Cả nhóm | Danh sách việc theo tuần |

**Prompt D4: tạo mã QR**

```text
Viết script Node.js (TypeScript) dùng thư viện qrcode: đọc danh sách slug từ file JSON, tạo ảnh PNG mã QR cho từng URL dạng https://<domain>/artifacts/<slug> vào thư mục qr/, đặt tên file theo slug. Domain lấy từ biến môi trường.
```

**Prompt D6: kiểm thử luồng chính**

```text
Dựa trên mục 11 của docs/PRD.md (AC-01 đến AC-14), tạo checklist kiểm thử thủ công dạng bảng markdown: mã tiêu chí, các bước thực hiện, kết quả mong đợi, cột trạng thái để trống. Ưu tiên các tiêu chí liên quan đến QR, đổi ngôn ngữ, TTS và lỗi mạng.
```

## Tuần 2–5 — Task tổng quan

| Tuần | Người | Task | Prompt gợi ý (rút gọn) |
| --- | --- | --- | --- |
| 2 | B | Hoàn thiện dữ liệu 5 ngôn ngữ, kiểm tra truy vấn | Viết script import bản dịch từ file CSV vào artifact\_translations, báo lỗi khi thiếu slug hoặc mã ngôn ngữ sai |
| 2 | A, C | Hoàn thiện giao diện, kiểm tra TTS tiếng Trung, Nhật, Hàn trên thiết bị thật | Viết hàm kiểm tra giọng đọc có sẵn theo mã ngôn ngữ và hiện thông báo thân thiện khi thiếu |
| 3 | B | Đăng nhập quản trị và CRUD (ADM-01 đến ADM-04) | Viết POST /api/admin/auth/login dùng bcrypt và JWT, middleware kiểm tra token cho /api/admin, giới hạn số lần đăng nhập sai |
| 3 | B | CRUD hiện vật và bản dịch | Viết POST, PATCH /api/admin/artifacts và PUT /api/admin/artifacts/:id/translations/:lang, kiểm tra dữ liệu đầu vào, trả lỗi rõ ràng |
| 3 | A | Giao diện trang quản trị | Tạo trang /admin có form đăng nhập, bảng danh sách hiện vật, form thêm/sửa với tab theo ngôn ngữ, nút ẩn hiện vật |
| 3 | A, C | Xử lý lỗi và trạng thái | Rà soát mọi màn hình: đang tải, lỗi mạng, không có dữ liệu, thiếu bản dịch, TTS không khả dụng; thêm thành phần dùng chung |
| 4 | A | Chữ lớn, lịch sử xem, xem trước trong quản trị | Thêm chế độ chữ lớn lưu localStorage; lưu 20 hiện vật xem gần nhất và hiển thị ở trang chủ |
| 4 | C | Lịch sử, yêu thích, cỡ chữ | Lưu lịch sử và danh sách yêu thích bằng AsyncStorage, thêm màn hình Yêu thích và chỉnh cỡ chữ trong tab Cá nhân |
| 4 | B | Tải ảnh lên (ADM-06) | Viết POST /api/admin/uploads tải ảnh lên Supabase Storage, giới hạn loại và dung lượng file, trả về URL công khai |
| 5 | Cả nhóm | Kiểm thử nghiệm thu, triển khai, tài liệu, demo | Viết README hướng dẫn cài đặt, biến môi trường, chạy local, chạy kiểm thử và triển khai cho từng thư mục |
| 5 | C | Build APK (nếu cần) | Hướng dẫn build APK Android bằng EAS Build cho dự án Expo này, các bước cấu hình và lỗi thường gặp |

## Lưu ý khi viết prompt

- Luôn nêu mã chức năng hoặc mục PRD (ví dụ WEB-02, mục 6.2) để Copilot bám đúng đặc tả.
- Mỗi prompt chỉ một việc; kết quả sai thì sửa prompt rồi hỏi lại thay vì chồng thêm yêu cầu.
- Nhờ Copilot giải thích đoạn code chưa hiểu, vì cả nhóm cần giải thích được sản phẩm khi bảo vệ.
- Hỏi giảng viên xem đồ án có được dùng công cụ AI không và có phải khai báo không.
