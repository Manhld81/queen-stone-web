# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S04_TrangCongTrinhTieuBieu**  
*Tên màn hình:* **Trang Triển Lãm Dự Án & Công Trình Tiêu Biểu (Project Showcase & Lookbook Screen)**  
*Đường dẫn truy cập (URL):* `/cong-trinh` hoặc `projects.html`  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Khẳng định uy tín, năng lực cung ứng đá khối lượng lớn và trình độ thi công đỉnh cao của Queen Stone qua các **Dự án Thực tế Đã Hoàn Thiện** (Dinh thự, Biệt thự lâu đài, Khách sạn boutique 5*, Penthouse triệu đô).
  - Trình bày dạng **Tạp chí Kiến trúc Thượng lưu (Architectural Lookbook)**: Hình ảnh thực tế chân thực sau khi bàn giao nghiệm thu, tôn vinh nghệ thuật ghép vân Bookmatch và sự xa hoa của đá tự nhiên khi đặt vào không gian nội thất.
  - **Tính năng Liên kết Chéo Mẫu Đá (Cross-Linking Stone Tags):** Trên mỗi công trình, hệ thống gắn các thẻ (Tags) chỉ rõ mẫu đá Queen Stone nào đã được ứng dụng cho hạng mục nào (Ví dụ: `Calacatta Borghini - Ốp vách đại sảnh`). Khách hàng click vào thẻ sẽ được chuyển hướng thẳng đến xem chi tiết tấm slab đá và kiểm tra số lượng tồn kho thực tế.
  - Cung cấp Modal trình chiếu bộ ảnh các góc chụp chi tiết (Đại sảnh, Bàn bếp, Vách thông tầng, Phòng tắm Master).
  - **Tuyệt đối bảo mật thông tin tài chính và danh tính riêng tư của Gia chủ:** Không hiển thị giá trị hợp đồng hay họ tên cá nhân của chủ nhà (chỉ hiển thị vị trí khu đô thị/thành phố).

- **Người dùng thao tác:**
  - Lọc công trình theo loại hình (Dinh thự, Biệt thự, Penthouse, Khách sạn).
  - Xem bài thuyết minh kiến trúc và bộ ảnh thực tế.
  - Bấm vào các Tag đá để xem chi tiết mẫu đá tương ứng.
  - Mở Modal Lightbox để xem ảnh phóng to các đường mạch ghép đá.
  - Bấm nút Zalo để kết nối Giám đốc Kỹ thuật tư vấn phương án bóc tách bản vẽ công trình của mình.

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Header Hoàng Gia & Thanh Điều Hướng (Breadcrumb)
- **Header chuẩn Queen Stone:** Logo Vương miện mạ vàng, Menu liên kết chính, Hotline VIP, Nút Zalo.
- **Breadcrumb:** `Trang Chủ > Dự Án Kiến Trúc & Công Trình Tiêu Biểu`.

### KHỐI 2: Hero Banner Công Trình (Architectural Lookbook Hero)
- **Hình nền:** Ảnh toàn cảnh đại sảnh vách đá thông tầng đối xứng vân Bookmatch lộng lẫy của một dinh thự thực tế.
- **Tiêu đề lớn (H1 Serif):**  
  *"DẤU ẤN KIẾN TRÚC VƯƠNG GIẢ — CÁC CÔNG TRÌNH TIÊU BIỂU"*
- **Mô tả ngắn:**  
  *"Mỗi công trình là một bản giao hưởng giữa tạo tác triệu năm của đá tự nhiên và bàn tay điêu luyện của nghệ nhân Queen Stone. Chiêm ngưỡng các dự án thực tế đã hoàn thiện."*

### KHỐI 3: Thanh Bộ Lọc Loại Hình Công Trình (Project Filter Bar)
- Thanh nút bấm Pill cao cấp trên nền trắng cẩm thạch viền vàng nhẹ:
  - `[Tất Cả Công Trình]` (Mặc định)
  - `[Dinh Thự - Biệt Thự Lâu Đài]`
  - `[Khách Sạn & Resort 5 Sao]`
  - `[Penthouse & Căn Hộ Thượng Lưu]`
  - `[Trụ Sở & Tòa Nhà Tập Đoàn]`

### KHỐI 4: Danh Sách Công Trình Triển Lãm (Architectural Lookbook Showcase)
- Bố cục danh sách dạng thẻ tạp chí kiến trúc đối xứng (hoặc so le ảnh/chữ):
  - **Ảnh chính góc rộng (Ratio 16:9):** Ảnh chụp chuyên nghiệp không gian sau khi hoàn thiện bàn giao.
  - **Huy hiệu Loại hình & Năm hoàn thiện:** Tag viền vàng góc trên: `DINH THỰ • HOÀN THÀNH 2025`
  - **Tên Dự Án (Font Serif sang trọng):** `Dinh Thự Chateau Royal Riverside`
  - **Địa điểm:** `Khu Đô Thị Ecopark, Hưng Yên`
  - **Các hạng mục thi công chủ đạo:**  
    *Ốp vách đại sảnh thông tầng Bookmatch • Lát sàn sảnh đón đá hoa cương • Bàn đảo bếp Master Quartzite*
  - **KHỐI THẺ ĐÁ QUEEN STONE SỬ DỤNG (Cross-Linking Stone Tags):**
    - Tag 1: 💎 `Calacatta Borghini Extra (Ốp vách đại sảnh)` $\rightarrow$ Click mở trang chi tiết đá `QS-CALA-08`.
    - Tag 2: 💎 `Black Taurus Granite (Bàn đảo bếp)` $\rightarrow$ Click mở trang chi tiết đá `QS-GR-02`.
    - Tag 3: 💎 `Crema Marfil Marble (Lát sàn sảnh)` $\rightarrow$ Click mở trang chi tiết đá `QS-MB-05`.
  - **Nút Hành Động:**
    - Nút 1: **"Xem Bộ Ảnh Thực Tế Dự Án"** (Mở Modal Lightbox hiển thị 6-8 góc chụp chi tiết).
    - Nút 2: **"Tư Vấn Hạng Mục Tương Tự Qua Zalo"** (Icon Zalo).

### KHỐI 5: Modal Trình Chiếu Bộ Ảnh Công Trình (Project Gallery Lightbox Modal)
- Khi bấm "Xem Bộ Ảnh Thực Tế": Modal tràn màn hình mượt mà (Dark Overlay thanh lịch):
  - Khung ảnh phóng to độ nét cao thể hiện rõ đường mạch đá ghép khít 1mm.
  - Thanh trượt các góc chụp: Góc sảnh đón, góc phòng ăn, góc vách tivi, góc phòng tắm master.
  - Chú thích bên dưới từng ảnh: Hạng mục và chủng loại đá được sử dụng trong góc chụp đó.
  - Nút bấm đóng [X] và phím mũi tên chuyển ảnh.

### KHỐI 6: Tiêu Chuẩn Thi Công 4 Bước Khắt Khe Của Queen Stone
- Khung 4 cột thể hiện năng lực tổng thầu đá chuyên nghiệp:
  1. **Khảo sát Laser 3D:** Quét hiện trạng công trình chính xác từng milimet.
  2. **Gia công CNC & Xếp vân mô phỏng:** Dựng 3D ghép mạch đối xứng vân trước khi cắt tấm slab thực tế.
  3. **Chống thấm 6 mặt Châu Âu:** Xử lý hóa chất thẩm thấu sâu bảo vệ bề mặt đá vĩnh cửu.
  4. **Nghệ nhân lắp ghép tỉ mỉ:** Thi công đường chỉ mạch đá siêu khít và đánh bóng hoàn thiện tại chỗ.

### KHỐI 7: Khối Kêu Gọi Hành Động (CTA Section)
- Khung nền nhung xám viền vàng gold:
  - Tiêu đề: *"Quý Khách Muốn Ứng Dụng Đá Tự Nhiên Độc Bản Cho Công Trình Của Mình?"*
  - Lời dẫn: *"Hãy gửi bản vẽ mặt bằng hoặc phối cảnh thiết kế cho Giám đốc Kỹ thuật Queen Stone để nhận phương án chọn vỉa đá và bóc tách khối lượng tối ưu nhất."*
  - Nút CTA lớn mạ vàng: **"GỬI BẢN VẼ — KẾT NỐI GIÁM ĐỐC KỸ THUẬT QUA ZALO"**
  - Hotline kỹ thuật dự án: `0988.xxx.xxx`

### KHỐI 8: Chân Trang Hoàng Gia (Footer)
- Footer chuẩn Queen Stone.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Header Queen Stone và Breadcrumb rõ ràng.
- Hero Banner Lookbook ấn tượng.
- Bộ lọc loại hình công trình (Dinh thự, Biệt thự, Khách sạn, Penthouse).
- Thẻ công trình có ảnh chụp thực tế chất lượng cao, tên công trình, địa điểm, hạng mục thi công.
- **Bắt buộc có Khối Thẻ Đá Queen Stone (Stone Tags) có thể click liên kết sang chi tiết mẫu đá.**
- Modal Lightbox trình chiếu ảnh công trình.
- Khối 4 bước tiêu chuẩn thi công và Nút Zalo gửi bản vẽ kỹ thuật.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM hiển thị tổng giá trị hợp đồng hay chi phí thi công (Bảo mật tài chính gia chủ).**
- ❌ **CẤM hiển thị họ tên cụ thể hay số nhà riêng tư của chủ nhà (chỉ ghi tên dự án & khu đô thị).**
- ❌ **CẤM vẽ giỏ hàng hay bất kỳ nút đặt cọc trực tuyến nào.**

---

## 4. ĐẶC TẢ HAI TRẠNG THÁI GIAO DIỆN (DUAL-STATE UI SPECIFICATION)

### Trạng thái 1: Zero-State (Khi chọn loại hình chưa có công trình)
- **Hình minh họa:** Bản vẽ phối cảnh kiến trúc mờ nhẹ kèm logo Queen Stone.
- **Tiêu đề:** *"Các công trình thuộc hạng mục này đang trong giai đoạn nghiệm thu"*
- **Nội dung:** *"Các công trình thuộc phân khúc này đang được Queen Stone và Tổng thầu hoàn thiện phần đá ốp lát. Quý khách vui lòng xem các dự án ở hạng mục khác hoặc liên hệ hotline để nhận Hồ sơ Năng lực (Profile PDF) mới nhất."*
- **Nút CTA:** **"Xem Toàn Bộ Công Trình"** + **"Tải Hồ Sơ Năng Lực (PDF)"**.

### Trạng thái 2: Active-State (Khi hiển thị danh sách công trình bình thường)
- Hiển thị đầy đủ Khối 1 đến Khối 8.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Mẫu đá dùng trong công trình đã bán hết lô):** Khách click vào thẻ đá sẽ vẫn xem được thông số kỹ thuật tấm slab kèm nhãn "Lô đá này đã xuất hết cho dự án. Liên hệ chọn vỉa mới".
- [x] **Góc 2 (Bộ ảnh công trình nặng dung lượng):** Ảnh danh mục dùng định dạng nén tối ưu web, chỉ nạp ảnh độ phân giải cao khi mở Modal Lightbox.
- [x] **Góc 3 (Xem trên thiết bị di động):** Modal Lightbox hỗ trợ vuốt chạm (Swipe) để chuyển ảnh tự nhiên.
- [x] **Góc 4 (Bảo vệ bản quyền hình ảnh):** Ảnh công trình gắn watermark chìm tinh tế "Queen Stone Project Gallery".

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
