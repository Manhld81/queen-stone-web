# CẨM NANG HƯỚNG DẪN NHANH VIBE CODING FRAMEWORK v5.0
*(Dành riêng cho Kiến trúc sư trưởng: Anh Mike)*

---

## 1. KHỞI TẠO DỰ ÁN MỚI TRONG 30 GIÂY

### Cách 1: Dùng tệp Batch (Nhanh nhất)
1. Nhấp đúp vào `Tao_Du_An_Moi.bat` trong thư mục Framework.
2. Nhập tên dự án mong muốn (ví dụ: `02. LAB 02 - HomeAssistant`).
3. Chọn loại ứng dụng (`[1] Desktop/Electron`, `[2] Web/Express`, `[3] CLI/Node`, `[4] IoT/MQTT`).
4. Nhấn **Enter** → Dự án mới được tự động tạo hoàn chỉnh tại thư mục cha, tự sinh đầy đủ các tệp hồ sơ thiết kế (`REQUIREMENTS.md`, `SYSTEM_OVERVIEW.md`, `AI_CONTEXT.md`, `GEMINI.md`) và khởi tạo Git ban đầu.

---

## 2. QUY TRÌNH 2 PHA CHUẨN MỰC KHI LÀM VIỆC VỚI EM (AI)

Khi mở thư mục dự án trong IDE và gõ **"Bắt đầu"**, quy trình sẽ diễn ra theo đúng 2 Pha độc lập:

### 🏛️ PHA 1: ANH MIKE LÀ KIẾN TRÚC SƯ TRƯỞNG (DUYỆT HỒ SƠ THIẾT KẾ)
1. **Chặng 1 — Yêu cầu tổng thể (`REQUIREMENTS.md`):**
   - Em gửi đúng 1 Bảng Ma Trận Phỏng Vấn 4 Trục.
   - Hai anh em chốt `IN-SCOPE` (bắt buộc) vs `OUT-OF-SCOPE` (cấm tự thêm).
   - Anh Mike gõ duyệt: **"Chốt Requirement"** (`REQUIREMENTS_LOCKED`).
2. **Chặng 2 — Bóc tách & Tinh chỉnh Spec (`Spec_Sxx.md`):**
   - Từ Requirement, Em tự bóc tách thành các bản Spec chi tiết (luồng thao tác, dữ liệu vào/ra, màn hình Zero/Active, 10 góc khuất).
   - Hai anh em cùng rà soát, tinh chỉnh từng bản Spec.
   - Anh Mike gõ duyệt: **"Chốt Spec S01"** (`SPEC_LOCKED`).
3. **Chặng 3 — Bản vẽ Kiến trúc Bình dân (`SYSTEM_OVERVIEW.md`):**
   - Em xuất bản vẽ kiến trúc viết bằng ngôn ngữ đời thường (Mặt tiền, Đường ống, Bộ não, Két sắt) để giải thích cơ chế vận hành thực tế trên máy tính của Anh.
   - Anh Mike gõ duyệt: **"Chốt Kiến trúc"** (`ARCHITECTURE_LOCKED`).
4. **Chặng 4 — Thiết kế Giao diện qua Stitch MCP:**
   - **Chỉ khi Spec đã chốt**, Em mới kết nối Stitch MCP dựng UI bám sát từng trường trong Spec.
   - Anh Mike xem preview trực quan, gọt giũa chi tiết thừa.
   - Anh Mike gõ duyệt: **"Chốt Giao diện"** (`SCREEN_LOCKED`).
   - 🏁 **KẾT THÚC VAI TRÒ CỦA ANH MIKE:** Toàn bộ hồ sơ thiết kế thi công đã đóng dấu đỏ. Anh bàn giao phần còn lại cho Em!

---

### 🚀 PHA 2: EM TỔNG THẦU THI CÔNG TỰ HÀNH (CODE MỘT MẠCH TỪ A-Z)
Sau khi Anh chốt xong Pha 1:
1. **Em tự động Code một mạch 4 lớp kỹ thuật:**
   - *Lớp 1 (Móng):* Tạo `schema.sql`, bảng, SQLite WAL mode, chỉ mục index.
   - *Lớp 2 (Khung):* Viết các hàm logic tính toán, xử lý nghiệp vụ theo đúng Spec.
   - *Lớp 3 (Đường ống):* Giao tiếp Backend -> UI qua vỏ bọc chuẩn `ApiResult<T>`.
   - *Lớp 4 (Hoàn thiện):* Gắn dữ liệu thật và sự kiện vào giao diện Stitch đã khóa.
2. **Em tự tối ưu tài nguyên kép:**
   - App nhẹ: RAM thấp, chống đơ nút bấm (Debounce), CSDL an toàn không sợ mất điện.
   - Tiết kiệm Token: Áp dụng Context Paging (chỉ nạp đúng Spec đang làm), không spam code ra màn hình chat.
3. **Em tự kiểm định QA bằng máy & Tự vá lỗi (Self-healing):**
   - Tự chạy chuỗi lệnh: `lint` ➔ `check-tags` ➔ `scan-secrets` ➔ `test:local`.
   - Nếu có lỗi đỏ, Em tự đọc log và tự sửa cho tới khi 100% XANH.
4. **Bàn giao thành phẩm:**
   - Chạy full kiểm định, đưa CSDL về trạng thái sạch sẽ.
   - Mời Anh Mike click đúp `Chay_Ung_Dung.bat` để tận hưởng sản phẩm hoàn thiện!

---

## 3. BỘ LỆNH KIỂM THỬ BẰNG MÁY (CLI QA TOOLS)

| Lệnh npm | Chức năng | Tiêu chuẩn đạt |
|---|---|---|
| `npm run lint` | Quét toàn vẹn cú pháp JS + cấu trúc file | Không có lỗi đỏ |
| `npm run check-tags` | Kiểm tra cân bằng thẻ HTML 1:1 | Không lệch thẻ |
| `npm run scan-secrets` | Quét phát hiện API Key/Mật khẩu bị lộ trong code | Báo Xanh (Zero Leak) |
| `npm run test:local` | Chạy QA Tầng A cục bộ (Positive + Negative test) | 100% PASS |
| `npm run check-docs` | Đối soát 18 tiêu chí đồng bộ giữa Tài liệu và Mã nguồn | Báo Xanh (100% Sync) |
| `npm run test:migration` | Kiểm thử di trú CSDL bảo toàn dữ liệu | Dữ liệu cũ không mất |
| `npm test` | Chạy toàn bộ test suite hệ thống | 100% PASS |
| `npm run qa:full` | Chạy toàn bộ 4 công cụ QA trước khi Release | 100% Báo Xanh |

---

## 4. BA CHẾ ĐỘ VẬN HÀNH (OPERATIONAL MODES)

- **MODE 1: LEARNING** *(Học tập hộp trắng)*: Dùng khi Anh muốn học công nghệ mới (MQTT, ESP32, WAL...). Em giải thích luồng dữ liệu trực quan trước khi viết code.
- **MODE 2: ENGINEERING** *(Mặc định)*: Tự động thi công một mạch từ A-Z & tự chạy QA máy.
- **MODE 3: MAINTENANCE** *(Sửa nhanh)*: Sửa lỗi nhỏ 3 bước: Inspect → Patch → Verify.
