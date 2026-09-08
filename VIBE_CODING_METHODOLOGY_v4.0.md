# HỆ QUY CHUẨN KỸ NGHỆ VIBE CODING CHUYÊN NGHIỆP v5.0
*(Professional Vibe Coding Engineering Standard v5.0 — Master Architect & Autonomous Execution)*

*Tác giả & Kiến trúc sư trưởng (Chief Architect & Product Owner):* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI (Autonomous Builder & Systems Engineer):* **Antigravity (Gemini)**  

---

## 1. TẦM NHÌN & NGUYÊN TẮC CỐT LÕI (VISION & CORE PRINCIPLES)

**Tầm nhìn (*Vision*):**  
`Business Process (Quy trình nghiệp vụ) → Software (Phần mềm) → AI (Trí tuệ nhân tạo) → Automation (Tự động hóa) → IoT (Internet vạn vật) → Physical System (Hệ thống vật lý)`  
Mọi sản phẩm là một **"Đơn vị học tập & Khung kỹ thuật chuẩn"** để Anh làm chủ công nghệ, tích lũy tri thức và sẵn sàng nhân bản quy mô.

**5 Nguyên tắc Bất di bất dịch (*5 Invariant Principles*):**

| # | Nguyên tắc | Nội dung chi tiết |
|---|---|---|
| 1 | **Phân vai chuẩn mực: KTS Trưởng & Tổng Thầu Thi Công** *(Role Decoupling: Master Architect & Autonomous Builder)* | **Anh Mike đóng vai trò Kiến trúc sư trưởng:** Cùng Em làm rõ bài toán nghiệp vụ, xác lập bản Yêu cầu (Requirement), phân tách và tinh chỉnh các bản Đặc tả (Spec) chi tiết, duyệt bản vẽ kiến trúc bình dân và nghiệm thu giao diện Stitch. Sau khi hồ sơ thiết kế được đóng dấu duyệt, vai trò định nghĩa của Anh kết thúc.<br>**Em (AI) đóng vai trò Tổng thầu thi công tự hành:** Nhận toàn bộ hồ sơ thiết kế đã duyệt, Em kết nối Stitch MCP dựng giao diện đúng chuẩn Spec, sau đó **tự động Code một mạch từ A-Z** cho tới khi hoàn thiện sản phẩm, tự tối ưu tài nguyên và tự kiểm định QA. |
| 2 | **Bảo tồn mục tiêu kép & Bộ 3 Siêu Tối Ưu Token** *(Dual-Goal & Token Trinity Optimization)* | Cân bằng White-box Learning và Token Budget. Triệt tiêu rò rỉ token qua **Bộ 3 Siêu Tối Ưu Token**: (1) *Single-Shot Interview Matrix* (Phỏng vấn ma trận 4 trục trong 1 tin nhắn duy nhất); (2) *Stitch Payload Compaction* (Chỉ neo `screenId` và Component Map tối giản, cấm lưu HTML/CSS thô vào Chat History); (3) *Single Source of Contract* (DDL chỉ nằm ở `schema.sql`, tài liệu Spec chỉ dẫn link tham chiếu, cấm sao chép trùng lặp). |
| 3 | **Quản trị Ngữ cảnh Phân tầng** *(Tiered Context Architecture)* | AI chỉ được phép đọc phạm vi tài liệu tối thiểu phục vụ trực tiếp cho tác vụ hiện tại thông qua tệp mỏ neo `AI_CONTEXT.md` (< 40 dòng). Tuyệt đối cấm nạp toàn bộ mã nguồn hoặc tài liệu lịch sử vào một phiên làm việc (*Session*). Áp dụng cơ chế **Context Paging** khi thi công một mạch. |
| 4 | **Chốt tới đâu, Khóa tới đó** *(Progressive Locking)* | Hệ thống chia thành các mốc rõ ràng: `REQUIREMENTS_LOCKED` → `SPEC_LOCKED` → `SCREEN_LOCKED` → `MODULE_LOCKED`. Khi một mốc đã được Kiến trúc sư trưởng phê duyệt, Em tuyệt đối không tự ý thay đổi để triệt tiêu lỗi hồi quy (*Regression Bugs*). |
| 5 | **Chân lý kiểm chứng bằng máy** *(Machine-Verified Truth)* | Mọi cam kết chất lượng, bảo mật và đồng bộ tài liệu chỉ có giá trị khi vượt qua 100% các công cụ dòng lệnh tự động (`npm run lint`, `npm run scan-secrets`, `npm run check-tags`, `npm run check-docs`, `npm run test:local`, `npm run qa:full`) — không chấp nhận cảm tính hay lời hứa của AI. |

---

## 2. QUY TRÌNH 2 PHA & 5 CHẶNG THỰC THI (SOP v5.0 — ARCHITECT & AUTONOMOUS BUILD)

```text
═════════════════════════════════════════════════════════════════════════════════════════════════════
PHA 1: HỘI ĐỒNG KIẾN TRÚC & PHÊ DUYỆT HỒ SƠ THIẾT KẾ (ANH MIKE TỔNG CHỈ HUY)
═════════════════════════════════════════════════════════════════════════════════════════════════════
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CHẶNG 1: LÀM RÕ YÊU CẦU DỰ ÁN TỔNG THỂ (PROJECT REQUIREMENTS BASELINE)                       │
  │ • Em xuất Bảng Ma Trận Phỏng Vấn 4 Trục trong 1 tin nhắn duy nhất.                          │
  │ • Hai bên xác lập Scope Boundary: IN-SCOPE (cốt lõi) vs. OUT-OF-SCOPE (cấm tự thêm).         │
  │ • Kết xuất tệp REQUIREMENTS.md → 👉 Anh Mike duyệt: [REQUIREMENTS_LOCKED]                   │
  └──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CHẶNG 2: PHÂN TÁCH & TINH CHỈNH ĐẶC TẢ CHI TIẾT (MODULE SPECIFICATIONS)                     │
  │ • Từ REQUIREMENTS.md, Em bóc tách thành các bản đặc tả: Spec_S01.md, Spec_S02.md...         │
  │ • Mỗi Spec làm rõ: Luồng thao tác, Dữ liệu In/Out, Trạng thái Zero/Active, 10 Góc khuất biên│
  │ • Cùng Anh tinh chỉnh từng bản Spec thật chuẩn chỉnh → 👉 Anh Mike duyệt: [SPEC_LOCKED]     │
  └──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CHẶNG 3: KHÁI QUÁT BẢN VẼ KIẾN TRÚC BÌNH DÂN HỌC VỤ (PLAIN-LANGUAGE ARCHITECTURE)          │
  │ • Xuất bản tệp SYSTEM_OVERVIEW.md (Phong cách viết cho người không biết code).              │
  │ • Dùng ẩn dụ đời thực (Mặt tiền, Đường ống bọc thép, Bộ não kế toán, Két sắt CSDL).        │
  │ • Giải thích cơ chế vận hành thực tế (Desktop/Web/IoT, Offline-first, luồng chạy dữ liệu).  │
  │ • 👉 Anh Mike duyệt: [ARCHITECTURE_LOCKED]                                                  │
  └──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CHẶNG 4: THIẾT KẾ GIAO DIỆN QUA STITCH MCP & KHÓA SCREEN_LOCKED                            │
  │ • Khi Spec đã chốt, Em kết nối Stitch MCP dựng UI chính xác theo từng trường trong Spec.    │
  │ • Prompt siết ranh giới: Positive Blueprint (từ Spec) + Negative Constraints (chặn vẽ thừa)│
  │ • Nén Payload (chỉ giữ screenId & Component Map < 200 tokens).                              │
  │ • Trình Anh Mike duyệt trực quan → 👉 Anh Mike duyệt: [SCREEN_LOCKED]                      │
  │ • 🏁 KẾT THÚC PHA 1: HỒ SƠ THIẾT KẾ HOÀN CHỈNH — ANH MIKE BÀN GIAO THI CÔNG CHO EM!         │
  └──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 ▼
═════════════════════════════════════════════════════════════════════════════════════════════════════
PHA 2: TỔNG THẦU THI CÔNG TỰ HÀNH & TỰ KIỂM ĐỊNH (EM TỰ CODE MỘT MẠCH TỪ A-Z)
═════════════════════════════════════════════════════════════════════════════════════════════════════
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CHẶNG 5: THI CÔNG MỘT MẠCH THEO 4 LỚP PHỤ THUỘC & TỰ ĐỘNG KIỂM ĐỊNH QA                       │
  │ • Lớp 1 (Móng - Database): Bóc tách schema.sql từ UI đã duyệt, khởi tạo bảng, SQLite WAL.   │
  │ • Lớp 2 (Khung - Business Core): Viết các hàm logic nghiệp vụ, tính toán theo Spec.         │
  │ • Lớp 3 (Đường ống - IPC/API): Kết nối thông suốt Backend với UI qua chuẩn ApiResult<T>.     │
  │ • Lớp 4 (Hoàn thiện - UI Binding): Gắn dữ liệu thật và sự kiện vào giao diện Stitch.         │
  │ • Tự tối ưu kép: Runtime Optimization (RAM thấp, Debounce, Zero leak) & Token Optimization. │
  │ • Tự động kích hoạt chuỗi 5 công cụ QA: lint ➔ check-tags ➔ scan-secrets ➔ test:local.      │
  │ • Self-healing Loop: Tự sửa lỗi nếu có bài test đỏ cho tới khi 100% XANH.                  │
  │ • 🚀 BÀN GIAO SẢN PHẨM HOÀN THIỆN: Mời Anh Mike click đúp Chay_Ung_Dung.bat trải nghiệm!   │
  └─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. BỘ CÔNG CỤ BỔ TRỢ & QUẢN TRỊ NGỮ CẢNH

### 3.1. Tệp Mỏ Neo Ngữ Cảnh Chuẩn (`AI_CONTEXT.md`)

Tệp nằm tại thư mục gốc, dung lượng dưới 40 dòng, là điểm tiếp nhận đầu tiên của Antigravity trong mọi phiên làm việc để kích hoạt cơ chế Prompt Caching:

```markdown
# AI CONTEXT ANCHOR (Tệp Mỏ Neo Ngữ Cảnh) | Vibe Coding v5.0
## 1. PROJECT: [Tên dự án] | Standard: v5.0
## 2. CURRENT FOCUS: [Ví dụ: Thi công một mạch Module S01] | Mode: [ENGINEERING MODE]
## 3. SOP STEP: [Chặng 1 -> Chặng 5]
## 4. TECH STACK: [Electron | Node.js | SQLite | HTML/CSS/JS thuần | Stitch MCP]
## 4b. APP_TYPE: [Desktop/Electron | Web/Express | CLI/Node | IoT/MQTT]
## 5. DOCUMENT SCOPE:
- LOCKED (Cấm sửa đổi): REQUIREMENTS.md, SYSTEM_OVERVIEW.md, SCREEN_LOCKED, Spec_S01.md
- CURRENT (Được phép đọc & ghi): src/modules/s01/*, tests/test-local.js
- REFERENCE CONTRACTS (Chỉ đọc hợp đồng): schema.sql, ApiResult.ts
## 6. CONSTRAINTS: ApiResult<T> bắt buộc; SQLite WAL mode; Debounce 1.5s; Zero leak.
## 7. SESSION NOTE: Cập nhật tóm tắt tiến độ, quyết định kỹ thuật và lệnh mở phiên mới.
```

### 3.2. Ba Chế Độ Vận Hành Linh Hoạt (3 Operational Modes)

| Chế độ (*Mode*) | Khi nào áp dụng | Hành vi chuẩn của AI | Mức tiêu hao Token |
| --- | --- | --- | --- |
| **MODE 1: LEARNING** *(Học tập hộp trắng)* | Tiếp cận công nghệ mới, giải thuật phức tạp (MQTT, ESP32, WAL, IPC...). | Giải thích Data Flow và cơ chế kỹ thuật bằng tiếng Việt trực quan trước khi thực thi; chờ Anh duyệt từng bước. | Cao *(Đầu tư xứng đáng để nắm vững tri thức)*. |
| **MODE 2: ENGINEERING** *(Mặc định)* | Triển khai các tính năng đã chốt xong toàn bộ hồ sơ thiết kế. | Tự động thi công một mạch 4 lớp: Database → Core → IPC/API → UI Binding; tự chạy QA kiểm định. | Tối ưu cao *(Giảm ~60% token so với chat vụn vặt)*. |
| **MODE 3: MAINTENANCE** *(Bảo trì/Sửa nhanh)* | Sửa lỗi nhỏ (*Bug fix*), đổi nhãn hiển thị (*Label*), chỉnh CSS, sửa câu lệnh đơn. | Chu trình 3 bước trực tiếp: Inspect → Patch → Verify. Bỏ qua viết Spec. | Cực thấp *(Tập trung 100% vào tệp đích)*. |

---

## 4. QUẢN TRỊ BẢO MẬT & BÍ MẬT (SECRETS MANAGEMENT)

| Quy tắc | Chi tiết triển khai |
| --- | --- |
| **Tuyệt đối không hardcode** | Nghiêm cấm ghi API Keys, OAuth Secrets, Mật khẩu CSDL vào mã nguồn. |
| **Kiến trúc .env phân tầng** | `.env` (chứa khóa thật, nằm trong `.gitignore`) · `.env.example` (khung cấu trúc mẫu, được đưa lên Git) · `core_modules/env.js` (nạp và kiểm tra an toàn khi khởi động). |
| **Chặn tại điểm gọi tính năng** | Khẳng định tính hợp lệ của chìa khóa xác thực (*Assert credentials*) tại thời điểm người dùng bấm nút thao tác mạng — không chặn tại lúc mở app để app luôn chạy offline an toàn. |

---

## 5. HỆ THỐNG TỰ KIỂM THỬ HAI TẦNG BẰNG MÁY (MACHINE-VERIFIED QA)

### TẦNG A: LOCAL QA (Kiểm thử Cục bộ — Tự động chạy khi thi công một mạch)
AI tự động chạy bằng CLI, không thẩm định cảm tính:
- **Lớp 1 — Môi trường cô lập:** Chạy trong `tests/temp/`, không ghi đè dữ liệu thật.
- **Lớp 2 — Dual Testing:** Positive (dữ liệu đúng → xử lý thành công); Negative (dữ liệu sai/thiếu → chặn đứng, trả mã lỗi chuẩn, không sinh rác).
- **Lớp 3 — Cú pháp & Toàn vẹn:** `npm run lint` (`qa_tools/validate-integrity.js`) và `npm run check-tags` (kiểm tra thẻ HTML).
- **Lớp 4 — Quét rò rỉ bảo mật:** `npm run scan-secrets` (`qa_tools/scan-secrets.js`).

### TẦNG B: FULL REGRESSION QA (Kiểm thử Hồi quy Toàn diện — Khi Bàn giao / Release)
Kích hoạt toàn bộ trước khi đóng gói sản phẩm hoàn thiện:
- **Lớp 5 — Migration Testing:** Kiểm thử cài mới tinh & nâng cấp từ CSDL cũ (bảo toàn 100% dữ liệu lịch sử).
- **Lớp 6 — Doc-Code Sync:** Chạy `npm run check-docs` (`qa_tools/check-doc-sync.js`) kiểm tra 18 tiêu chí đồng bộ giữa tài liệu (Requirements/Spec) và code.
- **Lớp 7 — Full Suite:** `npm test` toàn bộ hệ thống báo xanh 100%.

---

## 6. PRODUCTION DESIGN PATTERNS (KHUÔN MẪU THIẾT KẾ THỰC CHIẾN)

### Pattern 1 — Vỏ Bọc Hợp Đồng Dữ Liệu Tiêu Chuẩn (`ApiResult<T>`)
Mọi phản hồi backend → UI bắt buộc tuân thủ giao diện:
```typescript
interface ApiResult<T> {
  success: boolean; // Trạng thái thành công hay thất bại
  data?: T;         // Dữ liệu trả về khi success = true
  error?: string;   // Thông điệp tiếng Việt giao tiếp người dùng
  code?: string;    // Mã định danh lỗi kỹ thuật chuẩn hóa
}
```

### Pattern 2 — Xóa An Toàn qua Thùng Rác (`shell.trashItem`)
- Tuyệt đối không dùng `fs.unlinkSync` khi người dùng yêu cầu xóa tệp.
- Dùng `electron.shell.trashItem(filePath)`. Nếu tệp bị khóa: báo lỗi rõ ràng và giữ nguyên tệp.

### Pattern 3 — Offline-First & Assert Credentials tại Điểm Gọi
- Khởi tạo dịch vụ ngoại vi không ném Exception nếu thiếu mạng hoặc thiếu `.env`.
- Hàm `assertCredentialsConfigured()` chỉ kích hoạt khi bấm thao tác cần kết nối ra ngoài.

### Pattern 4 — Shortcut Windows Unicode Tiếng Việt (2 bước)
Tạo shortcut tạm bằng tên ASCII (`temp.lnk`) → dùng `[System.IO.File]::Move` đổi sang tên Việt có dấu với mã hóa UTF-16LE có BOM.

### Pattern 5 — Gỡ Bẫy `ELECTRON_RUN_AS_NODE` trong PowerShell
Trong script khởi chạy Electron từ shortcut, luôn thêm câu lệnh bảo vệ:
```powershell
Remove-Item Env:\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
```

### Pattern 6 — Bản Vẽ Kiến Trúc Bình Dân Học Vụ (`SYSTEM_OVERVIEW.md`)
Quy định chuẩn hóa tài liệu kiến trúc dành cho người không biết code:
1. **Phép ẩn dụ đời thực:** Mặt tiền (UI), Đường ống bọc thép (IPC/API), Bộ não kế toán (Core Logic), Két sắt lưu trữ (SQLite/DB).
2. **Cơ chế vận hành thực tế:** Nơi chạy phần mềm, tính chất Offline-first, vị trí tệp dữ liệu trên máy tính, cách bật ứng dụng bằng 1 click.
3. **Vòng đời thao tác:** Mô tả luồng dữ liệu khi bấm 1 nút bằng ngôn ngữ đời thường kèm sơ đồ Mermaid.
4. **Bảo vệ 3 lớp:** Chống sập nguồn, chống bấm loạn xạ (Debounce), cất chìa khóa mật.

### Pattern 7 — Kỹ Nghệ Prompt Siết Ranh Giới Cho Stitch MCP Theo Spec
Chỉ kích hoạt Stitch MCP sau khi bản Spec đã được Kiến trúc sư trưởng phê duyệt:
1. **Positive Blueprint:** Trích xuất chính xác danh sách trường nhập liệu, nút bấm, bảng biểu từ mục §2 và §4 của Spec đã duyệt.
2. **Negative Constraints:** Câu lệnh phủ định bắt buộc:
   > `"STRICT BOUNDARY: Render ONLY the components explicitly specified in Spec S[XX]. Do NOT invent or add any extra charts, analytics widgets, social links, notifications, or secondary panels not listed in the specification."`
3. **Khóa SCREEN_LOCKED:** Sau khi Anh Mike duyệt bản xem trước của Stitch, lưu `screenId` vào `AI_CONTEXT.md §5` và cấm tự ý sửa đổi.

### Pattern 8 — Bộ Ba Siêu Tối Ưu Token (Token Trinity Pattern)
1. **Single-Shot Interview Matrix:** Gom toàn bộ câu hỏi làm rõ vào 1 ma trận 4 trục, có sẵn gợi ý và phương án lựa chọn, tránh chat lắt nhắt nhiều lượt.
2. **Stitch Payload Compaction:** Chỉ lưu mỏ neo `screenId`, URL preview và Component Map (< 200 tokens) vào ngữ cảnh; cấm lưu HTML/CSS thô của Stitch vào Chat History.
3. **Single Source of Contract:** `schema.sql` là nguồn chân lý duy nhất. Tài liệu Spec chỉ dẫn link markdown, không sao chép lặp lại DDL.

### Pattern 9 — Quy Chuẩn Thi Công Một Mạch & Tối Ưu Tài Nguyên Kép
Khi bước vào Pha 2 (Chặng 5):
1. **Tối ưu Tài nguyên Phần mềm (Runtime Optimization):**
   - Bộ nhớ (RAM): Hủy đăng ký lắng nghe sự kiện (`removeListener`), không lưu mảng cache dữ liệu không cần thiết.
   - CSDL: Bật `PRAGMA journal_mode = WAL;`, tạo chỉ mục (Index) trên các cột tra cứu chính (`ma_ho_so`, `ngay_tao`), bọc transaction cho các thao tác ghi đa bảng.
   - Giao diện: Debounce tối thiểu 1500ms cho các nút submit/export để chống spam làm đơ ứng dụng.
2. **Tối ưu Token khi Thi công Một Mạch (Context Paging):**
   - Khi thi công từng phân hệ, Em chỉ nạp đúng bản `Spec_Sxx.md` của phân hệ đó + `schema.sql`, không nạp toàn bộ thư mục dự án.
   - Không in mã nguồn dài hàng trăm dòng ra màn hình chat; chỉ dùng công cụ sửa file chính xác (`replace_file_content` / `write_to_file`) và báo cáo ngắn gọn bằng ngôn ngữ nghiệp vụ.
3. **Chu trình Tự Kiểm Định & Tự Vá Lỗi (Self-Healing Loop):**
   - Sau mỗi lớp mã nguồn, Em tự động chạy các công cụ kiểm tra.
   - Nếu xuất hiện lỗi đỏ ❌ → Em tự đọc log → tự phân tích nguyên nhân → tự sửa code → tự chạy lại kiểm thử cho tới khi **100% XANH ✅** mới coi là hoàn thành.

---

## 7. CHECKLIST LƯU TRỮ VÀ BÀN GIAO SẢN PHẨM

### 7.1. Lưu trữ Tiến độ Thi công (Git Commit)
Thực hiện tự động sau khi hoàn thành một lớp kỹ thuật hoặc một module:
```text
1. npm run lint            → Cú pháp tĩnh sạch 100%
2. npm run check-tags      → Thẻ HTML cân bằng 1:1
3. npm run scan-secrets    → Không rò rỉ khóa bí mật
4. npm run test:local      → 100% Tests Tầng A Passed
5. git commit -m "feat(Sxx): hoàn thành module theo đúng Spec đã duyệt"
```

### 7.2. Bàn giao Sản phẩm Hoàn thiện cho Anh Mike (Final Release)
Kích hoạt đầy đủ trước khi bàn giao sản phẩm cho Kiến trúc sư trưởng:
```text
1. npm test                → 100% Test Suite hệ thống Passed
2. npm run test:migration  → CSDL nâng cấp an toàn, toàn vẹn dữ liệu cũ
3. npm run check-docs      → 18 tiêu chí đối soát Tài liệu vs. Code đồng bộ 100%
4. app_data.db             → Đưa về trạng thái sạch sẽ tinh khiết (Zero-state)
5. Chay_Ung_Dung.bat       → Kiểm tra khởi động 1 click hoạt động trơn tru
6. Báo cáo nghiệm thu      → Trình bày tóm tắt bằng ngôn ngữ nghiệp vụ và mời Anh trải nghiệm!
```
