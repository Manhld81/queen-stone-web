# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S01_TrangChu_Home**  
*Tên màn hình:* **Trang Chủ Triển Lãm Hoàng Gia (Home Showcase Screen)**  
*Đường dẫn truy cập (URL):* `/` hoặc `index.html`  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Định hình ngay từ cái nhìn đầu tiên vị thế tối thượng của Queen Stone: Thương hiệu cung cấp đá tự nhiên cao cấp bậc nhất cho dinh thự, lâu đài, biệt thự và khách sạn hạng sang.
  - Phong cách thiết kế: **Bright Architectural Gallery & Royal Luxury** — Không gian triển lãm ánh sáng chuẩn gallery kiến trúc, nền trắng cẩm thạch Calacatta thanh thoát kết hợp điểm xuyết ánh vàng Gold vương quyền.
  - Dẫn dắt người dùng (Kiến trúc sư, Gia chủ VIP) tiếp cận nhanh các dòng đá độc bản (Marble, Granite, Quartzite, Onyx xuyên sáng) và dẫn sang Trang Danh mục Bộ Sưu Tập hoặc Trang Chi tiết Mẫu đá.
  - **Tuyệt đối không có tính năng bán lẻ đại trà:** Không giỏ hàng, không báo giá tự động, tập trung tôn vinh giá trị độc bản của từng khối đá tự nhiên.

- **Người dùng thao tác:**
  - Chủ nhân công trình, Kiến trúc sư, Nhà thiết kế nội thất khám phá thương hiệu, xem các tấm slab độc bản nổi bật trong tuần, xem công trình tiêu biểu, truy cập nhanh Zalo tư vấn.

- **Quy tắc bất biến:**
  - **Quy tắc 1 (Bản sắc Hoàng gia):** Logo Vương miện Queen Stone luôn ở vị trí trung tâm hoặc góc trái danh dự trên thanh điều hướng đỉnh, đi kèm số Hotline VIP.
  - **Quy tắc 2 (Dữ liệu thật từ kho):** Các tấm slab tiêu biểu trưng bày trên Trang chủ phải được lấy trực tiếp từ CSDL kho đá (`san_pham_da`), hiển thị đúng mã lô và số lượng tồn thực tế.

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Header Hoàng Gia & Thanh Điều Hướng (Royal Navigation Bar)
- **Top Bar (Thanh thông tin đỉnh):**
  - Dòng chữ chạy nhẹ hoặc thông điệp tinh tế: *"Queen Stone — Tổng kho đá tự nhiên độc bản nhập khẩu Ý, Brazil & Tây Ban Nha"*.
  - Hotline VIP trực ban: `Hotline: 0988.xxx.xxx` (Có icon điện thoại viền vàng).
  - Nút chuyển nhanh: *"Mạng Lưới 3 Showroom & Tổng Kho"*.
- **Main Header (Thanh menu chính):**
  - **Logo:** Biểu tượng Vương miện Hoàng gia (Crown Icon) mạ vàng kết hợp dòng chữ `QUEEN STONE` kiểu chữ Serif sang trọng.
  - **Menu Liên Kết:**
    1. *Trang Chủ* (Đang kích hoạt - Active)
    2. *Bộ Sưu Tập Đá* (Dẫn tới `/bo-suu-tap`)
    3. *Công Trình Tiêu Biểu* (Dẫn tới `/cong-trinh`)
    4. *Showroom & Tổng Kho* (Dẫn tới `/showroom-lien-he`)
  - **Nút Hành Động Góc Phải:**
    - Nút phụ: *Tra Cứu Mã Lô Kho* (Dẫn tới ô tìm kiếm danh mục).
    - Nút chính (CTA mạ vàng): *Kết Nối Zalo Chuyên Viên* (Icon Zalo + mở chat).
    - Nút ẩn tinh tế: Biểu tượng chìa khóa nhỏ dẫn vào *Quản Trị Kho (Admin)*.

### KHỐI 2: Hero Banner Triển Lãm Kiến Trúc Động (Architectural 5-Zone Villa Slider Hero)
- **Hình nền động (Hero Image Slider / Carousel):**
  - **Số lượng:** Gồm **5 ảnh chất lượng cao** chụp từ các căn biệt thự, dinh thự sang trọng và xa hoa bậc nhất:
    1. *Zone 1 — Đại Sảnh Thông Tầng Hoàng Gia (Grand Palatial Foyer):* Hệ thức cột đá cẩm thạch Xanh Lục Bảo (Verde Alpi / Emerald Quartzite) đồ sộ, sàn cẩm thạch Statuario bóng gương phản chiếu đèn chùm hoàng gia.
    2. *Zone 2 — Vách Thông Tầng Phòng Khách (Double-height Living Room Feature Wall):* Bức tường đá thạch anh Patagonia đối vân (Bookmatched) cao 7m lộng lẫy.
    3. *Zone 3 — Đảo Bếp & Quầy Bar Hoàng Gia (Royal Kitchen Island & Bar):* Mặt đá Onyx ngọc xuyên sáng kết hợp thạch anh đen kim cương.
    4. *Zone 4 — Đại Cầu Thang Xoắn Ốc Dinh Thự (Grand Palatial Curved Staircase):* Bậc thang uốn lượn ốp đá cẩm thạch trắng tự nhiên không tì vết.
    5. *Zone 5 — Phòng Tắm Master Suite Spa (Master Luxury Bathroom):* Vách bồn tắm ốp đá Arabescato Corchia vân mây xa hoa.
  - **Kiểu chuyển động:** **1 CHIỀU DUY NHẤT TỪ PHẢI SANG TRÁI (*Strictly Unidirectional Right-to-Left*)**:
    - Ảnh mới luôn trượt từ mép bên phải lướt sang mép bên trái.
    - **Khắc phục triệt để lỗi đảo chiều ở ảnh 5:** Xoay vòng vô tận `Ảnh 1 ➔ Ảnh 2 ➔ Ảnh 3 ➔ Ảnh 4 ➔ Ảnh 5 ➔ Ảnh 1 ➔ Ảnh 2...` hoàn toàn theo chiều từ Phải sang Trái. Áp dụng kỹ thuật kiến trúc **Seamless Clone Buffer** (`[Slide 5 Clone, 1, 2, 3, 4, 5, 1 Clone]`). Khi ảnh 5 trượt sang ảnh 1 (clone) cùng chiều từ Phải sang Trái, hệ thống ngầm reset vị trí (0ms) về ảnh 1 gốc, đảm bảo 100% không bao giờ xảy ra hiện tượng đảo chiều/giật lùi.
  - **Tần suất chuyển:** **2.0 giây / 1 lần chuyển** (*2000ms automatic interval*).
  - **Thanh chỉ báo & Điều khiển (Architectural Indicators):**
    - 5 vạch tiến trình (progress segments) nạp đầy theo nhịp 2.0s.
    - Nhãn định danh khu vực: Hiển thị rõ số thứ tự và tên phân khu (VD: `01 / 05 — ĐẠI SẢNH THÔNG TẦNG HOÀNG GIA`).
    - Nút điều hướng mũi tên bán trong suốt viền chỉ vàng hoàng gia (`#D4AF37`).
- **Phân cấp Slogan Mỹ thuật Hoàng Gia (Two-line High Contrast Headline):**
  - **Dòng 1 (Lớn, uy nghi):** `Tuyệt tác đá tự nhiên,` — Phông chữ `Libre Caslon Text` (Serif cổ điển), màu Trắng tuyết (`#FFFFFF`), text-shadow đa tầng.
  - **Dòng 2 (Nhỏ hơn, thanh thoát):** `ĐẲNG CẤP HOÀNG GIA.` — Cỡ chữ thu nhỏ (~**70%** dòng trên), màu Vàng kim Hoàng gia (`#D4AF37`), độ giãn chữ `tracking-[0.18em]` vương quyền.
  - **Lớp Scrim kiến trúc:** Lớp phủ mờ chuyển sắc Xanh Lục Bảo (*Emerald Scrim Gradient*) đảm bảo chữ tương phản nổi bật 100% trên nền mọi bức ảnh villa.
- **Hai nút Kêu gọi Hành động (Hero CTAs):**
  - Nút 1 (Nền xanh lục bảo viền vàng kim `#D4AF37`): **"Khám Phá Bộ Sưu Tập Slab"** $\rightarrow$ Cuộn/chuyển tới danh mục đá.
  - Nút 2: **"Kết Nối Zalo Chuyên Viên VIP"** $\rightarrow$ Mở chat Zalo tư vấn công trình.

### KHỐI 3: Thống Kê Uy Tín Thương Hiệu (Brand Heritage KPI Bar)
- Bố cục 4 cột đối xứng trên nền xám kiến trúc nhạt (`#F5F5F7`) viền chỉ vàng:
  - Cột 1: **15+ Năm** — *Khai thác & Nhập khẩu đá khối nguyên tấm*
  - Cột 2: **500+ Dinh Thự** — *Công trình biệt thự, lâu đài đã hoàn thiện*
  - Cột 3: **100% Độc Bản** — *Mỗi lô đá có vân sắc và mã định danh duy nhất*
  - Cột 4: **3 Tổng Kho** — *Trữ lượng hàng chục ngàn mét vuông sẵn sàng giao*

### KHỐI 4: Bộ Sưu Tập Dòng Đá Quý Nổi Bật (Curated Stone Collections)
- **Tiêu đề khối:** *"CÁC DÒNG ĐÁ QUÝ ĐẶC TRƯNG TẠI QUEEN STONE"*
- **Lời dẫn:** *"Phân loại theo cấu trúc địa chất và công năng ứng dụng đỉnh cao"*
- **Lưới 4 thẻ đại diện (4-Column Card Grid):**
  - Thẻ 1: **Marble Cẩm Thạch Tự Nhiên (Ý & Hy Lạp)** — Vẻ đẹp kiêu sa, đường vân uyển chuyển cho sảnh lớn và vách tivi.
  - Thẻ 2: **Granite Tự Nhiên Cao Cấp (Brazil & Ấn Độ)** — Độ cứng kim cương, chịu nhiệt và chống trầy hoàn hảo cho bàn bếp và mặt tiền.
  - Thẻ 3: **Quartzite Thạch Anh Thượng Hạng** — Dòng đá quý hiếm kết tinh thạch anh lấp lánh, độ bền vĩnh cửu.
  - Thẻ 4: **Onyx Ngọc Xuyên Sáng Nghệ Thuật** — Khả năng thấu quang kỳ ảo, tạo điểm nhấn phong thủy đỉnh cao cho dinh thự.
  - *Mỗi thẻ gồm: Ảnh chụp đại diện sắc nét, Tên dòng đá, Nút "Khám phá dòng đá này" dẫn về bộ lọc tương ứng.*

### KHỐI 5: Tấm Slab Tiêu Biểu Mới Nhập Kho (Featured Slabs Showcase)
- **Tiêu đề khối:** *"CÁC LÔ ĐÁ ĐỘC BẢN VỪA CẬP CẢNG VỀ KHO"*
- **Ghi chú tính độc bản:** *"Lưu ý: Mỗi lô đá chỉ có số lượng tấm nhất định. Khi xuất hết kho sẽ không thể tái sản xuất."*
- **Lưới 4-6 sản phẩm nổi bật (Lấy dữ liệu thật từ CSDL):**
  - Ảnh toàn tấm slab chụp thẳng, tỷ lệ chuẩn.
  - Badge mã lô (Ví dụ: `MÃ LÔ: QS-CALA-01`).
  - Badge tồn kho thực tế: `Còn tồn: 8 tấm (~ 43.6 m²)`.
  - Tên đá: `Calacatta Borghini Extra`.
  - Xuất xứ: `Carrara, Ý`.
  - Nút bấm: **"Chi Tiết Tấm & Soi Vân"** $\rightarrow$ Dẫn sang `Spec_S03 (Trang Chi Tiết)`.

### KHỐI 6: Dự Án Kiến Trúc Tiêu Biểu (Signature Projects Spotlight)
- **Tiêu đề khối:** *"DẤU ẤN QUEEN STONE TRÊN NHỮNG CÔNG TRÌNH BIỂU TƯỢNG"*
- Trưng bày 3 công trình biệt thự / lâu đài thực tế với ảnh hoàn thiện lung linh.
- Gắn nhãn các mẫu đá Queen Stone đã ứng dụng tại công trình đó.
- Nút bấm: **"Xem Toàn Bộ Công Trình Đã Thi Công"** $\rightarrow$ Dẫn sang `Spec_S04`.

### KHỐI 7: Triết Lý Độc Bản & Tiêu Chuẩn Tuyển Chọn (Curation Philosophy)
- 3 bước tuyển chọn khắt khe của Queen Stone:
  1. *Tuyển chọn tại mỏ đá gốc:* Chuyên gia khảo sát trực tiếp vỉa đá tại Carrara (Ý), Vitoria (Brazil).
  2. *Cắt quy cách & Đánh bóng chuẩn Châu Âu:* Sử dụng lưỡi cắt kim cương và công nghệ chống thấm 6 mặt.
  3. *Lưu kho độc bản & Dẫn khách xem trực tiếp:* Mỗi tấm đá được đánh mã lô riêng, sẵn sàng xe cẩu lật tấm cho khách kiểm tra.

### KHỐI 8: Chân Trang Hoàng Gia (Royal Footer)
- Logo Vương miện Queen Stone mạ vàng, thông tin công ty, địa chỉ các tổng kho và showroom.
- Giờ đón tiếp khách VIP: 08:00 - 18:30 (Thứ 2 - Chủ Nhật).
- Kênh tư vấn nhanh: Số hotline, Zalo Official Account, bản quyền thuộc về Queen Stone 2026.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Header có Logo Vương miện mạ vàng, Menu 4 liên kết, Hotline VIP, Nút Zalo.
- Hero Banner hoành tráng phong cách Bright Architectural Gallery với tiêu đề Serif sang trọng.
- 4 chỉ số KPI uy tín thương hiệu.
- Lưới 4 dòng đá chính (Marble, Granite, Quartzite, Onyx).
- Lưới sản phẩm tiêu biểu có Mã lô và số lượng tồn $m^2$ thực tế.
- Khối công trình mẫu gắn tag đá.
- Footer đầy đủ địa chỉ showroom và hotline.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM vẽ Giỏ hàng (Shopping Cart) hoặc Icon xe đẩy mua sắm.**
- ❌ **CẤM vẽ Báo giá tiền mặt tự động (Ví dụ: "Giá: 2.500.000 đ/m²").**
- ❌ **CẤM vẽ Form thanh toán trực tuyến, cổng Visa, Momo, VNPay.**
- ❌ **CẤM vẽ Nút "Mua ngay" hoặc ô chọn số lượng đại trà.**
- ❌ **CẤM phong cách giao diện thương mại điện tử rẻ tiền (Flash sale, đếm ngược, giảm giá đỏ lòe).**

---

## 4. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Kho chưa có sản phẩm tiêu biểu nào):** Hiển thị khối 4 dòng đá chủ lực và banner mời khách liên hệ hotline tới xem trực tiếp tại tổng kho bãi.
- [x] **Góc 2 (Ảnh Hero load chậm):** Dùng CSS background màu xám cẩm thạch nhạt sang trọng làm nền móng trong lúc nạp ảnh độ nét cao.
- [x] **Góc 3 (Hiển thị responsive trên điện thoại):** Menu tự thu vào nút Hamburger mạ vàng thanh lịch; các lưới 4 cột tự động chuyển thành 1-2 cột mượt mà.
- [x] **Góc 4 (Mã lô hết hàng hiển thị trên Home):** Tự động lọc chỉ hiển thị các lô đá có `so_tam_ton > 0` trên khối tiêu biểu Trang chủ.
- [x] **Góc 5 (Click Zalo từ Trang chủ):** Tạo tin nhắn chào chung: *"Chào Queen Stone, tôi muốn được tư vấn các dòng đá tự nhiên cao cấp cho công trình của tôi."*

---

## 5. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
