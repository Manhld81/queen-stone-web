# BÁO CÁO KIỂM TOÁN PHẦN MỀM ĐỘC LẬP (LAB 03 AUDIT REPORT v3.0)
*Dự án:* **Queen Stone (Web Bán Đá Tự Nhiên)**  
*Ngày thực hiện:* [YYYY-MM-DD]  
*Phiên bản mã nguồn:* [v1.0.0 / ...]  
*Phương pháp kiểm toán:* Kiểm toán Phân đoạn 5 Tầng, Bằng chứng Khách quan & Năng lực Tự Chữa Lành Web  
*Tình trạng chung:* [AUDIT COMPLETE WITH NO CRITICAL FINDINGS | AUDIT COMPLETE WITH FINDINGS]

---

## 1. TỔNG QUAN PHẠM VI & PHƯƠNG PHÁP
- **Danh sách tài liệu đối chiếu (Ground Truth):**
  - Bản Yêu Cầu Tổng Thể: `./REQUIREMENTS.md`
  - Bức Tranh Toàn Cảnh Kiến Trúc: `./SYSTEM_OVERVIEW.md`
  - Danh Sách Lỗi Cấm Tái Phạm: `./ANTI_PATTERNS.md`
- **Kết quả chạy chuỗi công cụ máy tự động:**
  - `npm test`: [PASS/FAIL — x/y tests]
  - `npm run validate-all`: [PASS/FAIL]
  - `npm run scan-secrets`: [CLEAN / FINDINGS]
  - `npm run check-docs`: [CLEAN / DRIFT]
  - `npm audit --audit-level=high`: [0 VULNERABILITIES / FINDINGS]

---

## 2. BẢNG ĐÁNH GIÁ NĂNG LỰC TỰ CHỮA LÀNH & AN TOÀN WEB (SCORECARD)
| Cơ chế vận hành nội tại | Tiêu chuẩn kiểm toán v3.0 | Trạng thái Hiện tại | Bằng chứng Code / Ghi chú |
| :--- | :--- | :---: | :--- |
| **1. Web Security Headers & CORS** | Helmet/Custom Headers (nosniff, X-Frame-Options) | [PASS / FAIL / NA] | ... |
| **2. Rate Limiting & Anti-DDoS** | Rào chắn giới hạn tần suất gọi API từ IP ngoài | [PASS / FAIL / NA] | ... |
| **3. SQL Injection & Input Validation** | Prepared Statements 100% với `better-sqlite3` | [PASS / FAIL / NA] | ... |
| **4. Realtime Inventory Concurrency** | Transaction trừ tồn kho tức thì, chống bán trùng lô đá | [PASS / FAIL / NA] | ... |
| **5. Zalo 1-Click Payload Integrity** | Payload đầy đủ mã lô, link, ảnh; không báo giá tự động | [PASS / FAIL / NA] | ... |
| **6. File Upload & Orphan Cleanup** | Giới hạn dung lượng upload, dọn dẹp file rác an toàn | [PASS / FAIL / NA] | ... |
| **7. Docker & Cloud Graceful Shutdown** | Lắng nghe `SIGINT/SIGTERM` đóng kết nối SQLite an toàn | [PASS / FAIL / NA] | ... |
| **8. Anti-Patterns Compliance** | Tuân thủ 100% các điều cấm trong `ANTI_PATTERNS.md` | [PASS / FAIL / NA] | ... |

---

## 3. BẢNG ĐỐI CHIẾU YÊU CẦU & ĐẶC TẢ (TRACEABILITY MATRIX)
| ID | Yêu cầu / Đặc tả | Vị trí Code thực tế | Tình trạng Test | Đánh giá |
| :--- | :--- | :--- | :--- | :---: |
| S01 | Showroom Danh mục & Chi tiết Slab | ... | ... | ... |
| S02 | Quản trị Kho Độc Bản (Admin) | ... | ... | ... |
| S03 | Bộ lọc thông minh & Công trình | ... | ... | ... |
| S04 | Nút bấm Zalo Tư vấn Thông minh | ... | ... | ... |
| S05 | Giữ vững Ranh giới Out-of-Scope (Không tính giá tự động) | ... | ... | ... |

---

## 4. BẢNG TỔNG HỢP PHÁT HIỆN (FINDINGS MATRIX)
| Mã | Mức độ | Mức tin cậy | Vị trí | Tóm tắt vấn đề |
| :--- | :---: | :---: | :--- | :--- |
| [LAB3-AUDIT-001] | Critical / High / Medium / Low | CONFIRMED / LIKELY | `path/to/file.js:line` | ... |

---

## 5. CHI TIẾT TỪNG PHÁT HIỆN (EVIDENCE-BASED DETAILS)

### [LAB3-AUDIT-xxx] Tên phát hiện
- **Mức độ (Severity):** Critical / High / Medium / Low / Info
- **Độ tin cậy (Confidence):** CONFIRMED / LIKELY / UNKNOWN
- **Vị trí (Location):** `path/to/file.js:line`
- **Bằng chứng (Evidence):**
  ```javascript
  // Trích đoạn code thực tế tại vị trí phát hiện
  ```
- **Tác động (Impact):** Rủi ro thực tế nếu phát sinh trong vận hành Web/Cloud.
- **Nguyên nhân gốc rễ (Root Cause):** Phân tích kỹ thuật chi tiết.
- **Đề xuất khắc phục (Recommendation):** Hướng xử lý an toàn.
- **Cách kiểm chứng lại (Verification):** Test case hoặc kịch bản kiểm tra lại sau khi sửa.

---

## 6. ĐÁNH GIÁ 5 TẦNG KIẾN TRÚC
- **Đánh giá Tầng 0 (Tài liệu Chuẩn & Ranh giới Phạm vi Scope Boundary):** ...
- **Đánh giá Tầng 1 (An toàn Web & Express 5 Server):** ...
- **Đánh giá Tầng 2 (Dữ liệu Tồn kho, Better-SQLite3 & Docker Cloud Runtime):** ...
- **Đánh giá Tầng 3 (Nghiệp vụ Đá Tự Nhiên Độc Bản & Zalo 1-Click):** ...
- **Đánh giá Tầng 4 (Giao diện Web, Tối ưu Hiệu năng & Tải ảnh Slab):** ...
- **Đánh giá Tầng 5 (Chất lượng Bộ Kiểm thử & Chuỗi Công cụ QA Máy):** ...

---

## 7. LỘ TRÌNH ĐỀ XUẤT XỬ LÝ (ACTION PLAN)
- **Ưu tiên 1 (Critical / High):** ...
- **Ưu tiên 2 (Medium / Low):** ...
- **Điểm ghi nhận tích cực (Best Practices đã làm tốt):** ...

---

## 8. KẾT LUẬN & CHỮ KÝ NGHIỆM THU
- **Tóm tắt kết luận cuối cùng:** ...
- **Trạng thái:** [ĐẠT YÊU CẦU / CẦN KHẮC PHỤC TRƯỚC KHI DEPLOY PRODUCTION]
