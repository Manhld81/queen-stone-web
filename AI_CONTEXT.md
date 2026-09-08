# AI CONTEXT ANCHOR (Tệp Mỏ Neo Ngữ Cảnh) | Vibe Coding v5.0
# Giữ file này dưới 40 dòng. Cập nhật sau mỗi phiên làm việc.

## 1. PROJECT: 03. LAB 03 - Web ban Da Tu Nhien | Standard: v5.0
*Kiến trúc sư trưởng:* Anh Mike | *Thực thi:* Antigravity (Gemini)

## 2. CURRENT FOCUS: [Ví dụ: Thi công một mạch Module S01] | Mode: [ENGINEERING MODE]
# Mode hợp lệ: LEARNING MODE | ENGINEERING MODE | MAINTENANCE MODE

## 3. SOP STEP: [Chọn 1 trong 5 Chặng bên dưới]
# Chặng 1: Làm rõ Yêu cầu (REQUIREMENTS.md)
# Chặng 2: Bóc tách & Tinh chỉnh Spec (Spec_Sxx.md)
# Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md)
# Chặng 4: Dựng UI Stitch & Khóa SCREEN_LOCKED
# Chặng 5: Thi công Một Mạch (DB -> Core -> API -> UI) & Tự kiểm thử QA

## 4. TECH STACK: [Ví dụ: Electron | Node.js | SQLite | HTML/CSS/JS thuần | Stitch MCP]
## 4b. APP_TYPE: Desktop/Electron

## 5. DOCUMENT SCOPE:
- LOCKED (Cấm sửa đổi): REQUIREMENTS.md, SYSTEM_OVERVIEW.md, SCREEN_LOCKED, Spec_S01.md
- CURRENT (Được phép đọc & ghi): src/modules/s01/*, tests/test-local.js
- REFERENCE CONTRACTS (Chỉ đọc hợp đồng): schema.sql, ApiResult.ts

## 6. CONSTRAINTS (Ràng buộc kỹ thuật & Tối ưu tài nguyên):
- ApiResult<T> chuẩn bọc cho mọi kết nối Backend -> UI.
- SQLite WAL mode, Debounce nút bấm, Zero memory leak.

## 7. SESSION NOTE:
### ĐÃ HOÀN THÀNH:
- [Ví dụ: Chốt xong Requirement, Spec S01 và Giao diện Stitch SCREEN_LOCKED]
### ĐANG THI CÔNG DỞ:
- Tác vụ: [Ví dụ: Đang code một mạch Lớp 2 Core Logic cho S01]
- Điểm dừng: [Ví dụ: Đã xong schema.sql, đang viết service tính toán]
- File liên quan: [Ví dụ: src/modules/s01/service.js]
### QUYẾT ĐỊNH KỸ THUẬT:
- [Ví dụ: Tối ưu Token: Chỉ nạp Spec_S01.md, không nạp toàn bộ thư mục docs]
### CÂU LỆNH MỞ PHIÊN MỚI (nếu cần đổi context):
> Anh gõ: "Bắt đầu. Tiếp tục thi công [tên tác vụ cụ thể]."