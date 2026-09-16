# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S03_TrangChiTietDa_DocBan**  
*Tên màn hình:* **Trang Chi Tiết Sản Phẩm Đá Độc Bản (Exclusive Stone Detail Screen)**  
*Đường dẫn truy cập (URL):* `/da/:ma_lo` hoặc `product-detail.html?ma_lo=...`  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Đây là **màn hình trái tim** chuyển đổi khách hàng của toàn bộ trang web Queen Stone. Nơi Kiến trúc sư và Khách hàng VIP thẩm định sâu sắc giá trị thẩm mỹ và quy cách kỹ thuật của một lô đá tự nhiên cụ thể.
  - Cung cấp **Trình Trưng Bày 2 Góc Nhìn Tương Tác**:
    1. *Góc nhìn 1: Toàn Tấm Slab (Full Slab View)* — Thể hiện trọn vẹn bố cục vân đá từ góc rộng, mạch chạy của khoáng vật trên toàn bộ kích thước tấm đá thực tế.
    2. *Góc nhìn 2: Cận Cảnh Vân Đá (Macro Texture Zoom)* — Cho phép soi sâu từng tinh thể thạch anh, vết vân mây tự nhiên với kính lúp phóng to kỹ thuật số (Hover Magnifier).
  - Công bố minh bạch thông số kỹ thuật chuẩn kiến trúc và **số lượng tồn kho thực tế ($m^2$ và số tấm) tức thì**.
  - **Nút Hành Động Zalo Tư Vấn Thông Minh 1-Click:** Khi bấm nút, tự động mở ứng dụng Zalo đính kèm thông tin đầy đủ của lô đá đang xem để chuyên viên Queen Stone lập tức phản hồi và gửi video quay tấm slab thực tế tại bãi kho.
  - **Tuyệt đối không có giỏ hàng, nút thanh toán hoặc báo giá tự động:** Việc báo giá đá tự nhiên phụ thuộc vào bản vẽ bóc tách thi công, mạch ghép Bookmatch và xử lý chống thấm theo công trình.

- **Người dùng thao tác:**
  - Chuyển đổi qua lại giữa 2 góc nhìn (Ảnh toàn tấm slab và Ảnh cận cảnh vân đá).
  - Rê chuột soi kính lúp phóng đại từng chi tiết đường vân.
  - Đọc bảng thông số kỹ thuật (Dài, Rộng, Dày, Trọng lượng, Khả năng xuyên sáng).
  - Bấm nút Zalo để nhận tư vấn và video thực tế từ kho.
  - Xem các lô đá tương tự cùng dòng đang có sẵn tại kho.

- **Quy tắc nghiệp vụ bất biến:**
  - **Quy tắc 1 (Mỗi URL đại diện cho một lô đá duy nhất):** Mỗi trang chi tiết được định tuyến theo `ma_lo` duy nhất (Ví dụ: `/da/QS-CALA-08`). Nếu lô đá này đã được xuất kho bán hết (`so_tam_ton == 0`), trang vẫn giữ nguyên để phục vụ tra cứu lưu vết, nhưng toàn bộ huy hiệu chuyển sang "ĐÃ HẾT LÔ NÀY - LIÊN HỆ ĐẶT VỈA MỚI".
  - **Quy tắc 2 (Cấu trúc tin nhắn Zalo thông minh):** Nút Zalo tạo URL định dạng:
    `https://zalo.me/{so_hotline}?text={encoded_message}` chứa sẵn:  
    `"Kính chào Queen Stone, tôi đang quan tâm mẫu đá [Tên Đá] - Mã lô: [Mã Lô], Kích thước: [DxRxC] mm. Nhờ chuyên viên gửi video thực tế tại bãi kho và tư vấn dự toán thi công."`

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Header Hoàng Gia & Thanh Breadcrumb Đầy Đủ
- **Header chuẩn Queen Stone:** Logo Vương miện, Menu 4 trang, Hotline VIP, Nút Zalo.
- **Breadcrumb:** `Trang Chủ > Bộ Sưu Tập Đá Tự Nhiên > [Chủng Loại Đá - Ví dụ: Marble] > [Tên Mẫu Đá - Ví dụ: Calacatta Borghini Extra] (Mã Lô: QS-CALA-08)`.

### KHỐI 2: Khu Vực Trưng Bày Độc Bản 2 Cột Đối Xứng (Split Showcase Layout)
Bố cục 2 cột tỉ lệ vàng (Cột Trái 60% : Cột Phải 40% trên màn hình Desktop):

#### A. CỘT TRÁI: Trình Trưng Bày 2 Góc Nhìn Tương Tác (Dual-View Gallery)
- **Thanh chuyển đổi Tab 2 Chế Độ (View Switcher Tabs):**
  - Tab 1 (Active): **🖼️ [TOÀN TẤM SLAB (FULL SLAB)]** — Nhìn toàn cảnh tấm đá có khung tỷ lệ.
  - Tab 2: **🔍 [CẬN CẢNH VÂN ĐÁ (MACRO TEXTURE)]** — Nhìn sâu vào đường vân vi mô.
- **Khung Hiển Thị Ảnh Chính Siêu Nét:**
  - Ảnh phân giải cao, hiển thị trọn vẹn đúng tỷ lệ tấm slab thực tế.
  - **Tính năng Kính Lúp Soi Vân (Interactive Hover Magnifier):** Khi rê chuột lên ảnh, một khung kính lúp hình tròn/vuông nổi lên hiển thị độ phóng đại 2.5x để soi rõ từng mạch khoáng tự nhiên.
  - **Thước đo tỷ lệ kiến trúc (Dimension Scale Bar):** Hiển thị ở cạnh dưới ảnh (Ví dụ: `Chiều dài: 2,950 mm ──────────── Chiều rộng: 1,850 mm`).
  - **Nút xem toàn màn hình (Lightbox Button):** Icon mở rộng góc trên phải ảnh để xem ảnh full màn hình 4K.
- **Dải ảnh thu nhỏ bên dưới (Thumbnail Strip):**
  - Ảnh 1: Ảnh toàn tấm slab chụp đứng tại kho.
  - Ảnh 2: Ảnh góc nghiêng bề mặt bóng phản chiếu ánh sáng.
  - Ảnh 3: Ảnh cận cảnh đường vân chi tiết.
  - Ảnh 4: Ảnh phối cảnh mẫu ghép vân Bookmatch đối xứng 2 tấm.

#### B. CỘT PHẢI: Bảng Thông Số Quy Cách & Hành Động Chuyển Đổi (Spec & Action Panel)
- **Huy hiệu Mã Lô Độc Bản:** Badge mạ vàng nổi bật: `MÃ LÔ ĐỘC BẢN: QS-CALA-08`
- **Tên Thương Mại Mẫu Đá (H1 Serif sang trọng):** `Calacatta Borghini Extra`
- **Xuất Xứ Mỏ Đá:** `Mỏ Khai Thác Carrara, Vùng Tuscany, Cộng Hòa Ý 🇮🇹`
- **Chủng loại:** `Đá Cẩm Thạch Tự Nhiên (Natural Marble)`
- **Huy hiệu Tồn Kho Thực Tế Tức Thì:**
  - Trạng thái còn hàng: Khung viền ngọc bích `● Còn tồn thực tế trong kho: 8 tấm (~ 43.66 m²)`
  - Trạng thái hết hàng: Khung xám than `○ LÔ ĐÁ NÀY ĐÃ ĐƯỢC XUẤT HẾT CHO DỰ ÁN`
- **Bảng Thông Số Quy Cách Kỹ Thuật Chuẩn Kiến Trúc:**
  - Thiết kế dạng bảng lưới 2 cột thanh thoát, kẻ chỉ vàng nhạt:
    | Thông số kỹ thuật | Giá trị thực tế |
    |---|---|
    | **Chiều Dài Tấm Slab** | `2,950 mm` |
    | **Chiều Rộng Tấm Slab** | `1,850 mm` |
    | **Độ Dày Chuẩn** | `20 mm` (Dung sai ± 0.5 mm) |
    | **Bề Mặt Hoàn Thiện** | Đánh bóng gương (Polished) siêu mịn |
    | **Khả Năng Xuyên Sáng**| Thấu quang nhẹ ở dải vân ngọc |
    | **Khối Lượng Riêng** | `~ 2,710 kg/m³` |
    | **Ứng Dụng Khuyên Dùng**| Ốp vách đại sảnh thông tầng, Vách tivi Bookmatch, Bàn đảo biệt thự |
- **Hộp Cảnh Báo Tính Độc Bản Hoàng Gia (Authenticity Notice Box):**
  - Khung nền nhung xám viền vàng gold sang trọng:
    *"Lưu ý từ Chuyên gia Queen Stone: Mỗi vỉa đá tự nhiên là một kiệt tác độc bản của tạo hóa. Màu sắc và đường vân của lô đá này là duy nhất trên thế giới. Quý khách vui lòng liên hệ sớm để đặt cọc giữ lô trước khi xuất bán cho công trình khác."*
- **Khối Nút Bấm Hành Động Hoàng Gia (Call To Action):**
  - **Nút 1 (Nút Chính Lớn - Màu Vàng Gold Vương Giả):**  
    👑 **"KẾT NỐI ZALO — NHẬN VIDEO LÔ ĐÁ & TƯ VẤN DỰ TOÁN"**  
    *(Icon Zalo + hiệu ứng phát sáng nhẹ - Nhấp vào mở Zalo kèm payload mã lô ngay lập tức)*
  - **Nút 2 (Nút Phụ Viền Vàng):**  
    🏛️ **"Đặt Lịch Xem Tấm Trực Tiếp Tại Kho Đá"**  
    *(Mở hộp thoại hoặc dẫn link tới bản đồ kho gần nhất)*
  - **Hotline Kỹ sư trưởng vật liệu:** `Hotline 24/7: 0988.xxx.xxx (Kỹ sư Mike Lam)`

### KHỐI 3: Bài Bình Thẩm Mỹ & Thuyết Minh Kiến Trúc (Architectural Story)
- Tiêu đề: *"THẦN THÁI VƯƠNG GIẢ CỦA VỈA ĐÁ CALACATTA BORGHINI"*
- Bài viết phân tích nghệ thuật đường vân mây xám khói chạy vắt ngang nền cẩm thạch trắng sứ, cảm xúc sang trọng khi thi công đối xứng vân Bookmatch cho phòng khách biệt thự, phân tích phong thủy vượng khí của chất đá.

### KHỐI 4: Gợi Ý Các Lô Đá Cùng Dòng Đang Có Sẵn Tại Kho (Related Slabs)
- Tiêu đề: *"CÁC LÔ ĐÁ TƯƠNG TỰ ĐANG CÓ SẴN TẠI TỔNG KHO QUEEN STONE"*
- Lưới 3-4 thẻ sản phẩm cùng chủng loại (kèm ảnh slab, mã lô, số lượng tồn $m^2$ thực tế) để khách hàng có thêm sự lựa chọn so sánh.

### KHỐI 5: Chân Trang Hoàng Gia (Footer)
- Footer chuẩn Queen Stone.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Header Queen Stone & Breadcrumb đa cấp.
- Trình trưng bày 2 góc nhìn: Có 2 tab [Toàn Tấm Slab] và [Cận Cảnh Vân Đá], kính lúp Hover Zoom, thước đo kích thước dưới ảnh.
- Cột thông tin đầy đủ: Badge Mã lô độc bản, Tên đá, Xuất xứ mỏ đá, Bảng thông số kỹ thuật (Dài, Rộng, Dày, Mặt hoàn thiện, Ứng dụng), Số lượng tồn thực tế ($m^2$ và số tấm).
- Hộp cảnh báo tính độc bản hoàng gia.
- Nút CTA Zalo mạ vàng kích thước lớn: "KẾT NỐI ZALO — NHẬN VIDEO LÔ ĐÁ & TƯ VẤN DỰ TOÁN".
- Khối gợi ý các lô đá cùng dòng tại kho.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM vẽ Nút "Thêm vào giỏ hàng" (Add to Cart).**
- ❌ **CẤM vẽ Nút "Mua ngay" (Buy Now).**
- ❌ **CẤM vẽ Ô chọn số lượng sản phẩm mua lẻ (Quantity counter `[-] 1 [+]`).**
- ❌ **CẤM hiển thị bất kỳ con số giá tiền nào (VD: Cấm "3.500.000 đ/m²").**
- ❌ **CẤM vẽ Form đánh giá sao 5 sao / bình luận mua sắm của sàn TMĐT phổ thông.**

---

## 4. ĐẶC TẢ HAI TRẠNG THÁI GIAO DIỆN (DUAL-STATE UI SPECIFICATION)

### Trạng thái 1: Zero-State (Khi Mã lô truy cập không tồn tại hoặc bị xóa)
- **Hình minh họa:** Khung đá cẩm thạch có vết nứt cổ điển kèm logo Vương miện Queen Stone.
- **Tiêu đề:** *"Mã lô đá này không tồn tại trong hệ thống kho Queen Stone"*
- **Nội dung:** *"Mã lô Quý khách đang tìm kiếm có thể đã được đổi mã hoặc đường dẫn không chính xác. Quý khách vui lòng quay lại Bộ Sưu Tập để tra cứu danh mục mới nhất."*
- **Nút CTA:** **"Quay Lại Bộ Sưu Tập Đá"** + **"Liên Hệ Hotline Hỗ Trợ"**.

### Trạng thái 2: Active-State (Khi lô đá hiển thị bình thường)
- Hiển thị đầy đủ Khối 1 đến Khối 5 với dữ liệu thật từ CSDL kho.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Lô đá đã xuất hết về 0 tấm):** Hệ thống không ẩn trang. Thay vào đó, Badge tồn kho đổi thành màu xám "ĐÃ HẾT LÔ NÀY", nút Zalo chuyển thành "LIÊN HỆ ĐẶT VỈA ĐÁ TƯƠNG TỰ QUA ZALO".
- [x] **Góc 2 (Chuyển đổi mượt giữa 2 ảnh Slab và Vân):** Quá trình chuyển tab [Toàn Tấm] $\leftrightarrow$ [Cận Cảnh Vân] diễn ra êm ái qua CSS Transition mượt mà, không giật màn hình.
- [x] **Góc 3 (Kính lúp soi vân trên màn hình cảm ứng điện thoại):** Khi xem trên smartphone, thay vì hover chuột, cho phép chạm tay để phóng to ảnh hoặc nhấn nút mở Full-screen Lightbox để dùng 2 ngón tay thu phóng (Pinch-to-zoom).
- [x] **Góc 4 (Khách hàng mở nút Zalo từ máy tính Desktop):** Hệ thống tạo link Zalo thông minh mở Zalo Web hoặc Zalo PC App, nếu máy chưa cài Zalo sẽ hiển thị mã QR Code kèm số điện thoại để quét bằng điện thoại.
- [x] **Góc 5 (Payload Zalo chứa đầy đủ thông tin bóc tách):** Đảm bảo tin nhắn tự động điền sẵn chính xác: Tên đá, Mã lô, Kích thước thực tế để chuyên viên trực Zalo không cần hỏi lại khách hàng đang xem tấm nào.

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
