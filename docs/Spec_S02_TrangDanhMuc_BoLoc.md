# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S02_TrangDanhMuc_BoLoc**  
*Tên màn hình:* **Trang Danh Mục Bộ Sưu Tập & Bộ Lọc Thông Minh (Collection & Smart Filter Screen)**  
*Đường dẫn truy cập (URL):* `/bo-suu-tap` hoặc `catalog.html`  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Cung cấp không gian trưng bày toàn bộ các lô đá tự nhiên độc bản hiện có của Queen Stone dưới dạng **Triển lãm Kiến trúc (Architectural Gallery Grid)**.
  - Cung cấp **Bộ Lọc Thông Minh Đa Chiều** giúp Kiến trúc sư và Khách hàng VIP nhanh chóng chọn lọc đúng chủng loại đá, tông màu sắc phong thủy, và ứng dụng công trình theo ý muốn.
  - Từng thẻ sản phẩm (Product Card) đóng vai trò như một tác phẩm triển lãm: Thể hiện rõ ảnh toàn tấm slab, mã định danh lô độc bản, thông số quy cách và **số lượng tồn thực tế ($m^2$ và số tấm) tại thời điểm thực tế**.
  - **Tuyệt đối không có giỏ hàng hay báo giá cố định:** Khách hàng quan tâm có thể bấm xem chi tiết hoặc bấm nút Zalo để gửi mã lô cần tư vấn bóc tách khối lượng.

- **Người dùng thao tác:**
  - Lọc theo Chủng loại đá (Marble, Granite, Quartzite, Onyx).
  - Lọc theo Tông màu chủ đạo (Trắng, Vàng Gold, Đen, Xanh, Xám).
  - Lọc theo Ứng dụng thi công (Ốp mặt tiền, Bàn bếp, Cầu thang, Sàn sảnh đại sảnh, Vách tranh đá).
  - Tìm kiếm nhanh theo Tên đá hoặc Mã lô (`QS-...`).
  - Lọc trạng thái tồn kho (Chỉ xem các lô còn hàng tồn trong kho).

- **Quy tắc bất biến:**
  - **Quy tắc 1 (Mã lô và số tồn minh bạch):** Mọi thẻ đá bắt buộc phải hiển thị rõ Mã lô duy nhất và số lượng tồn thực tế. Nếu số lượng tồn bằng 0, thẻ đá chuyển sang trạng thái "ĐÃ HẾT LÔ", không xóa khỏi danh mục.
  - **Quy tắc 2 (Lọc mượt không tải lại trang):** Bộ lọc hoạt động tức thời phía client hoặc fetch API có debounce 300ms, không làm giật lag hay reload lại toàn bộ trang web.

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Header Hoàng Gia & Thanh Điều Hướng Ngữ Cảnh (Breadcrumb)
- **Header chuẩn Queen Stone:** Logo Vương miện mạ vàng, Menu liên kết 4 trang chính, Hotline VIP, Nút Zalo.
- **Thanh Breadcrumb:** `Trang Chủ > Bộ Sưu Tập Đá Tự Nhiên Độc Bản` (Font chữ Sans-serif nhỏ gọn, màu xám sang trọng).

### KHỐI 2: Tiêu Đề Bộ Sưu Tập & Giới Thiệu (Collection Title & Intro)
- **Tiêu đề lớn (H1 Serif):**  
  *"BỘ SƯU TẬP ĐÁ TỰ NHIÊN ĐỘC BẢN QUEEN STONE"*
- **Mô tả ngắn gọn:**  
  *"Mỗi vỉa đá tự nhiên là độc nhất vô nhị. Khám phá các lô đá cẩm thạch, thạch anh và hoa cương thượng hạng được nhập khẩu trực tiếp từ các mỏ đá trứ danh thế giới."*

### KHỐI 3: Thanh Bộ Lọc Thông Minh Đa Chiều (Smart Multi-Dimensional Filter Bar)
- Bố cục thanh lọc dạng thanh ngang cao cấp (Sticky Toolbar) trên nền trắng cẩm thạch viền vàng nhẹ:
  - **Nhóm 1: Chủng loại đá (Pill Buttons):**  
    `[Tất Cả]` | `[Marble Cẩm Thạch]` | `[Granite Hoa Cương]` | `[Quartzite Thạch Anh]` | `[Onyx Xuyên Sáng]`
  - **Nhóm 2: Tông màu sắc (Color Swatches):**  
    Các nút tròn viền kim loại sang trọng:  
    ⚪ Trắng cẩm thạch | 🟡 Vàng Gold hoàng gia | ⚫ Đen huyền bí | 🟢 Xanh ngọc lục bảo | 🔘 Xám khói kiến trúc
  - **Nhóm 3: Ứng dụng thi công (Dropdown Select):**  
    Menu thả xuống: *Tất cả ứng dụng | Ốp mặt tiền biệt thự | Mặt bàn bếp & Đảo bếp | Lát sàn đại sảnh | Vách thông tầng & Tranh đá | Cầu thang bộ*.
  - **Nhóm 4: Ô tìm kiếm nhanh (Search Box):**  
    Ô nhập liệu viền vàng tinh tế: *"Nhập tên đá hoặc mã lô (VD: Calacatta, QS-MB-01)..."* kèm icon kính lúp.
  - **Nhóm 5: Bộ lọc tồn kho & Nút xóa:**  
    - Checkbox: `☑ Chỉ hiện các lô còn hàng tồn`
    - Nút phụ: `[Xóa Bộ Lọc]` (Làm mới về mặc định)

### KHỐI 4: Thanh Trạng Thái & Thống Kê Kết Quả (Result Status Bar)
- **Bên trái:** Dòng thông báo số lượng: *"Hiển thị [X] lô đá độc bản sẵn sàng xuất kho"*
- **Bên phải:** Bộ chọn sắp xếp (Sort By Dropdown):
  - *Mới nhập về kho gần nhất* (Mặc định)
  - *Diện tích tồn nhiều nhất*
  - *Độ dày lớn nhất (20mm - 30mm)*

### KHỐI 5: Lưới Thẻ Sản Phẩm Triển Lãm (Gallery Product Grid)
- Bố cục lưới 3 cột (Desktop) hoặc 2 cột (Tablet) hoặc 1 cột (Mobile).
- **Cấu trúc mỗi Thẻ Sản Phẩm (Product Card):**
  - **Huy hiệu Mã Lô (Góc trên trái ảnh):** Tag viền vàng sắc sảo: `QS-CALA-01`
  - **Huy hiệu Tồn Kho (Góc trên phải ảnh):** 
    - Nếu còn hàng: Tag xanh lá cây nhạt viền ngọc lục bảo `Còn 8 tấm (~ 43.6 m²)`
    - Nếu hết hàng: Tag xám chì sang trọng `ĐÃ HẾT LÔ`
  - **Khung ảnh chính (Ratio 4:3 hoặc 16:10):**
    - Ảnh chụp thẳng nguyên tấm slab độ phân giải cao.
    - **Hiệu ứng Hover:** Khi rê chuột vào ảnh, ảnh mờ nhẹ chuyển mượt (Cross-fade) sang ảnh cận cảnh đường vân vi mô (Macro texture) kèm nhãn "Xem chi tiết tấm".
  - **Thông tin chi tiết bên dưới ảnh:**
    - **Tên Đá (Font Serif sang trọng):** `Calacatta Borghini Extra`
    - **Chủng loại & Xuất xứ:** `Marble Tự Nhiên • Carrara, Ý`
    - **Bảng quy cách nhanh:** `Dài: 2,950 mm | Rộng: 1,850 mm | Dày: 20 mm`
    - **Ứng dụng tiêu biểu:** Gắn các chip tag nhỏ: `Ốp sảnh` `Vách tivi` `Bàn bếp`
  - **Thanh nút bấm hành động (Action Bar):**
    - Nút 1 (Chính): **"Chi Tiết Lô Đá"** (Dẫn sang `Spec_S03`).
    - Nút 2 (Nhanh): **"Zalo Tư Vấn"** (Icon Zalo vàng, mở chat hỏi nhanh về mã lô này).

### KHỐI 6: Phân Trang / Nút Tải Thêm (Pagination / Load More)
- Nút bấm viền vàng Gold thanh thoát ở trung tâm: **"Xem Thêm Các Lô Đá Độc Bản Khác"**
- Hiển thị thanh tiến trình: *"Đang hiển thị 12 / 24 lô đá trong kho"*.

### KHỐI 7: Hộp Cam Kết Tính Độc Bản Hoàng Gia (Royal Authenticity Note)
- Khung viền chỉ vàng sang trọng với biểu tượng Vương miện Queen Stone ở chân danh mục:
  *"Mỗi lô đá tự nhiên Queen Stone cung cấp là một phần độc nhất từ lòng đất mẹ, được cấp chứng chỉ xuất xứ mỏ đá chính hãng. Chúng tôi khuyến khích Quý khách liên hệ chuyên viên để giữ lô hoặc đến trực tiếp tổng kho kiểm tra hoa văn trước khi xuất bán cho công trình khác."*

### KHỐI 8: Chân Trang Hoàng Gia (Footer)
- Footer chuẩn nhận diện Queen Stone.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Header Queen Stone và Breadcrumb rõ ràng.
- Thanh Filter Bar đầy đủ: Chủng loại đá (Pill), Tông màu (Swatches), Ứng dụng (Dropdown), Ô tìm kiếm mã lô, Checkbox chỉ hiện còn hàng.
- Lưới sản phẩm Gallery chuẩn kiến trúc, hiển thị rõ Mã lô độc bản và số lượng tồn $m^2$.
- Thẻ sản phẩm có ảnh slab, hiệu ứng xem vân, thông số kích thước và 2 nút hành động (Xem chi tiết & Chat Zalo).
- Hộp cam kết tính độc bản ở cuối trang.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM vẽ Nút "Thêm vào giỏ hàng" (Add to Cart) trên bất kỳ thẻ sản phẩm nào.**
- ❌ **CẤM vẽ Icon giỏ hàng hoặc đếm số lượng món đồ trên Header.**
- ❌ **CẤM hiển thị cột giá tiền hoặc giá bán lẻ VNĐ/m² (Vi phạm quy tắc bảo mật giá của Anh Mike).**
- ❌ **CẤM vẽ bộ lọc khoảng giá kéo trượt (Price Range Slider).**
- ❌ **CẤM vẽ ô chọn số lượng mua (Quantity input `[-] [1] [+]`).**

---

## 4. ĐẶC TẢ HAI TRẠNG THÁI GIAO DIỆN (DUAL-STATE UI SPECIFICATION)

### Trạng thái 1: Zero-State (Khi bộ lọc không tìm thấy kết quả)
- **Hình minh họa:** Khung viền đá cẩm thạch mờ thanh lịch kèm logo Vương miện Queen Stone.
- **Tiêu đề:** *"Không tìm thấy lô đá phù hợp với bộ lọc hiện tại"*
- **Nội dung hướng dẫn:** *"Hiện tại các lô đá theo tiêu chí này có thể đã được xuất kho hết cho các công trình hoặc đang trên chuyến tàu cập cảng. Quý khách có thể xóa bộ lọc để xem toàn bộ danh mục hoặc kết nối Zalo để chuyên viên kiểm tra vỉa đá sắp nhập khẩu."*
- **Hai nút CTA:**  
  - Nút chính: **"Xóa Bộ Lọc Về Mặc Định"**  
  - Nút phụ (Vàng Gold): **"Hỏi Chuyên Viên Về Dòng Đá Này Qua Zalo"**

### Trạng thái 2: Active-State (Khi hiển thị danh sách lô đá bình thường)
- Hiển thị đầy đủ Khối 1 đến Khối 8 như đặc tả tại Mục 2.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Tìm kiếm không phân biệt hoa thường và dấu tiếng Việt):** Nhập "calacata", "CALACATTA", "đá cẩm thạch" hay "da cam thach" đều tìm ra chính xác kết quả.
- [x] **Góc 2 (Bộ lọc nhiều tiêu chí đồng thời - Multi-facet filter):** Chọn Chủng loại: Marble + Màu: Vàng Gold + Ứng dụng: Bàn bếp $\rightarrow$ Hệ thống lọc theo điều kiện giao (AND) mượt mà.
- [x] **Góc 3 (Lô đá vừa được xuất hết trong kho):** Nếu thủ kho vừa xuất hết lô (số tấm = 0), danh mục ngoài Web cập nhật ngay huy hiệu "ĐÃ HẾT LÔ", nếu người dùng đang bật checkbox "Chỉ hiện còn hàng" thì lô đó sẽ tự động ẩn đi.
- [x] **Góc 4 (Ảnh slab chưa kịp tải xong):** Hiển thị khung placeholder vân đá cẩm thạch xám nhẹ thanh lịch, không bị giật nhảy layout (CLS = 0).
- [x] **Góc 5 (Click nút Zalo nhanh từ thẻ sản phẩm):** Tự động mở deep link Zalo chứa sẵn: `"Chào Queen Stone, tôi đang quan tâm mẫu đá [Tên đá] - Mã lô: [Mã lô]. Nhờ chuyên viên gửi video và tư vấn khối lượng."`
- [x] **Góc 6 (Bấm nút lọc liên tục):** Sử dụng cơ chế Debounce 300ms chống spam gọi API.

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
