# API contract (v1)

Nguồn sự thật dạng máy đọc được: [`apps/api/openapi.yaml`](../apps/api/openapi.yaml). Khi chạy server,
mở **`/docs`** (Swagger UI) hoặc **`/openapi.json`**.

- Base URL local: `http://localhost:3000` · Render: `https://thuyet-minh-api.onrender.com`
- Tiền tố: `/api/v1` · Chỉ `GET` · Response JSON UTF-8
- Header `Cache-Control: public, max-age=60` (dữ liệu hầu như tĩnh)

## Quy ước

| Điều            | Quy ước                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `lang`          | Mặc định `vi`. Giá trị không hợp lệ → `400 INVALID_LANG`                                                                         |
| Fallback        | Điểm chưa có bản dịch của `lang` → trả bản tiếng Việt, `fallback: true`. Trường `lang` luôn là ngôn ngữ **thực tế** của nội dung |
| Bao bọc dữ liệu | Thành công: `{ "data": ... }`                                                                                                    |
| Lỗi             | `{ "error": { "code": "SPOT_NOT_FOUND", "message": "..." } }`                                                                    |
| Mã lỗi          | `INVALID_LANG` (400), `SPOT_NOT_FOUND` (404), `NOT_FOUND` (404), `INTERNAL_ERROR` (500)                                          |

## 4 endpoint

### 1. `GET /api/v1/languages`

```json
{
  "data": [
    { "code": "vi", "name": "Vietnamese", "nativeName": "Tiếng Việt", "ttsLocale": "vi-VN" },
    { "code": "en", "name": "English", "nativeName": "English", "ttsLocale": "en-US" },
    { "code": "ja", "name": "Japanese", "nativeName": "日本語", "ttsLocale": "ja-JP" },
    { "code": "ko", "name": "Korean", "nativeName": "한국어", "ttsLocale": "ko-KR" }
  ]
}
```

### 2. `GET /api/v1/spots?lang=en&q=market`

Danh sách điểm, **không** kèm `narration` (nhẹ). `q` (tùy chọn) lọc theo tên/mô tả ngắn.

```json
{
  "data": [
    {
      "id": 4,
      "slug": "cho-ben-thanh",
      "qrCode": "TM-004",
      "latitude": 10.7725,
      "longitude": 106.698,
      "imageUrl": null,
      "lang": "en",
      "fallback": false,
      "title": "Ben Thanh Market",
      "summary": "An iconic Saigon market with a clock tower over its main gate.",
      "availableLanguages": ["en", "ja", "ko", "vi"]
    }
  ]
}
```

### 3. `GET /api/v1/spots/{idOrSlug}?lang=ko`

`idOrSlug` là id số (`1`) hoặc slug (`dinh-doc-lap`). Như một phần tử ở trên, **thêm** trường `narration`.

```json
{
  "data": {
    "id": 1,
    "slug": "dinh-doc-lap",
    "qrCode": "TM-001",
    "latitude": 10.777,
    "longitude": 106.6955,
    "imageUrl": null,
    "lang": "ko",
    "fallback": false,
    "title": "독립궁",
    "summary": "1975년 통일을 상징하는 역사적 건축물입니다.",
    "narration": "독립궁은 건축가 응오비엣투가 설계하여 …",
    "availableLanguages": ["en", "ja", "ko", "vi"]
  }
}
```

### 4. `GET /api/v1/spots/qr/{code}?lang=ja`

Cùng định dạng với endpoint 3. `code` là **đúng chuỗi nội dung của mã QR** (`TM-001` … `TM-006`).
Không tìm thấy → `404 SPOT_NOT_FOUND`.

Ngoài ra: `GET /health` → `{ "status": "ok", "time": "..." }` (dùng để đánh thức Render trước khi demo).

## Hướng dẫn cho FE

### Biến môi trường

| App    | Biến                  | Ví dụ                                  |
| ------ | --------------------- | -------------------------------------- |
| Mobile | `EXPO_PUBLIC_API_URL` | `https://thuyet-minh-api.onrender.com` |
| Web    | `VITE_API_URL`        | `https://thuyet-minh-api.onrender.com` |

Khi dev trên điện thoại thật, **không dùng `localhost`**; dùng IP LAN của máy chạy API (ví dụ `http://192.168.1.10:3000`)
hoặc dùng URL Render.

### Quét QR (mobile)

QR chứa đúng chuỗi mã (`TM-001`). Nếu sau này QR chứa URL, FE tự cắt phần mã cuối cùng.

```ts
const res = await fetch(`${API}/api/v1/spots/qr/${encodeURIComponent(code)}?lang=${lang}`);
if (res.status === 404) return showError("Mã QR không thuộc hệ thống");
const { data } = await res.json();
```

### Đọc thuyết minh (TTS)

```ts
// Mobile (expo-speech)
Speech.speak(data.narration, { language: ttsLocale /* "ja-JP" */ });

// Web (Web Speech API)
const u = new SpeechSynthesisUtterance(data.narration);
u.lang = ttsLocale;
speechSynthesis.speak(u);
```

`ttsLocale` lấy từ `/languages` theo `data.lang`. **Lưu ý:** thiết bị/trình duyệt có thể không cài giọng
ja/ko. Hãy kiểm tra (`Speech.getAvailableVoicesAsync()` / `speechSynthesis.getVoices()`) và hiện thông báo
"Thiết bị chưa có giọng đọc cho ngôn ngữ này" thay vì im lặng. Nếu `fallback === true`, đọc bằng `vi-VN`
và hiển thị ghi chú "Chưa có bản dịch, đang dùng tiếng Việt".

### React Query (gợi ý)

```ts
useQuery({
  queryKey: ["spots", lang],
  queryFn: () => api.get(`/api/v1/spots?lang=${lang}`).then((r) => r.data),
  staleTime: 60_000,
});
```

### Khi BE chưa sẵn sàng / Render đang ngủ

- Gọi `GET /health` khi mở app để "đánh thức" sớm, và hiện trạng thái _đang tải_ (có thể 30–60 giây lần đầu).
- Dùng MSW trả đúng các JSON mẫu ở trên (đổi URL sang BE thật khi xong), hoặc chạy API local: `pnpm dev:api`.

## Quy trình đổi API

1. Mở issue/comment mô tả thay đổi, báo cả nhóm (ghi vào biên bản họp).
2. Cập nhật `openapi.yaml` + file này + test trong cùng 1 PR.
3. Thay đổi **thêm** trường: tự do. Thay đổi **đổi tên/bỏ** trường: cần B và C đồng ý, ưu tiên thêm `/api/v2`.
