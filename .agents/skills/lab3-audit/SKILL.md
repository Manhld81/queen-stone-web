---
name: lab3-audit
description: Kỹ năng kiểm toán độc lập chuyên sâu 5 tầng cho Lab 03 (Queen Stone - Web Bán Đá Tự Nhiên) với rào chắn an toàn Web Express, Docker và tư duy bằng chứng.
---

# LAB3-AUDIT — KỸ NĂNG KIỂM TOÁN ĐỘC LẬP CHUYÊN BIỆT LAB 03 (v3.0 Modular)
*Dự án: Queen Stone — Web Bán Đá Tự Nhiên & Showroom Hoàng Gia*  
*Chuẩn khung: Vibe Coding Framework v5.0 (Self-Healing Enterprise Web Engine)*

---

## 1. TÔN CHỈ & PHẠM VI

Kỹ năng `lab3-audit` phiên bản **v3.0 Modular** thực hiện kiểm toán độc lập toàn diện, triệt tiêu điểm mù kỹ thuật và thẩm định **Năng Lực An Toàn & Vận Hành Web Fullstack (Runtime Web Resilience)** cho **Lab 03: Queen Stone (Web Bán Đá Tự Nhiên)**.

**Nguyên tắc vận hành tối cao:**  
> **TUYỆT ĐỐI BẢO TOÀN TRẠNG THÁI CODE — CHỈ KIỂM TOÁN VÀ BÁO CÁO, CẤM TỰ Ý SỬA MÃ SẢN PHẨM.**

---

## 2. NGUYÊN TẮC BẤT DI BẤT DỊCH (CORE DIRECTIVES)

### 2.1. Cấm Tự Ý Sửa Code trong Chế độ AUDIT
- Tuyệt đối không sửa, xóa, di chuyển mã nguồn hoặc tự cài thư viện npm, tự ý `git commit`.
- Mọi phát hiện chỉ được ghi nhận vào báo cáo kiểm toán `./AUDIT_REPORT_LAB03.md`.
- Chỉ chuyển sang sửa mã khi Anh Mike phê duyệt báo cáo và ra lệnh kích hoạt chế độ **IMPLEMENT / FIX**.

### 2.2. Kiểm Toán Dựa Trên Bằng Chứng (Evidence-Based)
Mọi phát hiện bắt buộc phải gắn với bằng chứng trực tiếp: Tên tệp (`TargetFile`), Hàm/Module (`Function/Symbol`), Dòng code (`LineNumber`), và Trích đoạn mã thực tế (`Code snippet`).  
Phân loại mức độ tin cậy:
- `CONFIRMED`: Có bằng chứng trực tiếp trong mã nguồn hoặc kết quả chạy lệnh.
- `LIKELY`: Dấu hiệu rủi ro cao nhưng cần điều kiện môi trường đặc thù để kích hoạt.
- `UNKNOWN`: Chưa đủ dữ liệu để kết luận (CẤM biến `UNKNOWN` thành `PASS`).
- `NOT APPLICABLE`: Tiêu chí không thuộc phạm vi của Lab 03.

### 2.3. Thứ Tự Ưu Tiên Rủi Ro Thực Tế (Severity Hierarchy)
1. **Lỗ hổng bảo mật Web & Dữ liệu:** SQL Injection, Lộ mật khẩu/Secret (AP-01), Bỏ qua xác thực Admin.
2. **Mất/Sai lệch dữ liệu tồn kho độc bản:** Race condition trừ tồn kho, bán trùng lô đá đã hết, mất CSDL khi restart Docker.
3. **Sập dịch vụ Web (DoS / Crash Server):** Unhandled promise rejection, payload upload làm cạn RAM, sập do `unlinkSync` file bị khóa.
4. **Vi phạm Ranh giới Nghiệp vụ (Scope Breach):** Tự ý tính giá tự động trên Web (vi phạm nghiêm ngặt yêu cầu Anh Mike).
5. **Lỗi tích hợp chuyển đổi Zalo 1-Click:** Sai lệch mã lô, thiếu ảnh, link vỡ khiến mất cơ hội tư vấn khách hàng.
6. **Hồi quy kiểm thử & Sai lệch tài liệu:** Test fail, lệnh kiểm định máy báo đỏ (`check-docs`, `validate-integrity`).
7. **Hiệu năng & Tối ưu hóa Web:** Ảnh slab quá nặng gây nghẽn mạng di động (>1.5s), rò rỉ file mồ côi.

### 2.4. Anti-Hallucination Gate & Rào Chắn Vận Hành (Anti-Attention Drift)
1. **Quy tắc phân đoạn (Chunked Execution):** Kiểm toán theo 3 Pha độc lập. Không nạp toàn bộ mã nguồn vào một câu lệnh duy nhất.
2. **Lát cắt ngữ cảnh (Context Slicing):** Dùng `grep_search` định vị hàm/tuyến API, chỉ đọc lát cắt giới hạn (`view_file` với `StartLine`/`EndLine`).
3. **Cổng kiểm chứng 3 câu hỏi:** *Tận mắt thấy dòng code chưa?* — *Có đang suy đoán chung chung không?* — *Có dẫn được đường dẫn và dòng cụ thể làm bằng chứng không?*
4. **Trần Thời Gian CLI (CLI Timeout):** Mọi lệnh chạy trên PowerShell/Node.js bắt buộc có trần thời gian tối đa **60 giây/lệnh**.
5. **Trần Ngân Sách Token (Token Ceiling Guard):** Khống chế phản hồi phân đoạn ở ngưỡng **800–1.200 tokens/lượt**. Khi log vượt quá **100 dòng**, bắt buộc tóm tắt lọc mã lỗi.

---

## 3. MA TRẬN KIỂM TOÁN HỢP NHẤT 5 TẦNG CHO WEB LAB 03

| Mã ID | Tầng & Hạng mục | Rào chắn & Tham số bắt buộc (Ground Truth) | Mẫu cấm (Fatal Patterns — Zero Tolerance) | Tệp mục tiêu |
| :--- | :--- | :--- | :--- | :--- |
| **[L3-DOC-01]** | T0: Yêu cầu & Đặc tả | Đối chiếu 100% mã nguồn với `REQUIREMENTS.md` (6 phân hệ In-Scope). | Cấm "Ghost Features" (tự chế tính năng) hoặc thiếu phân hệ cốt lõi. | `./REQUIREMENTS.md`, `./SYSTEM_OVERVIEW.md` |
| **[L3-SCP-02]** | T0: Ranh giới Out-of-Scope | Khóa chặt ranh giới: Tuyệt đối cấm tính giá tự động, cấm cổng thanh toán online. | Cấm tính giá tự động / bảng dự toán online làm sai lệch báo giá đặc thù đá. | `./src/server.js`, `./public/` |
| **[L3-ANT-03]** | T0: Tuân thủ Anti-Patterns | Rà soát 100% các điều cấm trong `ANTI_PATTERNS.md` (AP-01 đến AP-11). | Cấm hardcode API key/secret, cấm xóa file không an toàn, cấm nối chuỗi SQL. | `./ANTI_PATTERNS.md`, `./src/` |
| **[L3-SEC-01]** | T1: Security Headers | Cấu hình đầy đủ Security Headers: `nosniff`, `SAMEORIGIN`, `1; mode=block`. | Cấm mở toang Web không có rào chắn Clickjacking và MIME-sniffing. | `./src/server.js` |
| **[L3-SQL-02]** | T1: SQL Injection Guard | 100% câu truy vấn SQLite bắt buộc dùng Prepared Statements (`prepare().all/run(?)`). | Cấm nối chuỗi SQL thô (`WHERE id = ' + id`) gây lỗ hổng SQLi nghiêm trọng. | `./src/server.js`, `./src/db/` |
| **[L3-ATH-03]** | T1: Xác thực Quản trị & PIN | Đăng nhập Admin và xác thực PIN bắt buộc kiểm tra qua biến môi trường an toàn. | Cấm fallback mật khẩu yếu ('8888', '1234') trên môi trường chạy thực tế. | `./src/server.js` |
| **[L3-RAT-04]** | T1: Rate Limiting & Anti-DoS | Giới hạn tần suất gọi request cho các endpoint nhạy cảm (Upload, Login, Order). | Cấm thả nổi API cho phép gọi vô hạn làm cạn kiệt CPU/RAM máy chủ. | `./src/server.js` |
| **[L3-UPL-05]** | T1: Rào chắn Upload ảnh | Kiểm soát kích thước tải ảnh base64/multipart; chỉ cho phép các định dạng ảnh hợp lệ. | Cấm nhận file thực thi (.exe, .sh, .php) hoặc payload khổng lồ gây tràn bộ nhớ. | `./src/server.js` |
| **[L3-ERR-06]** | T1: Error Handler an toàn | Bắt lỗi tập trung Express, trả về cấu trúc `ApiResult` chuẩn. | Cấm làm rò rỉ stack trace lỗi, đường dẫn ổ cứng hệ thống ra phía client. | `./src/server.js` |
| **[L3-WAL-01]** | T2: Better-SQLite3 WAL | Kích hoạt `journal_mode = WAL`, `foreign_keys = ON`, `synchronous = NORMAL`. | Cấm chạy SQLite chế độ Rollback Journal chậm và dễ khóa tranh chấp trên Web. | `./src/db/database.js` |
| **[L3-CON-02]** | T2: Concurrency Tồn kho | Nghiệp vụ xuất kho / trừ tồn đá độc bản bắt buộc bọc trong `db.transaction(...)`. | Cấm trừ tồn không atomic gây race condition và bán trùng lô đá độc bản. | `./src/server.js`, `./core_modules/` |
| **[L3-SHT-03]** | T2: Graceful Shutdown | Lắng nghe `SIGINT` và `SIGTERM` để đóng `db.close()` sạch sẽ trước khi tiến trình tắt. | Cấm kill process đột ngột làm hỏng tệp WAL hoặc kẹt file lock trên Docker/Koyeb. | `./src/server.js` |
| **[L3-VOL-04]** | T2: Bền vững CSDL Cloud | Kiểm tra đường dẫn `DB_PATH` và cấu hình volume mount trong `Dockerfile`, `koyeb.yaml`. | Cấm lưu CSDL trong ephemeral container layer làm mất dữ liệu khi restart app. | `./Dockerfile`, `./koyeb.yaml`, `./src/db/` |
| **[L3-DEL-05]** | T2: Dọn dẹp Uploads Mồ Côi | Hàm `cleanupOrphanedUploads` phải bọc `try...catch` cẩn trọng, kiểm tra file tồn tại. | Cấm `fs.unlinkSync` làm crash máy chủ khi file bị tiến trình khác chiếm dụng. | `./src/server.js` |
| **[L3-ZAL-01]** | T3: Zalo 1-Click Payload | Nút kết nối Zalo phải truyền đầy đủ và chuẩn xác: Mã lô, Tên đá, Kích thước, Ảnh slab. | Cấm liên kết Zalo rỗng hoặc thiếu thông số nhận diện lô đá độc bản. | `./public/`, `./src/server.js` |
| **[L3-LOT-02]** | T3: Chống Bán Âm & Hết Lô | Khi diện tích tồn $\le 0$, tự động cập nhật trạng thái "Hết hàng", cấm trừ số âm. | Cấm tồn kho âm ($m^2 < 0$) hoặc cho phép đặt lô đá đã bán hết. | `./src/server.js`, `./src/db/` |
| **[L3-FLT-03]** | T3: Bộ lọc Đá Độc Bản | Bộ lọc sản phẩm theo chủng loại (Marble, Granite, Onyx), màu sắc, ứng dụng. | Cấm lỗi truy vấn filter trả về danh sách rỗng sai lệch hoặc crash backend. | `./src/server.js`, `./public/` |
| **[L3-PRF-01]** | T4: Tốc độ tải trang < 1.5s | Tối ưu tài nguyên tĩnh trong `public/`, hỗ trợ nén và cache header HTTP. | Cấm load assets quá nặng làm đơ trình duyệt trên thiết bị di động. | `./public/`, `./src/server.js` |
| **[L3-IMG-02]** | T4: Tối ưu ảnh Slab đá | Ảnh slab toàn tấm và cận cảnh vân phải có cơ chế lazy loading (`loading="lazy"`). | Cấm nạp đồng loạt hàng chục ảnh slab nặng nguyên bản gây nghẽn băng thông. | `./public/` |
| **[L3-XSS-03]** | T4: Phòng chống XSS | Render dữ liệu sản phẩm đá lên giao diện HTML phải escape ký tự đặc biệt. | Cấm chèn dữ liệu người dùng/admin trực tiếp qua `innerHTML` không bọc giáp. | `./public/` |
| **[L3-TST-01]** | T5: Chạy Toàn Bộ Test Suite | Toàn bộ bài test trong `tests/` phải pass 100% qua lệnh `npm test`. | Cấm bỏ qua lỗi kiểm thử hồi quy trước khi đưa lên môi trường sản xuất. | `./tests/` |
| **[L3-VAL-02]** | T5: Kiểm tra Toàn Vẹn QA | Lệnh `npm run validate-all` và `npm run check-docs` phải đạt kết quả XANH. | Cấm báo cáo đồng bộ bằng cảm tính mà không có chứng thực từ công cụ máy. | `./qa_tools/` |
| **[L3-SEC-03]** | T5: Quét Rò Rỉ Mã Bí Mật | Lệnh `npm run scan-secrets` phải sạch 100%, không lộ API key hoặc mật khẩu. | Cấm đẩy bí mật, API key, credential lên kho lưu trữ Git. | `./qa_tools/scan-secrets.js` |
| **[L3-AUD-04]** | T5: Chuỗi Cung Ứng Thư Viện | Chạy `npm audit --audit-level=high` phát hiện lỗ hổng thư viện bên thứ ba. | Cấm dùng thư viện có lỗ hổng bảo mật cấp cao (High/Critical Vulnerabilities). | `package.json` |

---

## 4. CÁC CHẾ ĐỘ HOẠT ĐỘNG (OPERATIONAL MODES)

### MODE A: CHUNKED AUDIT (Kiểm toán Phân đoạn Chống Trôi Ngữ Cảnh)
- **Pha 1 (Chuẩn Tài liệu, Ranh giới & Công cụ Máy):** Tầng 0 + Tầng 5. Chạy chuỗi lệnh QA máy và đối soát Scope Boundary.
- **Pha 2 (An toàn Web Express, Concurrency Tồn kho & Docker):** Tầng 1 + Tầng 2. Rà soát an ninh máy chủ, SQLi, Transaction trừ kho.
- **Pha 3 (Nghiệp vụ Queen Stone, Zalo 1-Click & Hiệu năng):** Tầng 3 + Tầng 4. Rà soát payload Zalo, tối ưu ảnh slab, XSS giao diện.
$\rightarrow$ Sau 3 Pha, tiến hành xuất báo cáo tổng hợp theo Mục 6.

### MODE B: TARGETED AUDIT (Kiểm toán Luồng 6 Mắt Xích)
$$\text{User Click (Web/Zalo)} \longrightarrow \text{Express Route} \longrightarrow \text{Middleware Auth/Sanitize} \longrightarrow \text{Core Service} \longrightarrow \text{Better-SQLite3 Transaction} \longrightarrow \text{JSON Response}$$

---

## 5. BỘ CÔNG CỤ MÁY TỰ ĐỘNG (AUTOMATED TOOLCHAIN)

> **Rào chắn vận hành tự động:**  
> Mọi lệnh kiểm thử chạy bên dưới bắt buộc có trần thời gian chạy tối đa **60 giây/lệnh**. Nếu log vượt quá **100 dòng**, bắt buộc tóm tắt lọc mã lỗi.

```powershell
# 1. Chạy toàn bộ bộ kiểm thử tự động
npm test

# 2. Kiểm tra toàn vẹn dự án (Secrets + Tags + Integrity)
npm run validate-all

# 3. Quét an toàn bảo mật & rò rỉ mã bí mật
npm run scan-secrets

# 4. Kiểm tra tính nhất quán tài liệu & mã nguồn
npm run check-docs

# 5. Kiểm toán lỗ hổng bảo mật chuỗi cung ứng bên thứ ba
npm audit --audit-level=high
```

---

## 6. QUY TRÌNH XUẤT BÁO CÁO NẠP LƯỜI (LAZY-LOADING REPORT PROTOCOL)

Khi hoàn thành toàn bộ 3 Pha kiểm toán và sẵn sàng xuất báo cáo:
1. Agent sử dụng công cụ `view_file` để đọc tệp mẫu ngoại vi:  
   `./.agents/skills/lab3-audit/resources/AUDIT_REPORT_TEMPLATE.md`
2. Điền đầy đủ dữ liệu bằng chứng thu thập được theo đúng cấu trúc của mẫu.
3. Xuất báo cáo hoàn chỉnh thành tệp `./AUDIT_REPORT_LAB03.md` tại thư mục gốc của dự án Lab 03.

---

## 7. CAM KẾT HOÀN TẤT CUỘC AUDIT

1. Sau khi xuất báo cáo `./AUDIT_REPORT_LAB03.md`, AI lập tức **DỪNG LẠI**, không tự ý chỉnh sửa bất kỳ tệp code sản phẩm nào.
2. Trình báo cáo tóm tắt các điểm đáng chú ý nhất lên khung Chat cho **Anh Mike (Lâm Đức Mạnh)**.
3. Đợi **Anh Mike (Lâm Đức Mạnh)** chỉ đạo từng bước khắc phục (nếu có).
