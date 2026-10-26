# PRD — Thuyết minh tự động đa ngôn ngữ

**Phiên bản 1.0 — bản hoàn chỉnh cho MVP.** Hệ thống thuyết minh hiện vật qua mã QR, hỗ trợ 5 ngôn ngữ và giọng đọc tổng hợp (TTS), gồm website, ứng dụng di động, backend và trang quản trị nội dung tối giản.

## 1. Tổng quan sản phẩm

### 1.1. Mục tiêu

Xây dựng hệ thống cho phép du khách quét mã QR bằng điện thoại (hoặc mở website), chọn ngôn ngữ, đọc nội dung giới thiệu và nghe thuyết minh bằng giọng nói tổng hợp (Text-to-Speech — TTS).

**Vấn đề cần giải quyết:**

- Du khách không phải lúc nào cũng có hướng dẫn viên riêng.
- Khác biệt ngôn ngữ gây khó khăn khi tìm hiểu lịch sử.
- Người khó đọc chữ có thể nghe thuyết minh thay vì chỉ đọc.
- Du khách cần truy cập nhanh, không phải cài ứng dụng trong mọi trường hợp.

### 1.2. Giá trị cốt lõi

| # | Giá trị | Mô tả |
| --- | --- | --- |
| 1 | Quét là xem | Quét QR để mở thẳng trang hiện vật tương ứng |
| 2 | Đa ngôn ngữ | Nội dung hiển thị theo ngôn ngữ được chọn |
| 3 | Đọc hoặc nghe | Đọc thông tin hoặc phát/dừng thuyết minh |
| 4 | Dễ tiếp cận | Giao diện rõ ràng, chữ dễ đọc, nút âm thanh dễ thao tác |

### 1.3. Phạm vi nền tảng

| Nền tảng | Vai trò |
| --- | --- |
| Website | Truy cập trực tiếp bằng trình duyệt, đặc biệt từ mã QR |
| Ứng dụng di động | Danh sách hiện vật, tìm kiếm, nút quét QR nhanh ở giữa thanh điều hướng |
| Backend | Cung cấp dữ liệu hiện vật và bản dịch dùng chung cho cả hai nền tảng |
| Quản trị nội dung | Quản lý dữ liệu ở mức tối thiểu để cập nhật thông tin hiện vật |

## 2. Người dùng và nhu cầu

| Vai trò | Nhu cầu chính |
| --- | --- |
| Visitor — Khách tham quan | Tìm hiện vật, quét QR, đổi ngôn ngữ, đọc và nghe thuyết minh |
| Content Administrator — Quản trị viên nội dung | Thêm, sửa, quản lý thông tin và bản dịch của hiện vật |

**User stories:**

- Là khách tham quan, tôi muốn quét QR để mở đúng hiện vật mà không cần tìm thủ công.
- Là khách nước ngoài, tôi muốn chọn ngôn ngữ mình hiểu để tiếp nhận thông tin.
- Là người muốn nghe thuyết minh, tôi muốn phát, tạm dừng và tiếp tục âm thanh.
- Là người khó đọc chữ, tôi muốn có giọng đọc và giao diện dễ sử dụng.
- Là quản trị viên nội dung, tôi muốn cập nhật thông tin hiện vật mà không phải sửa mã nguồn frontend.

## 3. Yêu cầu chức năng

Mỗi chức năng có mã định danh để dễ phân công, theo dõi tiến độ và kiểm thử.

### 3.1. Website

| ID | Chức năng | Mức độ |
| --- | --- | --- |
| WEB-01 | Trang chủ giới thiệu sản phẩm và lối vào danh sách hiện vật | Must |
| WEB-02 | Danh sách hiện vật dạng thẻ có ảnh, tên và mô tả ngắn theo ngôn ngữ đang chọn | Must |
| WEB-03 | Tìm kiếm hiện vật theo tên | Must |
| WEB-04 | Mở trang chi tiết hiện vật theo slug hoặc mã QR | Must |
| WEB-05 | Chọn ngôn ngữ hiển thị nội dung | Must |
| WEB-06 | Phát, tạm dừng và tiếp tục thuyết minh | Must |
| WEB-07 | Thông báo khi không tìm thấy hiện vật, chưa có bản dịch hoặc mất kết nối | Must |
| WEB-08 | Ghi nhớ ngôn ngữ đã chọn; hỗ trợ tham số `?lang=` trên URL | Must |
| WEB-09 | Chế độ chữ lớn | Should |
| WEB-10 | Lịch sử hiện vật đã xem (lưu trên thiết bị) | Should |
| WEB-11 | Điều chỉnh tốc độ đọc | Could |

**Luồng chính:** Quét QR bằng camera điện thoại → mở URL hiện vật → chọn ngôn ngữ → xem nội dung → (tùy chọn) nghe thuyết minh.

> QR chứa URL web ổn định, ví dụ `https://<domain>/artifacts/tank-001`. Có thể thêm `?lang=ja` để mở sẵn đúng ngôn ngữ. Website không bắt buộc có chức năng quét QR bên trong trang vì camera điện thoại mở trực tiếp đường dẫn.

**Quy tắc QR giữa web và app:** QR in tại hiện vật luôn là URL web, nên camera điện thoại mở website. Ứng dụng di động có chức năng quét riêng bên trong app và đọc cùng URL đó để lấy `slug`. Deep link mở thẳng app không thuộc MVP.

### 3.2. Ứng dụng di động

| ID | Chức năng | Mức độ |
| --- | --- | --- |
| APP-01 | Trang chủ và thanh điều hướng giữa các tab | Must |
| APP-02 | Danh sách hiện vật và tìm kiếm | Must |
| APP-03 | Nút quét QR nổi bật ở giữa thanh điều hướng | Must |
| APP-04 | Quét QR và mở trang chi tiết hiện vật | Must |
| APP-05 | Chọn ngôn ngữ, xem nội dung, phát/dừng TTS | Must |
| APP-06 | Trạng thái đang tải, lỗi mạng (có nút thử lại) và mã QR không hợp lệ | Must |
| APP-07 | Ghi nhớ ngôn ngữ đã chọn trên thiết bị | Must |
| APP-08 | Lưu lịch sử hiện vật đã xem trên thiết bị | Should |
| APP-09 | Danh sách yêu thích lưu trên thiết bị (tab Yêu thích) | Should |
| APP-10 | Điều chỉnh cỡ chữ | Should |
| APP-11 | Điều chỉnh tốc độ đọc | Could |

**Các tab:** Trang chủ – Hiện vật – **Quét QR** (ở giữa, nổi bật hơn) – Yêu thích – Cá nhân. Tab Cá nhân chứa ngôn ngữ, cỡ chữ và lịch sử xem.

### 3.3. Quản trị nội dung

Trang quản trị web tối giản, không xây dựng hệ thống CMS lớn. Giao diện do thành viên Frontend Web phụ trách (xem mục 10).

| ID | Chức năng | Mức độ |
| --- | --- | --- |
| ADM-01 | Đăng nhập quản trị | Must |
| ADM-02 | Xem danh sách hiện vật trong hệ thống | Must |
| ADM-03 | Thêm, sửa và ẩn hiện vật (ảnh nhập bằng URL) | Must |
| ADM-04 | Quản lý nội dung theo từng ngôn ngữ | Must |
| ADM-05 | Xem trước trang hiện vật và đường dẫn QR | Should |
| ADM-06 | Tải ảnh hiện vật lên Supabase Storage | Should |
| ADM-07 | Thống kê lượt xem, lượt nghe | Could |
| ADM-08 | Tạo mã QR ngay trong trang quản trị | Could |

> Mã QR được tạo từ URL hiện vật bằng thư viện có sẵn, chạy trong bước chuẩn bị dữ liệu. Giao diện tạo QR trong trang quản trị chỉ làm khi còn thời gian (ADM-08).

## 4. Ngôn ngữ và khả năng tiếp cận

### 4.1. Ngôn ngữ hỗ trợ

| Ngôn ngữ | Mã trong API | Mã TTS | Ghi chú |
| --- | --- | --- | --- |
| Tiếng Việt | `vi` | `vi-VN` | Ngôn ngữ nguồn |
| English | `en` | `en-US` | Tiếng Anh |
| 中文 | `zh` | `zh-CN` | Tiếng Trung phổ thông |
| 日本語 | `ja` | `ja-JP` | Tiếng Nhật |
| 한국어 | `ko` | `ko-KR` | Tiếng Hàn |

> **Lưu ý dữ liệu:** Mỗi ngôn ngữ nên có nội dung dịch được biên tập và lưu riêng. Không nên dùng dịch máy trực tiếp mỗi lần khách mở trang, vì phát sinh chi phí, độ trễ và dễ sai thuật ngữ lịch sử.

### 4.2. Yêu cầu tiếp cận tối thiểu

- Nút phát âm thanh có nhãn chữ rõ ràng và nhãn cho trình đọc màn hình, không chỉ dựa vào biểu tượng.
- Hỗ trợ điều khiển bằng bàn phím trên web.
- Tương phản màu tốt, chữ đủ lớn, nội dung chia đoạn.
- Ảnh hiện vật có văn bản thay thế (alt text).
- Khi TTS không khả dụng, vẫn hiển thị đầy đủ nội dung văn bản.
- Ngôn ngữ và cỡ chữ đã chọn được ghi nhớ trên thiết bị.

## 5. Đề xuất công nghệ

Dùng **TypeScript** làm ngôn ngữ chính để ba thành viên dùng chung kiểu dữ liệu và giảm lỗi tích hợp — phù hợp nhóm nhỏ đã chia Web, Backend, Mobile.

| Thành phần | Công nghệ | Lý do |
| --- | --- | --- |
| Frontend Web | React + Vite + TypeScript, triển khai trên Vercel | Dễ phát triển giao diện, phù hợp vai trò frontend |
| Backend API | Node.js + Express + TypeScript, chạy trên Render hoặc Railway (gói miễn phí) | Gọn, dễ xây REST API cho hiện vật, bản dịch và quản trị |
| Database | PostgreSQL trên Supabase | Một database dùng chung cho web, app và trang quản trị |
| Lưu trữ ảnh | Supabase Storage | Lưu ảnh hiện vật, trả về URL công khai |
| Mobile | React Native + Expo + TypeScript | Tái sử dụng tư duy React, có camera và công cụ build; thử nghiệm bằng Expo Go |

Giao tiếp giữa các thành phần: REST API / JSON qua HTTPS.

**Lưu ý hạ tầng:** gói miễn phí của dịch vụ chạy backend thường tạm dừng khi không có truy cập, nên lần gọi đầu có thể chậm. Trước buổi demo cần gọi thử `/api/health` để làm nóng backend. Cần kiểm tra giới hạn gói miễn phí hiện hành trước khi chọn nơi triển khai.

**Không chọn** (không cần thiết cho phiên bản đồ án): microservices, Kubernetes, bản đồ offline, AI dịch thuật, hàng đợi xử lý âm thanh.

### 5.1. Xử lý âm thanh chi phí thấp

**Phương án ban đầu** — dùng TTS có sẵn của nền tảng:

- Web: `window.speechSynthesis`
- Mobile: `expo-speech` (hoặc thư viện tương thích React Native/Expo)

**Ưu điểm:** không cần máy chủ tạo âm thanh, không trả phí API theo lượt nghe.

**Hạn chế:** giọng đọc và ngôn ngữ phụ thuộc trình duyệt, hệ điều hành và gói giọng nói đã cài. Cần kiểm tra tiếng Trung, Nhật, Hàn trên thiết bị thật trước khi chốt.

**Dự phòng:** nếu chất lượng chưa đạt, nâng cấp sang âm thanh tạo sẵn cho một số hiện vật tiêu biểu (không phải điều kiện để bắt đầu dự án).

**Chi tiết kỹ thuật TTS:**

- Ánh xạ mã ngôn ngữ trong API sang mã TTS theo bảng ở mục 4.1.
- Cắt nội dung dài theo câu và đọc lần lượt, vì một số trình duyệt ngắt giữa chừng khi đọc đoạn dài.
- Trên iOS Safari, âm thanh chỉ phát sau khi người dùng bấm nút; không tự phát khi mở trang.
- Kiểm tra thiết bị có giọng cho ngôn ngữ đang chọn; nếu thiếu, hiện thông báo và vẫn hiển thị văn bản.
- Khi người dùng đổi ngôn ngữ hoặc rời trang, dừng đọc ngay và xóa hàng đợi.

## 6. Thiết kế dữ liệu và API

### 6.1. Database — ba bảng chính

| Bảng | Mục đích | Các trường |
| --- | --- | --- |
| `artifacts` | Hiện vật | `id`, `slug` (duy nhất), `name`, `image_url`, `category`, `is_published`, `created_at`, `updated_at` |
| `artifact_translations` | Nội dung đa ngôn ngữ | `id`, `artifact_id`, `language_code`, `title`, `summary`, `content`, `updated_at` |
| `admin_users` | Tài khoản quản trị | `id`, `email` (duy nhất), `password_hash`, `created_at` |

- Mỗi hiện vật có nhiều bản dịch; `artifact_id` liên kết sang bảng hiện vật.
- Ràng buộc: `slug` là duy nhất; cặp (`artifact_id`, `language_code`) là duy nhất.
- Ẩn hiện vật bằng `is_published = false`; không xóa cứng ở MVP.
- `name` là tên gốc tiếng Việt dùng trong quản trị; tên hiển thị cho khách lấy từ `title` của bản dịch.
- Bảng `languages` có thể thêm sau. Lịch sử xem và yêu thích lưu trên thiết bị, không cần thêm bảng.

### 6.2. REST API tối thiểu

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/artifacts?lang=en&q=từ-khóa` | Danh sách hiện vật, đã gồm tiêu đề và mô tả ngắn theo ngôn ngữ; lọc theo tên khi có `q` |
| GET | `/api/artifacts/:slug?lang=en` | Chi tiết hiện vật theo ngôn ngữ, kèm danh sách ngôn ngữ có sẵn |
| GET | `/api/languages` | Danh sách ngôn ngữ |
| GET | `/api/health` | Kiểm tra backend hoạt động, dùng để làm nóng trước demo |
| POST | `/api/admin/auth/login` | Đăng nhập quản trị |
| POST | `/api/admin/artifacts` | Thêm hiện vật |
| PATCH | `/api/admin/artifacts/:id` | Cập nhật hoặc ẩn hiện vật (`is_published`) |
| PUT | `/api/admin/artifacts/:id/translations/:lang` | Thêm hoặc sửa bản dịch |
| POST | `/api/admin/uploads` | Tải ảnh hiện vật lên (Should) |

> Mã QR trỏ tới URL ổn định như `/artifacts/tank-001`. Backend tìm hiện vật theo `slug`; không nhúng toàn bộ nội dung vào mã QR.

**Ví dụ phản hồi (chốt API contract từ ngày 1):** `GET /api/artifacts/tank-001?lang=en`

```json
{
  "slug": "tank-001",
  "image_url": "https://.../tank-001.jpg",
  "translation": {
    "language_code": "en",
    "title": "...",
    "summary": "...",
    "content": "..."
  },
  "available_languages": ["vi", "en", "zh"]
}
```

Khi thiếu bản dịch của ngôn ngữ được chọn, API trả `"translation": null` cùng `available_languages` để giao diện hiện thông báo và gợi ý ngôn ngữ khác.

## 7. Yêu cầu phi chức năng

| ID | Yêu cầu | Tiêu chí đề xuất |
| --- | --- | --- |
| NFR-01 | Hiệu năng | Danh sách và chi tiết hiện vật phản hồi trong 2 giây ở điều kiện mạng tốt, không tính thời gian tải ảnh lớn và lần gọi đầu khi backend vừa được làm nóng |
| NFR-02 | Responsive | Website dùng tốt trên điện thoại, máy tính bảng và desktop |
| NFR-03 | Bảo mật | Mật khẩu quản trị được băm (bcrypt hoặc argon2); API ghi dữ liệu yêu cầu token xác thực; giới hạn số lần đăng nhập sai |
| NFR-04 | Nhất quán | Web và app đọc cùng nguồn dữ liệu |
| NFR-05 | Khả năng sử dụng | Các thao tác quét QR, đổi ngôn ngữ và phát âm thanh dễ nhận biết |
| NFR-06 | Độ tin cậy | Hiển thị trạng thái tải, lỗi mạng, nội dung chưa dịch và lỗi âm thanh |
| NFR-07 | Chi phí | Ưu tiên gói miễn phí; không yêu cầu API AI trả phí |
| NFR-08 | Kiểm thử | Có hướng dẫn cài đặt, kiểm thử các luồng chính và dữ liệu mẫu |
| NFR-09 | Dự phòng demo | Có bản chạy local hoặc video quay sẵn khi mạng hoặc dịch vụ miễn phí gặp sự cố |

*Các con số hiệu năng là mục tiêu nghiệm thu cho đồ án, không cam kết mọi mạng và thiết bị đều đạt.*

## 8. Phạm vi MVP

Với 3 người và 5 tuần, cần giới hạn rõ phần bắt buộc.

| Mức | Nội dung |
| --- | --- |
| **Must** — Bắt buộc | Website và ứng dụng di động; danh sách, tìm kiếm, chi tiết hiện vật; QR mở đúng hiện vật; chọn và ghi nhớ ngôn ngữ; phát/dừng TTS; backend, database, dữ liệu 5 ngôn ngữ; trang quản trị tối giản (đăng nhập, thêm/sửa/ẩn hiện vật và bản dịch); triển khai bản demo cho giảng viên |
| **Should** — Nên có | Lịch sử xem và yêu thích lưu trên thiết bị; chế độ chữ lớn và chỉnh cỡ chữ; xem trước nội dung và đường dẫn QR trong trang quản trị; tải ảnh lên Supabase Storage |
| **Could** — Nếu còn thời gian | Điều chỉnh tốc độ đọc; thống kê lượt nghe; xem offline; tạo QR trong trang quản trị; build file APK Android |
| **Ngoài MVP** | GPS, bản đồ, tự động phát âm thanh khi đến gần hiện vật, AI hội thoại, dịch máy trực tiếp, quản trị nâng cao, deep link mở thẳng app |

## 9. Tiến độ

### 9.1. Mục tiêu 40% trong 3 ngày

40% trong 3 ngày nên hiểu là **hoàn thành một lát cắt chức năng có thể trình diễn**, không phải 40% số dòng code. Phần khó nhất là tích hợp ba nền tảng, nên cần chứng minh luồng chính chạy sớm.

| Ngày | Tiến độ | Việc cần đạt |
| --- | --- | --- |
| Ngày 1 | 10–15% | Khởi tạo dự án và giao diện khung: thống nhất schema, API contract, cấu trúc Git; web có trang chủ, danh sách, chi tiết bằng dữ liệu mẫu; mobile có navigation, danh sách, màn hình quét QR; backend trả được dữ liệu mẫu |
| Ngày 2 | 25–30% | Tích hợp luồng hiện vật: web và app gọi API chung; chi tiết đọc nội dung theo ngôn ngữ; QR mở đúng trang; TTS chạy ít nhất một ngôn ngữ trên mỗi nền tảng |
| Ngày 3 | **40%** | Bản demo xuyên suốt: tích hợp database và bộ dữ liệu mẫu hoàn chỉnh; luồng QR → chi tiết → đổi ngôn ngữ → nghe; tìm kiếm chạy trên web và mobile; web triển khai thử, app chạy trên thiết bị thật; ghi lỗi tồn đọng, chốt kế hoạch 4 tuần tiếp theo |

Chưa cần đủ 5 ngôn ngữ, trang quản trị hoàn chỉnh hay thiết kế cuối cùng trong 3 ngày đầu. Tuy nhiên phải thiết kế cấu trúc dữ liệu đúng từ đầu để bổ sung sau mà không phải viết lại.

### 9.2. Lộ trình 5 tuần

| Thời gian | Kết quả |
| --- | --- |
| Tuần 1 | Giao diện chính, database, API cơ bản, luồng QR đầu tiên |
| Tuần 2 | Hoàn thiện chức năng web/mobile, đa ngôn ngữ và TTS |
| Tuần 3 | Quản trị nội dung, xác thực, xử lý lỗi, kiểm thử tích hợp |
| Tuần 4 | Bổ sung chức năng Should, cải thiện responsive, sửa lỗi |
| Tuần 5 | Kiểm thử nghiệm thu, triển khai, tài liệu, chuẩn bị báo cáo/demo |

## 10. Phân công nhóm

| Thành viên | Vai trò | Công việc chính |
| --- | --- | --- |
| A | Frontend Web | React, Vite, TypeScript; trang chủ, danh sách, tìm kiếm, chi tiết; chọn ngôn ngữ, TTS, responsive; giao diện trang quản trị (ADM-01 đến ADM-05); tạo mã QR từ URL; tích hợp API, kiểm thử web, triển khai Vercel |
| B | Backend | Express, TypeScript, PostgreSQL; schema, REST API, dữ liệu mẫu; đăng nhập quản trị, CRUD hiện vật và bản dịch; Supabase Storage; kiểm thử API, cấu hình môi trường, triển khai backend |
| C | Mobile | React Native, Expo, TypeScript; navigation, danh sách, tìm kiếm, chi tiết; camera quét QR và TTS; lưu lịch sử, yêu thích, ngôn ngữ trên thiết bị; kiểm thử trên điện thoại thật |
| Cả nhóm | Nội dung và tài liệu | Soạn và rà soát 25–40 bản dịch (5 ngôn ngữ × 5–8 hiện vật), chia theo ngôn ngữ; kiểm tra thuật ngữ lịch sử; in mã QR; viết hướng dẫn chạy dự án và kiểm thử; chuẩn bị báo cáo và demo |

> Thành viên A và C cần thống nhất cấu trúc JSON và cách gọi API với backend **ngay từ ngày đầu**, nếu không cả hai giao diện sẽ phải sửa nhiều khi tích hợp.

## 11. Tiêu chí nghiệm thu

Mỗi mục phải được kiểm thử trước khi đánh dấu hoàn thành.

| ID | Tiêu chí đạt |
| --- | --- |
| AC-01 | Danh sách hiện vật hiển thị đúng dữ liệu lấy từ backend |
| AC-02 | Tìm kiếm theo tên trả về kết quả đúng; không có kết quả thì có thông báo |
| AC-03 | Quét mã QR hợp lệ mở đúng hiện vật trên cả website và app |
| AC-04 | QR không hợp lệ hoặc slug không tồn tại hiển thị thông báo dễ hiểu |
| AC-05 | Chuyển giữa các ngôn ngữ được hỗ trợ làm thay đổi đúng tiêu đề và nội dung |
| AC-06 | Phát, tạm dừng và tiếp tục thuyết minh; đổi ngôn ngữ không phát nội dung sai ngôn ngữ |
| AC-07 | Khi thiếu bản dịch hoặc TTS không khả dụng, người dùng vẫn xem được nội dung và nhận được thông báo |
| AC-08 | Quản trị viên đăng nhập hợp lệ thêm, sửa và ẩn được hiện vật cùng bản dịch |
| AC-09 | Người chưa xác thực không gọi được API quản trị để sửa dữ liệu |
| AC-10 | Web và app chạy trên thiết bị mục tiêu; các luồng chính không có lỗi nghiêm trọng |
| AC-11 | Có dữ liệu mẫu, hướng dẫn chạy dự án, hướng dẫn kiểm thử và bản demo triển khai |
| AC-12 | URL có `?lang=` mở đúng ngôn ngữ; ngôn ngữ đã chọn được ghi nhớ cho lần mở sau |
| AC-13 | Khi mất mạng, web và app hiển thị thông báo lỗi dễ hiểu và cho phép thử lại |
| AC-14 | Ảnh hiện vật hiển thị đúng và có văn bản thay thế |

**Bộ kiểm thử tối thiểu:** 3–5 hiện vật mẫu; từng ngôn ngữ có nội dung; QR hợp lệ và không hợp lệ; thử mất mạng; thử quản trị viên và tài khoản không có quyền quản trị.

## 12. Rủi ro và giả định

| Rủi ro | Cách xử lý |
| --- | --- |
| Giọng đọc đa ngôn ngữ: không phải thiết bị nào cũng đủ giọng | Thử sớm trên trình duyệt và điện thoại thật; hiện thông báo và vẫn hiển thị văn bản khi thiếu giọng |
| Chất lượng bản dịch | Cần người rà soát nội dung lịch sử, không chỉ dựa vào dịch máy |
| Khối lượng nội dung dịch lớn (25–40 bản) | Chia theo ngôn ngữ trong nhóm; hoàn thiện 3 hiện vật trước rồi mở rộng |
| Chi phí triển khai: gói miễn phí có thể đổi giới hạn | Kiểm tra điều kiện hiện hành trước khi triển khai |
| Backend chậm ở lần gọi đầu do gói miễn phí tạm dừng | Gọi `/api/health` trước demo; có bản chạy local hoặc video dự phòng |
| Dữ liệu hiện vật: số lượng, ảnh, nội dung mẫu | Thống nhất sớm; bắt đầu với 5–8 hiện vật |
| Hiểu nhầm QR mở web hay app | QR luôn là URL web; app quét riêng bên trong app |
| Phạm vi quản trị | Chỉ làm quản lý nội dung cơ bản; không phân quyền nhiều cấp, phân tích nâng cao hay quản lý nhân sự |
| Phân phối app | Demo qua Expo Go khi phát triển; nếu cần file cài đặt, dành thời gian build và kiểm thử riêng |

## 13. Quyết định đã chốt

Đây là các mặc định để bắt đầu code. Nhóm có thể đổi, nhưng cần cập nhật PRD và xem lại tiến độ.

| # | Quyết định | Lựa chọn | Phương án dự phòng |
| --- | --- | --- | --- |
| 1 | Số ngôn ngữ nghiệm thu | 5 ngôn ngữ: Việt, Anh, Trung, Nhật, Hàn | Hạ xuống 3 ngôn ngữ (Việt, Anh, Trung) nếu TTS hoặc bản dịch không kịp |
| 2 | Trang quản trị | Làm trang web tối giản: đăng nhập, thêm/sửa/ẩn hiện vật và bản dịch | Dùng dữ liệu seed trước, bổ sung giao diện ở tuần 3 |
| 3 | Cách chạy mobile | Expo Go khi phát triển; cố gắng build APK Android ở tuần 5 | Chỉ demo qua Expo Go nếu không yêu cầu file cài đặt |
| 4 | Luồng QR | QR là URL web; app có chức năng quét riêng bên trong | Deep link mở thẳng app để sau MVP |
| 5 | Nơi chạy backend | Render hoặc Railway (gói miễn phí), database trên Supabase | Chạy local khi demo nếu dịch vụ gặp sự cố |

**Bước tiếp theo:** chuyển PRD thành danh sách task theo ngày, GitHub Issues và tiêu chí hoàn thành cho từng thành viên, ưu tiên bản demo xuyên suốt trong 72 giờ đầu.
