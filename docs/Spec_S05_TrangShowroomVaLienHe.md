# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S05_TrangShowroomVaLienHe**  
*Tên màn hình:* **Trang Hệ Thống Showroom, Tổng Kho Bãi Đá & Bản Đồ (Showrooms, Warehouses & Contact Screen)**  
*Đường dẫn truy cập (URL):* `/showroom-lien-he` hoặc `contact.html`  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Đối với ngành đá tự nhiên cao cấp, việc **"mục sở thị tận mắt và sờ tận tay"** từng phiến đá tại showroom hoặc bãi kho là bước quyết định tối quan trọng trước khi ký hợp đồng.
  - Trang này giúp Gia chủ và Kiến trúc sư dễ dàng tìm kiếm địa chỉ Showroom gần nhất hoặc bãi kho tập kết lớn để trực tiếp kiểm tra vân đá.
  - **Phân định rõ ràng 2 mô hình cơ sở:**
    1. *Showroom Triển Lãm VIP (Trung tâm Thành phố):* Không gian gallery kiến trúc sang trọng, ánh sáng tiêu chuẩn bảo tàng, trưng bày các tấm slab đá quý hiếm nhất (Calacatta, Onyx ngọc), phòng tiếp khách VIP trà đạo thượng lưu.
    2. *Tổng Kho Bãi Đá Trữ Lượng Lớn (Cụm Công Nghiệp / Cảng Biển):* Khuôn viên bãi chứa hàng chục ngàn mét vuông, trang bị hệ thống cẩu trục chuyên dụng bốc dỡ nguyên đai nguyên kiện từ cảng biển về, phục vụ khách hàng muốn chọn vỉa đá số lượng lớn cho toàn bộ dinh thự.
  - Tích hợp bản đồ dẫn đường tương tác (Google Maps Embed), đường link chỉ đường 1-chạm mở app Google Maps trên điện thoại, số điện thoại hotline gọi trực tiếp (`tel:`), và nút kết nối Zalo đặt lịch hẹn đón tiếp riêng tư.
  - **Tuyệt đối không sử dụng form liên hệ rườm rà 10 ô nhập:** Khách hàng Queen Stone là giới thượng lưu, họ cần phương thức kết nối trực tiếp, nhanh chóng (Zalo 1-click, Hotline trực ban, Bản đồ dẫn đường).

- **Người dùng thao tác:**
  - Chuyển đổi xem danh sách Showroom hoặc Tổng kho bãi đá.
  - Xem ảnh cơ sở, địa chỉ chi tiết, giờ mở cửa.
  - Bấm nút chỉ đường để mở Google Maps dẫn xe ô tô đến tận cửa kho/showroom.
  - Bấm nút Zalo để hẹn giờ chuyên viên Queen Stone chuẩn bị phòng trà đón tiếp.

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Header Hoàng Gia & Thanh Điều Hướng (Breadcrumb)
- **Header chuẩn Queen Stone:** Logo Vương miện, Menu 4 trang, Hotline VIP, Nút Zalo.
- **Breadcrumb:** `Trang Chủ > Hệ Thống Showroom & Tổng Kho Queen Stone`.

### KHỐI 2: Hero Intro Giới Thiệu Mạng Lưới (Network Hero Banner)
- **Tiêu đề lớn (H1 Serif):**  
  *"MỤC SỞ THỊ KIỆT TÁC ĐÁ TẠI HỆ THỐNG SHOWROOM & TỔNG KHO QUEEN STONE"*
- **Lời dẫn:**  
  *"Kính mời Quý khách hàng và các Kiến trúc sư đến tham quan trực tiếp để cảm nhận trọn vẹn chiều sâu khoáng vật, độ bóng gương và thần thái độc bản của từng phiến đá tự nhiên."*

### KHỐI 3: Bộ Chuyển Đổi Tab Loại Cơ Sở (Facility Type Tabs)
- Thiết kế dạng 2 nút Tab lớn sang trọng viền vàng:
  - Tab 1 (Active): **🏛️ [SHOWROOM TRIỂN LÃM VIP (TRUNG TÂM TP)]** — Không gian Gallery đón tiếp thượng lưu.
  - Tab 2: **🏗️ [TỔNG KHO BÃI ĐÁ QUY MÔ LỚN (CẢNG BÃI)]** — Bãi đá khối lượng lớn, xe cẩu lật tấm.

### KHỐI 4: Danh Sách Thẻ Cơ Sở Chi Tiết (Facility Cards Grid)
Lưới 2 cột (Desktop) thể hiện các cơ sở chiến lược:

#### 1. Thẻ Showroom Flagship Hà Nội:
- **Ảnh cơ sở:** Ảnh mặt tiền tòa nhà trưng bày đá ốp cẩm thạch sang trọng.
- **Tên cơ sở:** `Showroom Flagship Queen Stone Hà Nội`
- **Loại hình:** `Không gian Triển lãm & Phòng Trà VIP`
- **Địa chỉ:** `Biệt thự BT08, Khu Ngoại Giao Đoàn, P. Xuân Đỉnh, Q. Bắc Từ Liêm, TP. Hà Nội`
- **Giờ mở cửa:** `08:00 - 19:00 (Mở cửa tất cả các ngày trong tuần)`
- **Hotline chi nhánh:** `024.3999.xxxx` | **Zalo Lễ Tân:** `0988.xxx.xxx`
- **Hai nút hành động nhanh:**
  - Nút 1 (Vàng Gold): **"Chỉ Đường Google Maps"** (Mở app dẫn đường).
  - Nút 2: **"Đặt Lịch Đón Tiếp VIP Qua Zalo"** (Icon Zalo).

#### 2. Thẻ Showroom Flagship TP. Hồ Chí Minh:
- **Ảnh cơ sở:** Không gian trưng bày vách đá Bookmatch với hệ đèn bảo tàng.
- **Tên cơ sở:** `Showroom Flagship Queen Stone Sài Gòn`
- **Loại hình:** `Không gian Triển lãm & Phòng Trà VIP`
- **Địa chỉ:** `Số 18 Đường Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh`
- **Giờ mở cửa:** `08:00 - 19:00 (Mở cửa cả Thứ 7 & Chủ Nhật)`
- **Hotline chi nhánh:** `028.3888.xxxx` | **Zalo Lễ Tân:** `0977.xxx.xxx`
- **Hai nút hành động:** "Chỉ Đường Google Maps" + "Đặt Lịch Đón Tiếp VIP Qua Zalo".

#### 3. Thẻ Tổng Kho Bãi Đá Miền Bắc:
- **Ảnh cơ sở:** Bãi cẩu đá ngoài trời và nhà kho tiêu chuẩn lưu trữ đá tấm khép kín.
- **Tên cơ sở:** `Tổng Kho Đá Khối & Slab Miền Bắc`
- **Quy mô:** `Diện tích 12,000 m² • Sức chứa 50,000 m² đá slab`
- **Địa chỉ:** `Cụm Công Nghiệp Nguyên Khê, Quốc lộ 3, Huyện Đông Anh, TP. Hà Nội`
- **Dịch vụ hỗ trợ:** *Xe cẩu lật tấm slab kiểm tra 2 mặt • Xe nâng bốc xếp container*
- **Hai nút hành động:** "Chỉ Đường Xe Ô Tô Đến Kho" + "Báo Trước Với Quản Lý Kho".

#### 4. Thẻ Tổng Kho Bãi Đá Miền Nam:
- **Ảnh cơ sở:** Bãi đá tập kết gần cụm cảng quốc tế với hàng trăm kiện đá nguyên khối.
- **Tên cơ sở:** `Tổng Kho Đá Khối & Slab Miền Nam`
- **Quy mô:** `Diện tích 15,000 m² • Trữ lượng nhập khẩu từ Ý, Brazil`
- **Địa chỉ:** `Đường Số 2, KCN Long Thành, Tỉnh Đồng Nai (Gần cụm cảng Cát Lái)`
- **Hai nút hành động:** "Chỉ Đường Xe Ô Tô Đến Kho" + "Báo Trước Với Quản Lý Kho".

### KHỐI 5: Khung Bản Đồ Tương Tác (Interactive Map Section)
- Khung bản đồ chất lượng cao (Google Maps Embed) viền chỉ vàng tinh tế.
- Trên bản đồ gắn sẵn các điểm ghim (Map Pins) logo Vương miện Queen Stone tại các địa điểm.
- Thanh chọn nhanh phía trên bản đồ: Nhấp nút cơ sở nào $\rightarrow$ Bản đồ lập tức lướt tới vị trí cơ sở đó (Smooth Pan Animation).

### KHỐI 6: Khối Tiếp Nhận Hồ Sơ Bản Vẽ & Hotline Trực Ban 24/7
- **Tiêu đề:** *"Dành Riêng Cho Kiến Trúc Sư & Tổng Thầu Cần Bóc Tách Khối Lượng"*
- **3 Kênh tiếp nhận nhanh:**
  1. **Hotline Trực Ban 24/7:** `0988.xxx.xxx` (Kỹ sư Mike Lam phụ trách kỹ thuật).
  2. **Hộp Thư Bản Vẽ:** `bientap@queenstone.vn` (Tiếp nhận file CAD, 3DsMax, PDF bóc tách).
  3. **Zalo Kỹ Thuật:** Zalo số `0988.xxx.xxx` tiếp nhận bản vẽ và phản hồi phương án mạch đá trong vòng 2 giờ.

### KHỐI 7: Chân Trang Hoàng Gia (Footer)
- Footer chuẩn Queen Stone.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Header Queen Stone và Breadcrumb đầy đủ.
- Tab chuyển đổi rõ ràng giữa Showroom VIP và Tổng Kho Bãi Đá.
- Thẻ cơ sở đầy đủ: Ảnh cơ sở, tên, địa chỉ chi tiết, giờ mở cửa, hotline bàn, Zalo lễ tân.
- Nút "Chỉ Đường Google Maps" và Nút "Đặt Lịch Đón Tiếp VIP".
- Khung Bản đồ tương tác dẫn đường.
- Khối tiếp nhận bản vẽ CAD và Hotline 24/7.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM vẽ Form liên hệ rườm rà dài dòng (Họ tên, tuổi, địa chỉ nhà, nội dung dài...) gây mất thời gian của khách VIP.**
- ❌ **CẤM vẽ giỏ hàng, bảng giá hay thanh toán online.**
- ❌ **CẤM tích hợp các widget chat bot AI tự động trả lời ngớ ngẩn (Mọi kết nối đều chuyển trực tiếp về Zalo của con người thật).**

---

## 4. ĐẶC TẢ HAI TRẠNG THÁI GIAO DIỆN (DUAL-STATE UI SPECIFICATION)

### Trạng thái Active-State:
- Hiển thị đầy đủ thông tin của 4 cơ sở chiến lược và bản đồ định vị chính xác.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Bản đồ Google Maps không load được do lỗi mạng):** Vẫn hiển thị đầy đủ địa chỉ dạng văn bản rõ ràng kèm nút mở link Google Maps ngoài tab mới (`https://maps.google.com/?q=...`).
- [x] **Góc 2 (Bấm gọi điện thoại từ smartphone):** Số hotline gắn link `tel:0988xxxxxx` để bấm phát gọi luôn, không cần gõ lại số.
- [x] **Góc 3 (Đặt lịch đón tiếp ngoài giờ hành chính):** Ghi rõ số hotline trực ban 24/7 để tiếp đón khách VIP bay từ xa đến xem đá đột xuất vào buổi tối.
- [x] **Góc 4 (Khách hàng đi xe ô tô kích thước lớn):** Có ghi chú rõ bãi đỗ xe ô tô 7 chỗ và xe cẩu chuyên dụng tại tất cả các cơ sở.

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
