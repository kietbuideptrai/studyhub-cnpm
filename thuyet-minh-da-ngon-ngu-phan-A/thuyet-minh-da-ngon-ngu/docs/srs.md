# Đặc tả yêu cầu phần mềm (SRS) – bản nháp

**Đề tài:** Thuyết minh tự động đa ngôn ngữ · **Phiên bản:** 0.1 (tuần 2) · **Người soạn khung:** A

> Trạng thái: A đã viết khung và các mục 1, 2, 5, 6. **C** bổ sung mục 3 (UI/UX) và **B** bổ sung use case
> phía mobile trước khi chốt. Các chỗ cần cả nhóm chốt được đánh dấu **[CHỐT]**.

## 1. Giới thiệu

**Mục đích.** Cho du khách nghe thuyết minh về điểm tham quan bằng ngôn ngữ họ chọn, mà không cần hướng
dẫn viên. Du khách quét mã QR tại điểm hoặc chọn từ danh sách, rồi nghe nội dung bằng giọng đọc của thiết bị.

**Phạm vi.** Ứng dụng Android (React Native/Expo), web (React.js) và một backend tối giản cung cấp dữ liệu.
Bối cảnh mẫu: tuyến tham quan trung tâm TP.HCM (6 điểm) **[CHỐT bối cảnh với cả nhóm]**.
Ngôn ngữ: Tiếng Việt, English, 日本語, 한국어.

**Ngoài phạm vi.** Quản lý người dùng/đăng nhập, thanh toán, dịch và sinh giọng ở server, chế độ offline hoàn chỉnh.

**Thuật ngữ.** _Điểm_: một địa điểm tham quan. _Thuyết minh_: văn bản giới thiệu điểm, được đọc bằng TTS.
_TTS_: Text-to-Speech, chuyển văn bản thành giọng nói. _Mã QR_: chuỗi định danh điểm (`TM-001`).

## 2. Mô tả tổng quát

- **Tác nhân:** Du khách (chính). Quản trị viên (chỉ ở mức Could, 1 tài khoản cố định).
- **Môi trường:** Điện thoại Android 8+ (APK) hoặc Expo Go; trình duyệt hiện đại (Chrome, Safari, Edge) cho web.
- **Phụ thuộc:** Kết nối Internet để tải dữ liệu; TTS có sẵn trên thiết bị/trình duyệt.
- **Giả định:** Nhóm khác làm backend riêng của họ, nhóm tự dựng backend tối giản để có dữ liệu thật; nội dung được dịch sẵn.

## 3. Yêu cầu chức năng

Ưu tiên theo MoSCoW. **Must** hoàn thành trước giữa kỳ (tuần 7).

| Mã    | Yêu cầu                                                                  | Ưu tiên | Nền tảng    | Phụ trách |
| ----- | ------------------------------------------------------------------------ | ------- | ----------- | --------- |
| FR-01 | Chọn ngôn ngữ; toàn bộ chữ trong ứng dụng đổi theo ngôn ngữ đã chọn      | Must    | Mobile, Web | B, C      |
| FR-02 | Xem danh sách điểm tham quan theo ngôn ngữ đã chọn                       | Must    | Mobile, Web | B, C      |
| FR-03 | Xem chi tiết điểm: tên, ảnh, mô tả, vị trí                               | Must    | Mobile, Web | B, C      |
| FR-04 | Nghe thuyết minh bằng TTS: phát, tạm dừng, dừng                          | Must    | Mobile, Web | B, C      |
| FR-05 | Quét mã QR để mở đúng điểm (báo lỗi rõ ràng khi mã không thuộc hệ thống) | Must    | Mobile      | B         |
| FR-06 | Hiển thị trạng thái đang tải / lỗi mạng / không có dữ liệu               | Must    | Mobile, Web | B, C      |
| FR-07 | Tự phát thuyết minh khi đến gần điểm (GPS, bán kính ~50 m) kèm thông báo | Should  | Mobile      | B         |
| FR-08 | Tìm kiếm / lọc điểm                                                      | Should  | Mobile, Web | B, C      |
| FR-09 | Thêm điểm hoặc ngôn ngữ mới mà không sửa code giao diện                  | Should  | Backend     | A         |
| FR-10 | Giao diện tối (dark mode), trang giới thiệu                              | Should  | Web         | C         |
| FR-11 | Trang quản trị đơn giản (1 tài khoản cố định)                            | Could   | Web, API    | C, A      |
| FR-12 | Nút "dịch tự động" gọi API dịch cho nội dung mới                         | Could   | API         | A         |

## 4. Use case chính

**UC-01: Nghe thuyết minh bằng mã QR**

| Mục            | Nội dung                                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tác nhân       | Du khách                                                                                                                                                                |
| Tiền điều kiện | Đã cài app, có Internet, đã chọn ngôn ngữ                                                                                                                               |
| Luồng chính    | 1) Chọn "Quét QR" 2) Hướng camera vào mã 3) Hệ thống tìm điểm theo mã 4) Hiển thị chi tiết điểm bằng ngôn ngữ đã chọn 5) Người dùng bấm "Nghe" 6) Thiết bị đọc nội dung |
| Luồng thay thế | 3a) Mã không thuộc hệ thống → báo lỗi, cho quét lại. 3b) Mất mạng → báo lỗi kèm nút thử lại. 4a) Chưa có bản dịch → hiện tiếng Việt kèm ghi chú                         |
| Hậu điều kiện  | Nội dung được đọc; người dùng có thể dừng bất cứ lúc nào                                                                                                                |

**UC-02: Chọn ngôn ngữ.** Người dùng mở màn hình chọn ngôn ngữ, chọn 1 trong 4 ngôn ngữ, giao diện và nội
dung điểm đổi theo; lựa chọn được ghi nhớ cho lần mở sau (**[CHỐT]** B/C xác nhận cách lưu).

**UC-03: Xem danh sách và chi tiết điểm (web).** _C bổ sung._

## 5. Yêu cầu phi chức năng

| Mã     | Yêu cầu                                                                                   | Cách kiểm chứng                     |
| ------ | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| NFR-01 | Màn hình danh sách hiển thị trong ≤ 3 giây trên 4G khi server đã "thức"                   | Đo thủ công trên máy thật           |
| NFR-02 | API phản hồi ≤ 500 ms (p95) với dữ liệu hiện tại khi server đã "thức"                     | `scripts/smoke-test.sh`, công cụ đo |
| NFR-03 | Chạy được trên Android 8+; web chạy trên Chrome/Safari/Edge bản mới, responsive từ 360 px | Test thiết bị thật + trình duyệt    |
| NFR-04 | Thêm ngôn ngữ/điểm chỉ cần thêm dữ liệu, không sửa code API                               | Xem `docs/erd.md`                   |
| NFR-05 | Không thu thập dữ liệu cá nhân; API chỉ đọc; CORS theo whitelist                          | Review cấu hình                     |
| NFR-06 | Mỗi PR phải qua lint, typecheck, test trước khi merge                                     | CI (check `quality`)                |
| NFR-07 | Giao diện thông báo rõ ràng khi thiết bị thiếu giọng đọc cho ngôn ngữ đã chọn             | Test trên máy thật                  |

## 6. Ràng buộc, rủi ro

- Backend tự dựng chỉ ở mức đủ chạy; deploy trên gói miễn phí nên có độ trễ lần gọi đầu (30–60 giây).
- Build iOS cần Apple Developer, nên chỉ demo Android (APK) và Expo Go.
- Chất lượng giọng đọc phụ thuộc thiết bị/trình duyệt.
- Rủi ro khác và cách phòng: xem `Ke_hoach_lam_viec_nhom` mục 5.

## 7. Tiêu chí nghiệm thu giữa kỳ (tuần 7)

1. Mở web (link Vercel) và APK trên điện thoại thật, cùng lấy dữ liệu thật từ API.
2. Đổi ngôn ngữ trên cả 2 nền tảng: chữ giao diện và nội dung điểm đổi theo.
3. Quét QR `TM-001` mở đúng "Dinh Độc Lập"; nghe được thuyết minh bằng ít nhất 2 ngôn ngữ.
4. CI xanh trên `main`; mỗi thành viên có commit và review PR.
