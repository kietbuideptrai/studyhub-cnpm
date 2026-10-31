# DoAn-CNPM
Multilingual artifact audio guide using QR codes

## Chạy demo Web

Yêu cầu Node.js và npm. Mở một terminal tại thư mục gốc repository:

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Mở URL Vite hiển thị (mặc định là `http://localhost:5173`). Cấu hình mẫu bật
demo mode, nên luồng tham quan dùng dữ liệu và ảnh có sẵn; không cần backend
hoặc database.

## Chạy demo App

Cài Expo Go trên điện thoại, sau đó mở một terminal khác tại thư mục gốc:

```bash
cd mobile
npm install
cp .env.example .env.local
npm start
```

Dùng Expo Go quét mã QR do Expo CLI hiển thị. Điện thoại và máy tính cần cùng
mạng Wi-Fi khi chạy qua LAN. Demo app cũng dùng dữ liệu cục bộ, không cần
backend hoặc database.

Nếu sửa biến môi trường trong `.env.local`, hãy khởi động lại Vite hoặc Expo
để nạp cấu hình mới. Chi tiết cấu hình và kiểm thử xem trong
[web/README.md](web/README.md) và [mobile/README.md](mobile/README.md).
