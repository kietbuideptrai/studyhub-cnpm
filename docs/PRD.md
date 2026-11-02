# PRD — Thuyết minh tự động đa ngôn ngữ

**Phiên bản 1.1 — cập nhật phạm vi MVP.** Hệ thống thuyết minh hiện vật qua mã QR, hỗ trợ 5 ngôn ngữ và giọng đọc tổng hợp (TTS), gồm website, ứng dụng di động và backend. MVP không có CMS; dữ liệu được quản lý qua seed hoặc database.

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
| Quản lý dữ liệu | Dùng seed hoặc database; không có giao diện quản trị trong MVP |

## 2. Người dùng và nhu cầu

| Vai trò | Nhu cầu chính |
| --- | --- |
| Visitor — Khách tham quan | Tìm hiện vật, quét QR, đổi ngôn ngữ, đọc và nghe thuyết minh |
| Người phụ trách nội dung (ngoài MVP) | Cập nhật dữ liệu hiện vật và bản dịch qua seed/database; không thao tác qua CMS của sản phẩm |

**User stories:**

- Là khách tham quan, tôi muốn quét QR để mở đúng hiện vật mà không cần tìm thủ công.
- Là khách nước ngoài, tôi muốn chọn ngôn ngữ mình hiểu để tiếp nhận thông tin.
- Là người muốn nghe thuyết minh, tôi muốn phát, tạm dừng và tiếp tục âm thanh.
- Là người khó đọc chữ, tôi muốn có giọng đọc và giao diện dễ sử dụng.
- Ngoài MVP: người phụ trách nội dung muốn quản lý hiện vật bằng giao diện CMS.

## 3. Yêu cầu chức năng

Mỗi chức năng có mã định danh để dễ phân công, theo dõi tiến độ và kiểm thử.

### 3.1. Website

| ID | Chức năng | Mức độ |
| --- | --- | --- |
| WEB-01 | Trang chủ giới thiệu sản phẩm và lối vào danh sách hiện vật | Must |
| WEB-02 | Danh sách hiện vật dạng thẻ có ảnh, tên và mô tả ngắn theo ngôn ngữ đang chọn | Must |
| WEB-03 | Tìm kiếm theo tên tiếng Việt hoặc tiếng Anh, độc lập với ngôn ngữ nội dung đang hiển thị | Must |
| WEB-04 | Mở trang chi tiết hiện vật theo slug hoặc mã QR | Must |
| WEB-05 | Chọn ngôn ngữ nội dung, ghi nhớ lựa chọn và hỗ trợ `?lang=` trên URL | Must |
| WEB-06 | Phát, tạm dừng, tiếp tục và phát lại TTS; dừng khi đổi ngôn ngữ hoặc rời trang | Must |
| WEB-07 | Hiển thị trạng thái tải, lỗi mạng, hiện vật không tồn tại và nội dung/bản dịch chưa khả dụng | Must |
| WEB-08 | Khi thiếu bản dịch, hỏi người dùng trước khi dùng nội dung tiếng Anh dự phòng | Must |
| WEB-09 | Trải nghiệm mobile-first, đọc được và thao tác được bằng cảm ứng, bàn phím và screen reader | Must |

**Luồng chính:** Quét QR bằng camera điện thoại → mở URL hiện vật → chọn ngôn ngữ → xem nội dung → (tùy chọn) nghe thuyết minh.

> QR chứa URL web ổn định, ví dụ `https://<domain>/artifacts/tank-001`. Có thể thêm `?lang=ja` để mở sẵn đúng ngôn ngữ. Website không bắt buộc có chức năng quét QR bên trong trang vì camera điện thoại mở trực tiếp đường dẫn.

**Quy tắc QR giữa web và app:** QR in tại hiện vật luôn là URL web, nên camera điện thoại mở website. Ứng dụng di động có chức năng quét riêng bên trong app và đọc cùng URL đó để lấy `slug`. Deep link mở thẳng app không thuộc MVP.

**Quy tắc tìm kiếm:** Tìm theo tên tiếng Việt gốc hoặc tên tiếng Anh; không phân biệt chữ hoa/thường; có thể khớp một phần tên. Tìm kiếm không đổi theo ngôn ngữ đang chọn để đọc nội dung. Không bắt buộc tìm tiếng Việt không dấu hoặc theo tên tiếng Trung, Nhật, Hàn; không dịch hay mở rộng từ khóa bằng AI.

**Quy tắc thiếu bản dịch:** Không tự đổi lựa chọn ngôn ngữ. Nếu thiếu bản dịch đã chọn nhưng có tiếng Anh, hiển thị hộp thoại với tiêu đề **“Chưa có bản dịch”**, nội dung **“Hiện chưa có nội dung bằng ngôn ngữ bạn chọn. Bạn có muốn xem nội dung bằng tiếng Anh không?”** và hai lựa chọn **“Xem tiếng Anh”** / **“Hủy”**. Chỉ khi xác nhận mới tải và hiển thị nội dung tiếng Anh; phải ghi rõ nội dung hiện tại là tiếng Anh. Hủy giữ nguyên ngữ cảnh, không tự chuyển ngôn ngữ. Nếu không có cả bản dịch đã chọn lẫn tiếng Anh, hiển thị thông báo nội dung chưa khả dụng, không để trang trắng. Không tự phát TTS trong các trường hợp này.

**Quy tắc TTS:** Chỉ phát khi người dùng chủ động bấm nút. Khi đổi ngôn ngữ hoặc rời/chuyển trang hiện vật, dừng ngay và xóa phần đọc đang chờ; ngôn ngữ mới không tự phát. Không cho phép nhiều luồng đọc đồng thời. Nếu không có voice phù hợp hoặc phát thất bại do thiếu voice, hiển thị chính xác **“Hiện giờ chưa có voice”**, giữ nội dung văn bản và không giả vờ đang phát hay tự chuyển sang voice/ngôn ngữ khác. Điều chỉnh tốc độ đọc không thuộc MVP.

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
| APP-08 | Danh sách yêu thích lưu trên thiết bị (tab Yêu thích) | Should |
| APP-09 | Điều chỉnh cỡ chữ | Should |
| APP-10 | Kiểm thử các luồng chính bằng VoiceOver hoặc TalkBack trên thiết bị phù hợp | Must |

**Các tab:** Trang chủ – Hiện vật – **Quét QR** (ở giữa, nổi bật hơn) – Yêu thích – Cá nhân. Tab Cá nhân chứa ngôn ngữ và cỡ chữ. Lịch sử xem và điều chỉnh tốc độ đọc không thuộc phạm vi nghiệm thu MVP.

### 3.3. Quản trị nội dung

CMS và giao diện quản trị không thuộc phạm vi MVP. Dữ liệu hiện vật và bản dịch được quản lý bằng seed data hoặc thao tác trực tiếp trên database có kiểm soát. Các thành phần quản trị/API đã có trong codebase được giữ nguyên trong lần rà soát phạm vi này; không cần hoàn thiện, mở rộng hay xóa chúng để đạt nghiệm thu MVP. Có thể xem xét CMS ở giai đoạn sau.

| ID | Chức năng | Mức độ |
| --- | --- | --- |
| ADM-01–ADM-08 | Đăng nhập, CRUD nội dung, upload ảnh, thống kê và tạo QR trong trang quản trị | Ngoài MVP |

> Mã QR có thể được tạo từ URL hiện vật bằng công cụ/thư viện sẵn có trong bước chuẩn bị dữ liệu; không cần giao diện quản trị để tạo QR.

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
- Toàn bộ thao tác chính trên web dùng được bằng bàn phím; focus nhìn thấy rõ, thứ tự hợp lý, không tạo bẫy bàn phím. Hộp thoại quản lý focus và trả focus về nút đã mở nó khi đóng.
- Hỗ trợ zoom trình duyệt đến 200% mà không mất nội dung hoặc chức năng; không vô hiệu hóa zoom.
- Nội dung chính có cỡ chữ tối thiểu 16 CSS px; tương phản tối thiểu 4.5:1 cho văn bản thông thường; không dựa duy nhất vào màu sắc để biểu thị trạng thái.
- Các nút chính có vùng chạm tối thiểu 44 × 44 CSS px và khoảng cách phù hợp.
- Ảnh hiện vật có văn bản thay thế (alt text).
- Khi TTS không khả dụng, vẫn hiển thị đầy đủ nội dung văn bản.
- Dùng cấu trúc heading, tên nút và thuộc tính ngôn ngữ phù hợp cho screen reader; cập nhật ngôn ngữ của vùng nội dung khi đổi bản dịch. Trạng thái TTS và lỗi quan trọng được thông báo mà không lặp liên tục.
- Hộp thoại fallback có tiêu đề, nội dung và nút được screen reader nhận diện.
- Kiểm thử các luồng chính trên mobile bằng VoiceOver hoặc TalkBack trên thiết bị phù hợp.

## 5. Đề xuất công nghệ

Dùng **TypeScript** làm ngôn ngữ chính để ba thành viên dùng chung kiểu dữ liệu và giảm lỗi tích hợp — phù hợp nhóm nhỏ đã chia Web, Backend, Mobile.

| Thành phần | Công nghệ | Lý do |
| --- | --- | --- |
| Frontend Web | React + Vite + TypeScript, triển khai trên Vercel | Dễ phát triển giao diện, phù hợp vai trò frontend |
| Backend API | Node.js + Express + TypeScript, chạy trên Render hoặc Railway (gói miễn phí) | Gọn, cung cấp REST API đọc hiện vật và bản dịch cho web/app |
| Database | PostgreSQL trên Supabase | Một database dùng chung cho web và app; nội dung MVP được nạp bằng seed hoặc quản lý trực tiếp |
| Lưu trữ ảnh | URL ảnh hiện có; Supabase Storage chỉ xem xét sau MVP | Upload ảnh qua giao diện không thuộc MVP |
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
| `artifacts` | Hiện vật | `id`, `slug` (duy nhất), `name` (tên tiếng Việt gốc, dùng tìm kiếm), `image_url`, `category`, `is_published`, `created_at`, `updated_at` |
| `artifact_translations` | Nội dung đa ngôn ngữ | `id`, `artifact_id`, `language_code`, `title`, `summary`, `content`, `updated_at` |
| `admin_users` | Tài khoản quản trị cho giai đoạn sau, không bắt buộc dùng trong MVP | `id`, `email` (duy nhất), `password_hash`, `created_at` |

- Mỗi hiện vật có nhiều bản dịch; `artifact_id` liên kết sang bảng hiện vật.
- Ràng buộc: `slug` là duy nhất; cặp (`artifact_id`, `language_code`) là duy nhất.
- Ẩn hiện vật bằng `is_published = false`; không xóa cứng ở MVP.
- `name` là tên gốc tiếng Việt; dùng làm từ khóa tìm kiếm cùng `title` của bản dịch tiếng Anh. Tên hiển thị lấy từ `title` theo ngôn ngữ yêu cầu.
- Bảng `languages` có thể thêm sau. Lịch sử xem và yêu thích lưu trên thiết bị, không cần thêm bảng.

### 6.2. REST API tối thiểu

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/artifacts?lang=en&q=từ-khóa` | Danh sách hiện vật có nội dung theo `lang`; `q` khớp tên tiếng Việt hoặc tiếng Anh, không phân biệt hoa/thường, độc lập với `lang` |
| GET | `/api/artifacts/:slug?lang=en` | Chi tiết hiện vật theo ngôn ngữ, kèm danh sách ngôn ngữ có sẵn |
| GET | `/api/languages` | Danh sách ngôn ngữ |
| GET | `/api/health` | Kiểm tra tình trạng backend và database riêng biệt; dùng để xác nhận sẵn sàng trước demo |

> Mã QR trỏ tới URL ổn định như `/artifacts/tank-001`. Backend tìm hiện vật theo `slug`; không nhúng toàn bộ nội dung vào mã QR.

Các API quản trị và upload không thuộc MVP. Nếu chúng đã tồn tại, giữ nguyên nhưng không xem việc hoàn thiện chúng là điều kiện nghiệm thu.

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

Khi thiếu bản dịch của ngôn ngữ được chọn, API trả `"translation": null` cùng `available_languages`. Nếu có tiếng Anh, giao diện hỏi người dùng trước khi gọi lại API với `lang=en`. Ngôn ngữ người dùng đã chọn/ghi nhớ không đổi; giao diện phải phân biệt rõ ngôn ngữ đang chọn với ngôn ngữ của nội dung fallback. Nếu tiếng Anh cũng thiếu, hiển thị thông báo nội dung chưa khả dụng.

## 7. Yêu cầu phi chức năng

| ID | Yêu cầu | Tiêu chí đề xuất |
| --- | --- | --- |
| NFR-01 | Hiệu năng | Mục tiêu hiển thị nội dung chính trong tối đa 3 giây trên mạng di động kiểm thử đã thống nhất; loại trừ tải ảnh lớn và lần gọi đầu sau khi backend ngủ |
| NFR-02 | Responsive | Mobile-first; không có cuộn ngang ngoài ý muốn, tràn/cắt nội dung hoặc điều khiển bị che ở viewport 320, 375, 390, 768 và 1440 CSS px |
| NFR-03 | Bảo mật | API đọc công khai chỉ trả hiện vật đã xuất bản; nếu API ghi/quản trị được giữ lại thì phải tiếp tục yêu cầu xác thực và bảo vệ phù hợp |
| NFR-04 | Nhất quán | Web và app đọc cùng nguồn dữ liệu |
| NFR-05 | Khả năng sử dụng | Luồng QR → chi tiết → đổi ngôn ngữ → phát TTS hoàn thành bằng cảm ứng thông thường, không cần zoom thủ công hoặc chuột |
| NFR-06 | Độ tin cậy | Hiển thị trạng thái tải, lỗi mạng, nội dung chưa dịch và lỗi TTS; TTS không tiếp tục phát sai nội dung/ngôn ngữ |
| NFR-07 | Chi phí | Ưu tiên gói miễn phí; không yêu cầu API AI trả phí |
| NFR-08 | Kiểm thử | Có hướng dẫn cài đặt, kiểm thử các luồng chính và dữ liệu mẫu |
| NFR-09 | Dự phòng demo | Có bản chạy local hoặc video quay sẵn khi mạng hoặc dịch vụ miễn phí gặp sự cố |

**Cách đo NFR-01:** trước nghiệm thu, nhóm ghi rõ thiết bị/trình duyệt và cấu hình mạng di động dùng để kiểm thử; đo từ lúc mở URL hiện vật đến khi nội dung chính hiển thị. Không tuyên bố đạt nếu chưa đo trong điều kiện đã thống nhất.

*Các con số hiệu năng là mục tiêu nghiệm thu cho đồ án, không cam kết mọi mạng và thiết bị đều đạt.*

## 8. Phạm vi MVP

Với 3 người và 5 tuần, cần giới hạn rõ phần bắt buộc.

| Mức | Nội dung |
| --- | --- |
| **Must** — Bắt buộc | Website mobile-first và ứng dụng di động; danh sách, tìm kiếm theo tên Việt/Anh, chi tiết; QR mở đúng hiện vật; 5 ngôn ngữ; ghi nhớ lựa chọn ngôn ngữ; fallback tiếng Anh có xác nhận khi thiếu bản dịch; TTS phát/tạm dừng/tiếp tục/phát lại và dừng đúng lúc; backend/database; dữ liệu mẫu; tiếp cận tối thiểu; triển khai demo |
| **Should** — Nên có | Danh sách yêu thích trên thiết bị; chỉnh cỡ chữ bổ sung ngoài khả năng zoom trình duyệt; build APK Android nếu cần |
| **Ngoài MVP** | Lịch sử xem; điều chỉnh tốc độ đọc; CMS/giao diện quản trị; upload ảnh qua giao diện quản trị; thống kê lượt nghe; xem offline; tạo QR trong trang quản trị; GPS, bản đồ, tự phát âm thanh khi đến gần hiện vật, AI hội thoại, dịch máy trực tiếp, deep link mở thẳng app |

MVP không cần CMS: nội dung được quản lý bằng seed data hoặc thao tác database có kiểm soát. Code quản trị/lịch sử đã có không bị xóa trong lần cập nhật phạm vi này; các tính năng đó không thuộc điều kiện nghiệm thu và không được mở rộng nếu không có quyết định phạm vi riêng.

## 9. Tiến độ

### 9.1. Mục tiêu 40% trong 3 ngày

40% trong 3 ngày nên hiểu là **hoàn thành một lát cắt chức năng có thể trình diễn**, không phải 40% số dòng code. Phần khó nhất là tích hợp ba nền tảng, nên cần chứng minh luồng chính chạy sớm.

| Ngày | Tiến độ | Việc cần đạt |
| --- | --- | --- |
| Ngày 1 | 10–15% | Khởi tạo dự án và giao diện khung: thống nhất schema, API contract, cấu trúc Git; web có trang chủ, danh sách, chi tiết bằng dữ liệu mẫu; mobile có navigation, danh sách, màn hình quét QR; backend trả được dữ liệu mẫu |
| Ngày 2 | 25–30% | Tích hợp luồng hiện vật: web và app gọi API chung; chi tiết đọc nội dung theo ngôn ngữ; QR mở đúng trang; TTS chạy ít nhất một ngôn ngữ trên mỗi nền tảng |
| Ngày 3 | **40%** | Bản demo xuyên suốt: tích hợp database và bộ dữ liệu mẫu hoàn chỉnh; luồng QR → chi tiết → đổi ngôn ngữ → nghe; tìm kiếm chạy trên web và mobile; web triển khai thử, app chạy trên thiết bị thật; ghi lỗi tồn đọng, chốt kế hoạch 4 tuần tiếp theo |

Trong lát cắt 3 ngày đầu, có thể bắt đầu với ít hiện vật và chưa hoàn tất toàn bộ bản dịch. Tuy nhiên, nghiệm thu MVP cuối cùng yêu cầu đủ 5 ngôn ngữ. Không làm CMS để đạt mốc này; quản lý dữ liệu qua seed/database.

### 9.2. Lộ trình 5 tuần

| Thời gian | Kết quả |
| --- | --- |
| Tuần 1 | Giao diện chính, database, API cơ bản, luồng QR đầu tiên |
| Tuần 2 | Hoàn thiện chức năng web/mobile, đa ngôn ngữ và TTS |
| Tuần 3 | Fallback bản dịch, xử lý lỗi, responsive/accessibility và kiểm thử tích hợp |
| Tuần 4 | Hoàn thiện 5 ngôn ngữ, kiểm thử thiết bị thật, tối ưu hiệu năng và sửa lỗi |
| Tuần 5 | Kiểm thử nghiệm thu, triển khai, tài liệu, chuẩn bị báo cáo/demo |

## 10. Phân công nhóm

| Thành viên | Vai trò | Công việc chính |
| --- | --- | --- |
| A | Frontend Web | React, Vite, TypeScript; trang chủ, danh sách, tìm kiếm Việt/Anh độc lập ngôn ngữ, chi tiết, fallback bản dịch; lựa chọn ngôn ngữ, TTS, mobile-first, responsive/accessibility; tích hợp API, kiểm thử web, triển khai Vercel |
| B | Backend | Express, TypeScript, PostgreSQL; schema hiện có, REST API đọc, tìm kiếm theo tên Việt/Anh, dữ liệu mẫu/seed; health/readiness backend và database; kiểm thử API, cấu hình môi trường, triển khai backend. Không mở rộng CMS trong MVP |
| C | Mobile | React Native, Expo, TypeScript; navigation, danh sách, tìm kiếm, chi tiết; camera quét QR, TTS, ngôn ngữ trên thiết bị; yêu thích nếu còn thời gian; kiểm thử cảm ứng và VoiceOver/TalkBack trên điện thoại thật. Không mở rộng lịch sử xem |
| Cả nhóm | Nội dung và tài liệu | Hoàn thiện tối thiểu 3 hiện vật × 5 ngôn ngữ (15 bản dịch) cho nghiệm thu; mở rộng lên 5–8 hiện vật nếu đủ thời gian; rà soát thuật ngữ lịch sử, chuẩn bị QR, hướng dẫn kiểm thử và demo |

> Thành viên A và C cần thống nhất cấu trúc JSON và cách gọi API với backend **ngay từ ngày đầu**, nếu không cả hai giao diện sẽ phải sửa nhiều khi tích hợp.

> Code hiện có có một số chức năng ngoài phạm vi mới (ví dụ CMS web và lịch sử xem). Phân công này chỉ giới hạn công việc/tiêu chí MVP; không phải yêu cầu xóa các chức năng đó.

## 11. Tiêu chí nghiệm thu

Mỗi mục phải được kiểm thử trước khi đánh dấu hoàn thành.

| ID | Tiêu chí đạt |
| --- | --- |
| AC-01 | Danh sách hiện vật hiển thị đúng dữ liệu lấy từ backend |
| AC-02 | Tìm kiếm khớp tên tiếng Việt hoặc tiếng Anh, không phân biệt hoa/thường và không phụ thuộc ngôn ngữ nội dung đang chọn; không có kết quả thì có thông báo. Không bắt buộc tìm tiếng Việt không dấu |
| AC-03 | Quét mã QR hợp lệ mở đúng hiện vật trên cả website và app |
| AC-04 | QR không hợp lệ hoặc slug không tồn tại hiển thị thông báo dễ hiểu |
| AC-05 | Cả 5 ngôn ngữ đổi đúng tiêu đề/nội dung; ngôn ngữ đang dùng được khai báo đúng cho vùng nội dung |
| AC-06 | TTS phát, tạm dừng, tiếp tục và phát lại đúng trạng thái; đổi ngôn ngữ/rời trang dừng nội dung cũ; không phát tự động hoặc tạo luồng đọc chồng |
| AC-07 | Khi thiếu voice, hiển thị đúng “Hiện giờ chưa có voice”, vẫn đọc được văn bản và không tự dùng voice ngôn ngữ khác |
| AC-08 | Khi thiếu bản dịch nhưng có tiếng Anh, hiện đúng hộp thoại; xác nhận mới chuyển sang tiếng Anh, hủy không đổi lựa chọn; nếu thiếu cả tiếng Anh thì báo nội dung chưa khả dụng |
| AC-09 | Web không tràn/cắt nội dung, không có cuộn ngang ngoài ý muốn; popup và điều khiển dùng được ở viewport 320, 375, 390, 768 và 1440 CSS px |
| AC-10 | Web dùng được bằng bàn phím, zoom 200% không mất chức năng; chữ chính tối thiểu 16 CSS px, tương phản văn bản thường đạt 4.5:1, nút chính có vùng chạm 44 × 44 CSS px |
| AC-11 | Các luồng chính có nhãn/heading/alt text và trạng thái phù hợp cho screen reader; mobile kiểm thử bằng VoiceOver hoặc TalkBack |
| AC-12 | Web và app chạy trên thiết bị mục tiêu; các luồng chính không có lỗi nghiêm trọng |
| AC-13 | Có tối thiểu 3 hiện vật với đủ 5 bản dịch mỗi hiện vật; có hướng dẫn chạy, kiểm thử và bản demo triển khai |
| AC-14 | URL có `?lang=` mở đúng ngôn ngữ; lựa chọn ngôn ngữ được ghi nhớ |
| AC-15 | Khi mất mạng, web và app hiển thị lỗi dễ hiểu và cho phép thử lại |
| AC-16 | Ảnh hiện vật hiển thị đúng, không méo và có văn bản thay thế phù hợp |
| AC-17 | Đo thời gian đến khi nội dung chính hiển thị theo thiết bị/trình duyệt và cấu hình mạng di động đã ghi nhận; mục tiêu không quá 3 giây |
| AC-18 | `/api/health` thể hiện riêng backend và database để có thể xác nhận trạng thái sẵn sàng trước demo |

CMS, đăng nhập quản trị, CRUD qua giao diện, lịch sử xem và tốc độ TTS không phải tiêu chí nghiệm thu MVP. Nếu API ghi/quản trị vẫn được triển khai, các kiểm soát bảo mật hiện có không được suy giảm.

**Bộ kiểm thử tối thiểu:** 3 hiện vật × 5 ngôn ngữ; QR hợp lệ, sai định dạng và slug không tồn tại; tìm kiếm tiếng Việt/Anh khi chọn ngôn ngữ khác; thiếu bản dịch/cả bản dịch tiếng Anh; thiếu voice; đổi ngôn ngữ và rời trang khi đang phát; mất mạng; các viewport và kiểm thử accessibility ở trên.

## 12. Rủi ro và giả định

| Rủi ro | Cách xử lý |
| --- | --- |
| Giọng đọc đa ngôn ngữ: không phải thiết bị nào cũng đủ giọng | Thử sớm trên trình duyệt và điện thoại thật; hiện thông báo và vẫn hiển thị văn bản khi thiếu giọng |
| Chất lượng bản dịch | Cần người rà soát nội dung lịch sử, không chỉ dựa vào dịch máy |
| Khối lượng nội dung dịch | Ưu tiên hoàn thiện 3 hiện vật đủ 5 ngôn ngữ trước; chỉ mở rộng số hiện vật sau khi luồng xuyên suốt đạt |
| Chi phí triển khai: gói miễn phí có thể đổi giới hạn | Kiểm tra điều kiện hiện hành trước khi triển khai |
| Backend chậm ở lần gọi đầu do gói miễn phí tạm dừng | Gọi `/api/health` trước demo; có bản chạy local hoặc video dự phòng |
| Thiếu bản dịch/voice | Kiểm thử các nhánh fallback và bảo đảm văn bản vẫn truy cập được; không tự phát hoặc đổi voice |
| Hiệu năng và bố cục trên điện thoại | Đo trên thiết bị/mạng đã thống nhất và kiểm thử các viewport nghiệm thu trước khi chốt |
| Dữ liệu hiện vật: số lượng, ảnh, nội dung mẫu | Thống nhất sớm; mốc tối thiểu 3 hiện vật đủ 5 ngôn ngữ |
| Hiểu nhầm QR mở web hay app | QR luôn là URL web; app quét riêng bên trong app |
| Phân phối app | Demo qua Expo Go khi phát triển; nếu cần file cài đặt, dành thời gian build và kiểm thử riêng |

## 13. Quyết định đã chốt

Đây là các mặc định để bắt đầu code. Nhóm có thể đổi, nhưng cần cập nhật PRD và xem lại tiến độ.

| # | Quyết định | Lựa chọn | Phương án dự phòng |
| --- | --- | --- | --- |
| 1 | Số ngôn ngữ nghiệm thu | 5 ngôn ngữ: Việt, Anh, Trung, Nhật, Hàn | Chỉ giảm số ngôn ngữ nếu nhóm/giảng viên chấp thuận đổi phạm vi; không tự hạ yêu cầu trong quá trình triển khai |
| 2 | Quản lý dữ liệu | Không làm CMS trong MVP; dùng seed data hoặc thao tác database có kiểm soát | Xem xét CMS ở giai đoạn sau; code quản trị đang tồn tại được giữ nguyên nhưng không mở rộng |
| 3 | Cách chạy mobile | Expo Go khi phát triển; cố gắng build APK Android ở tuần 5 | Chỉ demo qua Expo Go nếu không yêu cầu file cài đặt |
| 4 | Luồng QR | QR là URL web; app có chức năng quét riêng bên trong | Deep link mở thẳng app để sau MVP |
| 5 | Nơi chạy backend | Render hoặc Railway (gói miễn phí), database trên Supabase | Chạy local khi demo nếu dịch vụ gặp sự cố |

**Bước tiếp theo:** chuyển PRD thành danh sách task theo ngày, GitHub Issues và tiêu chí hoàn thành cho từng thành viên, ưu tiên bản demo xuyên suốt trong 72 giờ đầu.
