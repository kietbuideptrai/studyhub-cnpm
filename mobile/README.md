# StudyHub

## 1. Giới thiệu dự án

StudyHub là dự án ứng dụng hỗ trợ học tập, được phát triển trong khuôn khổ môn Công nghệ phần mềm (CNPM).

Dự án được thực hiện theo nhóm, sử dụng Git và GitHub để quản lý mã nguồn, phối hợp phát triển và kiểm tra chất lượng phần mềm.

## 2. Công nghệ sử dụng

### Ứng dụng di động

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage

### Công cụ phát triển và kiểm tra

- Git và GitHub
- ESLint
- GitHub Actions
- Node.js và npm

## 3. Các chức năng hiện tại

- **Trang chủ (Home):** Màn hình chính của ứng dụng.
- **Dịch văn bản (Translate):** Chức năng dịch mẫu để kiểm tra giao diện và luồng sử dụng.
- **Lịch sử dịch (History):** Hiển thị các nội dung đã dịch.
- **Lưu trữ cục bộ:** Sử dụng AsyncStorage để lưu lịch sử dịch và duy trì dữ liệu sau khi mở lại ứng dụng.

**Lưu ý:** Chức năng dịch hiện tại vẫn sử dụng dữ liệu mẫu, chưa tích hợp API dịch từ backend.

## 4. Cấu trúc dự án

```text
studyhub-cnpm/
├── .github/
│   └── workflows/
│       └── mobile-ci.yml
├── mobile/
│   ├── src/
│   │   └── app/
│   ├── assets/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 5. Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu

- Đã cài đặt Node.js và npm.
- Có Expo Go trên điện thoại tương thích hoặc trình giả lập phù hợp.

### Bước 1: Truy cập thư mục mobile

Mở Terminal hoặc CMD tại thư mục gốc của dự án, sau đó chạy:

```bash
cd mobile
```

### Bước 2: Cài đặt các thư viện

```bash
npm install
```

### Bước 3: Khởi chạy ứng dụng

```bash
npx expo start
```

### Bước 4: Mở ứng dụng trên điện thoại

Mở Expo Go trên điện thoại và quét mã QR được hiển thị trong Terminal để chạy ứng dụng.

## 6. Kiểm tra chất lượng mã nguồn và CI/CD

Dự án sử dụng GitHub Actions để tự động kiểm tra ứng dụng di động khi có các sự kiện Git phù hợp với cấu hình workflow.

Các bước kiểm tra bao gồm:

- Cài đặt thư viện bằng `npm ci`.
- Kiểm tra quy tắc mã nguồn bằng ESLint.
- Kiểm tra kiểu dữ liệu TypeScript bằng `npx tsc --noEmit`.

File cấu hình CI nằm tại:

`.github/workflows/mobile-ci.yml`

## 7. Trạng thái phát triển

Các công việc đã thực hiện và kiểm tra:

- Khởi tạo ứng dụng React Native bằng Expo.
- Xây dựng các màn hình Home, Translate và History.
- Lưu lịch sử dịch bằng AsyncStorage.
- Kiểm thử các màn hình và khả năng duy trì lịch sử sau khi mở lại ứng dụng.
- Thiết lập GitHub Actions để kiểm tra mã nguồn và TypeScript.

Các công việc tiếp theo:

- Tích hợp API dịch với backend.
- Tiếp tục phát triển và hoàn thiện các chức năng của StudyHub.
- Bổ sung kiểm thử và cập nhật tài liệu theo tiến độ thực tế của nhóm.

## 8. Quản lý mã nguồn

Nhóm sử dụng Git và GitHub để quản lý mã nguồn, phát triển trên các nhánh riêng và sử dụng Pull Request để xem xét thay đổi trước khi hợp nhất vào nhánh đích.

## 9. Mục đích sử dụng

Dự án được xây dựng phục vụ mục đích học tập và thực hành phát triển phần mềm theo nhóm.

.
