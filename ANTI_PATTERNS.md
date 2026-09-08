# ANTI_PATTERNS.md — DANH SÁCH LỖI CẤM TÁI PHẠM
# Vibe Coding Framework v4.2.1 | Tác giả: Anh Mike & Antigravity
# Cập nhật khi phát hiện bẫy kỹ thuật mới — AI đọc file này trước khi code liên quan.

---

## ❌ AP-01: Hardcode API Key / Secret vào mã nguồn
**Triệu chứng:** `const CLIENT_SECRET = "ABC123..."` trong file .js
**Hậu quả:** Lộ bí mật lên Git, rủi ro bảo mật nghiêm trọng.
**Chuẩn đúng:** Dùng `.env` (bị .gitignore) + `core_modules/env.js` nạp động.
**Phát hiện tự động:** `npm run scan-secrets` (Lớp QA 6)

---

## ❌ AP-02: Dùng `fs.unlinkSync()` cho thao tác xóa của người dùng
**Triệu chứng:** `fs.unlinkSync(filePath)` trong handler xóa file.
**Hậu quả:** Xóa vĩnh viễn không qua Thùng Rác — người dùng không thể khôi phục.
**Chuẩn đúng:** `require('electron').shell.trashItem(filePath)` — xóa an toàn qua Recycle Bin.
**Phát hiện:** Grep `fs.unlinkSync` trước khi release.

---

## ❌ AP-03: WScript.Shell tạo shortcut với tên Unicode tiếng Việt
**Triệu chứng:** Tên shortcut bị vỡ mã (ký tự lạ) sau khi tạo.
**Hậu quả:** File .lnk không đọc được, icon không hiện đúng.
**Chuẩn đúng (2 bước):**
1. Tạo `temp.lnk` bằng tên ASCII thuần qua WScript.Shell.
2. Dùng `[System.IO.File]::Move` đổi sang tên Việt có dấu với encoding UTF-16LE có BOM.
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 4`

---

## ❌ AP-04: ELECTRON_RUN_AS_NODE bị giữ nguyên trong script PowerShell khởi chạy
**Triệu chứng:** `electron .` từ shortcut PowerShell chạy Node.js thay vì Electron.
**Hậu quả:** App không khởi động — hiển thị lỗi module hoặc màn hình trắng.
**Chuẩn đúng:** Thêm dòng đầu script:
```powershell
Remove-Item Env:\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
```
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 5`

---

## ❌ AP-05: Khai báo "ĐỒNG BỘ 100%" bằng cảm tính / mắt thường
**Triệu chứng:** Bảng tiến độ ghi "Đồng bộ 100%" nhưng không có lệnh nào chứng minh.
**Hậu quả:** Thực tế 18 điểm lệch pha (IPC channels, DTOs, schema) như đã xảy ra ở v1.4.
**Chuẩn đúng:** Chỉ được ghi "Đồng bộ 100%" khi `npm run check-docs` báo **XANH**.
**Phát hiện tự động:** `npm run check-docs` (Lớp QA 7 — 18 tiêu chí)

---

## ❌ AP-06: Phỏng vấn thu thập yêu cầu lắt nhắt qua nhiều lượt chat
**Triệu chứng:** 5-6 tin nhắn hỏi đáp từng câu một về yêu cầu dự án.
**Hậu quả:** Quadratic Token Drag — token tích lũy lũy thừa, ngân sách cạn sớm.
**Chuẩn đúng:** Dùng **Single-Shot Interview Matrix** — 1 bảng 4 trục duy nhất, Anh điền 1 lần.
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 8`

---

## ❌ AP-07: Lưu toàn bộ HTML/CSS/JSON của Stitch MCP vào Chat History
**Triệu chứng:** Paste nguyên khối JSON Stitch (3.000-8.000 tokens) vào chat.
**Hậu quả:** Context window hao tổn nặng — đẩy các ngữ cảnh quan trọng ra ngoài cửa sổ.
**Chuẩn đúng:** Chỉ lưu `screenId`, URL preview, Component Map < 200 tokens vào AI_CONTEXT.md.
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 8 — Stitch Payload Compaction`

---

## ❌ AP-08: Sao chép DDL/Schema vào nhiều file tài liệu khác nhau
**Triệu chứng:** DDL xuất hiện trong cả DATA_CONTRACT.md, SPEC_S01.md và SYSTEM_ARCHITECTURE.md.
**Hậu quả:** Khi schema thay đổi → phải sửa 3+ nơi → dễ lệch pha → lỗi âm thầm.
**Chuẩn đúng:** DDL chỉ ở `schema.sql` duy nhất. Tài liệu khác chỉ dẫn link markdown.
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 8 — Single Source of Contract`

---

## ❌ AP-09: Gọi Stitch MCP trước khi có Scope Boundary được duyệt
**Triệu chứng:** Gọi Stitch MCP ngay sau khi nghe yêu cầu, chưa lập bảng In/Out-Scope.
**Hậu quả:** Stitch tự ý sinh thêm component, widget, panel không có trong yêu cầu (Feature Creep).
**Chuẩn đúng:** Chờ Anh Mike duyệt bảng Scope Boundary → Gọi Stitch với Negative Constraints.
**Tham chiếu:** `VIBE_CODING_METHODOLOGY_v4.0.md §6 Pattern 7`

---

## ❌ AP-10: Floating-point cho tính toán tài chính
**Triệu chứng:** `const result = 0.1 + 0.2; // 0.30000000000000004`
**Hậu quả:** Sai số tích lũy trong tính toán đơn giá, tỷ lệ, diện tích thẩm định.
**Chuẩn đúng:** Nhân số nguyên trước khi tính (BigDecimal pattern):
```js
// Sai: price * area
// Đúng: Math.round(price * 100) * Math.round(area * 100) / 10000
```

---

## ❌ AP-11: Không có transaction khi ghi nhiều bảng SQLite
**Triệu chứng:** Nhiều câu INSERT/UPDATE riêng lẻ không bọc trong `BEGIN TRANSACTION`.
**Hậu quả:** Nếu app crash giữa chừng → dữ liệu bảng A ghi thành công, bảng B mất → CSDL không nhất quán.
**Chuẩn đúng:** Luôn bọc giao dịch đa bảng trong `BEGIN/COMMIT/ROLLBACK` + SQLite WAL mode.

---

## ❌ AP-12: Nạp toàn bộ repo vào context khi bắt đầu phiên
**Triệu chứng:** AI đọc tất cả file .js, .md trong thư mục dự án khi khởi động phiên.
**Hậu quả:** Tốn 60-80% context window chỉ để "nắm tổng quan" — không còn room cho việc thực sự.
**Chuẩn đúng:** Chỉ đọc `AI_CONTEXT.md` → chỉ nạp file trong `DOCUMENT SCOPE §5`.
**Kiểm soát:** `AI_CONTEXT.md §5` phân tầng LOCKED / CURRENT / REFERENCE rõ ràng.

---

## 📝 CÁCH THÊM ANTI-PATTERN MỚI

Khi phát hiện lỗi tái phạm trong dự án:
1. Thêm mục `AP-XX` vào file này.
2. Điền đủ 4 trường: Triệu chứng / Hậu quả / Chuẩn đúng / Phát hiện tự động (nếu có).
3. Cập nhật `AI_CONTEXT.md §6 CONSTRAINTS` nếu lỗi đặc thù dự án.
4. Commit: `docs: thêm anti-pattern AP-XX`