# BẢN YÊU CẦU DỰ ÁN TỔNG THỂ (PROJECT REQUIREMENTS BASELINE)
*Dự án: 03. LAB 03 - Web ban Da Tu Nhien*  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[DRAFT | IN_REVIEW | REQUIREMENTS_LOCKED]`

---

## 1. MỤC TIÊU DỰ ÁN & BỐI CẢNH NGHIỆP VỤ (BUSINESS CONTEXT & GOALS)
- **Bài toán cần giải quyết:** [Mô tả nỗi đau thực tế hoặc nhu cầu nghiệp vụ cụ thể]
- **Mục tiêu cốt lõi:** [Kết quả cụ thể mà phần mềm phải mang lại cho Anh Mike]
- **Tầm nhìn dài hạn:** `Business Process → Software → AI → Automation → IoT → Physical System`
- **Đối tượng sử dụng chính:** [Anh Mike / Chuyên viên thẩm định / Người dùng gia đình...]

---

## 2. RANH GIỚI PHẠM VI (SCOPE BOUNDARY — BẮT BUỘC KHÓA CHẶT)
> ⚠️ **Quy tắc bất biến:** Em (AI) tuyệt đối không tự ý thêm bớt bất kỳ tính năng nào ngoài bảng này.

| Phân loại | Danh mục chức năng | Tiêu chí hoàn thành (Definition of Done) |
|---|---|---|
| **IN-SCOPE** *(Bắt buộc phải có)* | 1. [Tính năng 1 - ví dụ: Quản lý danh sách hồ sơ]<br>2. [Tính năng 2 - ví dụ: Bảng tính toán đơn giá]<br>3. [Tính năng 3 - ví dụ: Xuất báo cáo kết quả] | Hoạt động trơn tru, lưu trữ dữ liệu an toàn, xử lý đủ trường hợp lỗi. |
| **OUT-OF-SCOPE** *(Tuyệt đối cấm tự thêm)* | 1. Đăng nhập mạng xã hội / Cloud Sync phức tạp khi chưa cần.<br>2. Các widget phân tích, biểu đồ phụ rườm rà.<br>3. Hệ thống thông báo đẩy (Push notification) ngoài lề. | Giữ ứng dụng tinh gọn, tiết kiệm tài nguyên máy và token tối đa. |

---

## 3. DANH MỤC CÁC PHÂN HỆ DỰ KIẾN (MODULE BREAKDOWN PREVIEW)
Từ bản yêu cầu này, Em sẽ bóc tách thành các bản Đặc tả chi tiết (Spec) độc lập để cùng Anh tinh chỉnh:

- **Module S01:** [Tên module 1 - ví dụ: S01_QuanLyHoSo] — Quản lý thêm/sửa/xóa/tra cứu hồ sơ.
- **Module S02:** [Tên module 2 - ví dụ: S02_BangTinhDonGia] — Nhập thông số và áp dụng công thức tính.
- **Module S03:** [Tên module 3 - ví dụ: S03_XuatBaoCao] — Xuất dữ liệu ra file chuẩn (Excel/PDF/JSON).

---

## 4. TIÊU CHÍ KỸ THUẬT & TRẢI NGHIỆM CHẤP NHẬN (ACCEPTANCE CRITERIA)
1. **Trải nghiệm người dùng:** Giao diện trực quan, rõ ràng trạng thái Zero-State (khi chưa có dữ liệu) và Active-State (khi đã có dữ liệu).
2. **Độ tin cậy:** Không xảy ra lỗi trắng màn hình, có thông báo lỗi bằng tiếng Việt rõ ràng khi nhập sai.
3. **An toàn dữ liệu:** Dữ liệu lưu trữ bền vững vào CSDL cục bộ (SQLite/File), không mất khi tắt app đột ngột.
4. **Kiểm thử tự động:** Vượt qua 100% các bài kiểm tra QA bằng máy (`npm run qa:full`).

---

## 5. BIÊN BẢN PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [ ] **Anh Mike đã duyệt bản Requirement này ngày:** [YYYY-MM-DD]
- [ ] **Trạng thái:** Chuyển sang Chặng 2 — Bóc tách Spec chi tiết.
