# ĐẶC TẢ CHI TIẾT PHÂN HỆ (MODULE SPECIFICATION)
*Mã phân hệ:* **Spec_S[XX]_[Tên Phân Hệ]**  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[DRAFT | IN_REVIEW | SPEC_LOCKED]`  
*Tham chiếu Requirement:* `[REQUIREMENTS.md §3](file:///REQUIREMENTS.md)`

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)
- **Mục đích của Module:** [Mô tả module này giải quyết khâu nào trong quy trình]
- **Người dùng thao tác:** [Anh Mike / Chuyên viên]
- **Quy tắc nghiệp vụ bất biến:**
  - Quy tắc 1: [Ví dụ: Mã hồ sơ phải là duy nhất, tự tăng theo định dạng HS-YYYY-XXXX]
  - Quy tắc 2: [Ví dụ: Đơn giá thẩm định không được là số âm hoặc bằng 0]

---

## 2. DỮ LIỆU ĐẦU VÀO & ĐẦU RA (DATA CONTRACT IN/OUT)

### A. Dữ liệu Đầu vào (Inputs):
| Tên trường | Kiểu dữ liệu | Bắt buộc? | Ràng buộc / Giới hạn hợp lệ |
|---|---|---|---|
| `ma_ho_so` | Chuỗi (String) | Có | Không rỗng, độ dài 5-20 ký tự |
| `ten_khach_hang` | Chuỗi (String) | Có | Chấp nhận tiếng Việt có dấu |
| `dien_tich` | Số thực (Float) | Có | Phải > 0, tối đa 2 chữ số thập phân |
| `don_gia` | Số nguyên (Integer) | Có | Đơn vị VNĐ, phải > 0 |

### B. Dữ liệu Đầu ra (Outputs):
| Tên trường | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `tong_gia_tri` | Số nguyên (Integer) | Kết quả = `dien_tich * don_gia` |
| `ngay_tao` | Chuỗi ngày giờ | Định dạng `YYYY-MM-DD HH:mm:ss` |

> 🔗 **Cơ sở dữ liệu:** Chi tiết cấu trúc bảng lưu trữ xem tại `[schema.sql](file:///src/database/schema.sql)`. Không chép lại DDL vào đây để tiết kiệm Token.

---

## 3. LUỒNG THAO TÁC NGƯỜI DÙNG (STEP-BY-STEP USER FLOW)
1. **Bước 1:** Người dùng mở màn hình phân hệ S[XX].
2. **Bước 2:** Hệ thống hiển thị danh sách hồ sơ hiện có (hoặc hướng dẫn tạo mới nếu chưa có).
3. **Bước 3:** Người dùng nhấn nút **"[Tên Nút — ví dụ: Thêm Mới]"** → Mở biểu mẫu nhập liệu.
4. **Bước 4:** Người dùng điền đầy đủ các trường → Nhấn nút **"[Lưu]"**.
5. **Bước 5:** Hệ thống kiểm tra hợp lệ (Validate):
   - Nếu hợp lệ: Cất vào CSDL, cập nhật bảng danh sách, báo chuông/thông báo xanh.
   - Nếu có lỗi: Dừng lại, viền đỏ ô lỗi, hiển thị câu thông báo tiếng Việt rõ ràng.

---

## 4. ĐẶC TẢ GIAO DIỆN HAI TRẠNG THÁI (DUAL-STATE UI SPECIFICATION)
> 💡 *Đây là căn cứ trực quan để Em gửi câu lệnh siết ranh giới cho Stitch MCP ở Chặng 4.*

### Trạng thái 1: Zero-State (Khi CSDL chưa có bản ghi nào)
- Hiển thị hình minh họa hoặc biểu tượng trống rỗng nhẹ nhàng.
- Dòng chữ hướng dẫn: *"Chưa có dữ liệu nào. Hãy nhấn nút 'Tạo Mới' bên trên để bắt đầu."*
- Nút bấm tạo mới nổi bật (Call-to-Action) để người dùng thao tác ngay.

### Trạng thái 2: Active-State (Khi đã có dữ liệu hoạt động)
- **Thanh công cụ đỉnh:** Ô tìm kiếm / lọc nhanh + Nút tạo mới + Nút xuất báo cáo.
- **Bảng hiển thị chính:** Cột STT, Mã, Tên, Ngày tạo, Thao tác (Xem, Sửa, Xóa).
- **Phân trang / Thống kê:** Hiển thị tổng số bản ghi và tổng giá trị ở chân bảng.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)
Chỉ phân tích các góc khuất thực sự có rủi ro với module này:

- [ ] **Góc 1 (Null / Rỗng):** Bỏ trống trường bắt buộc → Báo lỗi tại chỗ, không lưu vào DB.
- [ ] **Góc 2 (Trùng mã):** Nhập mã đã tồn tại → Chặn đứng, báo *"Mã hồ sơ đã tồn tại"*.
- [ ] **Góc 3 (Tiếng Việt & Ký tự đặc biệt):** Hỗ trợ đầy đủ UTF-8 Unicode, không lỗi font.
- [ ] **Góc 4 (Số âm / Số 0):** Nhập số âm vào ô diện tích/giá → Chặn ngay khi gõ.
- [ ] **Góc 8 (Bấm nút liên tục — Debounce):** Vô hiệu hóa nút Lưu trong 1.5s sau khi click để tránh lưu 2 lần.
- [ ] **Góc 10 (Xóa an toàn):** Khi bấm Xóa → Phải có hộp thoại xác nhận; xóa tệp bằng cơ chế Thùng rác.

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [ ] **Anh Mike đã duyệt bản Spec này ngày:** [YYYY-MM-DD]
- [ ] **Trạng thái:** Chuyển sang Chuyển đổi giao diện Stitch MCP (Chặng 4).
