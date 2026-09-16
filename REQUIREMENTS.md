# BẢN YÊU CẦU DỰ ÁN TỔNG THỂ (PROJECT REQUIREMENTS BASELINE)
*Dự án: 03. LAB 03 - Web ban Da Tu Nhien*  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Tổng thầu Thi công Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[REQUIREMENTS_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*

---

## 1. MỤC TIÊU DỰ ÁN & BỐI CẢNH NGHIỆP VỤ (BUSINESS CONTEXT & GOALS)

- **Bài toán đặc thù ngành đá tự nhiên:**
  - Đá tự nhiên mang tính chất **độc bản tuyệt đối**: Mỗi lô đá (Lot/Block) được khai thác từ một vỉa núi tự nhiên khác nhau, vân đá và sắc độ màu sắc không bao giờ trùng lặp 100%. Số lượng theo từng lô là cố định, bán hết là hết vĩnh viễn không thể sản xuất lại hàng loạt.
  - Công tác tính toán giá thi công đá tự nhiên cực kỳ phức tạp (phụ thuộc vào bản vẽ bóc tách chi tiết, đường cắt quy cách, hao hụt mạch đá, phương pháp bo cạnh, chỉ phào, xử lý chống thấm và điều kiện thi công tại công trình). Do đó, **tuyệt đối không áp dụng tính giá tự động trên Web** để tránh sai lệch báo giá.
- **Mục tiêu cốt lõi của Web Queen Stone:**
  - **Showroom Triển lãm Trực tuyến:** Tôn vinh vẻ đẹp vương giả, kiến trúc độc bản của từng tấm slab đá tự nhiên.
  - **Chuyển đổi thông minh qua Zalo 1-Click:** Khi khách hàng quan tâm mẫu đá nào, chỉ cần bấm nút Zalo, hệ thống lập tức tự động kết nối trực tiếp đến nick Zalo của chuyên viên tư vấn, gửi kèm thông tin chính xác (Ảnh mẫu đá, Mã lô, Kích thước, Đường link sản phẩm) để tư vấn chuyên sâu 1-1.
  - **Quản trị Tồn kho Tức thì (Realtime Inventory):** Quản lý chặt chẽ từng mã lô đá, kích thước và diện tích tồn thực tế ($m^2$). Khi thủ kho xuất kho, Web tự động cập nhật giảm lượng tồn ngay lập tức để tránh tình trạng tư vấn lô đá đã bán.
- **Tầm nhìn dài hạn:** `Showroom Số Hóa → Quản trị Kho Độc Bản Thực Tế → Chăm Sóc Khách Hàng Chuyên Biệt`.
- **Đối tượng người dùng:**
  - *Khách hàng mục tiêu:* Chủ nhân biệt thự, lâu đài, căn hộ cao cấp, Kiến trúc sư, Nhà thiết kế nội thất, Tổng thầu thi công tìm kiếm vật liệu đá tự nhiên cao cấp.
  - *Bộ phận vận hành nội bộ:* Thủ kho / Nhân viên bán hàng Queen Stone quản lý cập nhật lượng tồn thực tế.

---

## 2. RANH GIỚI PHẠM VI (SCOPE BOUNDARY — BẮT BUỘC KHÓA CHẶT)
> ⚠️ **Quy tắc bất biến:** Em (AI) tuyệt đối không tự ý thêm bớt bất kỳ tính năng nào ngoài bảng này.

| Phân loại | Danh mục chức năng | Tiêu chí hoàn thành (Definition of Done) |
|---|---|---|
| **IN-SCOPE** *(Bắt buộc phải có)* | **1. Trang Chủ (Home Showcase):**<br>- Header phong cách Hoàng gia với logo Vương miện Queen Stone.<br>- Hero banner video/ảnh triển lãm kiến trúc đá Calacatta cẩm thạch.<br>- Bộ sưu tập các dòng đá nổi bật (Marble, Granite, Quartzite, Onyx xuyên sáng...).<br>- Lối vào nhanh các bộ sưu tập và công trình.<br><br>**2. Trang Danh mục Sản phẩm & Bộ lọc Thông minh:**<br>- Bộ lọc theo chủng loại đá, màu sắc chủ đạo, ứng dụng (ốp bếp, mặt tiền, cầu thang, sàn sảnh).<br>- Hiển thị thẻ sản phẩm gồm ảnh, tên mẫu, mã lô, tồn kho thực tế.<br><br>**3. Trang Chi tiết Sản phẩm Độc bản:**<br>- Ảnh tổng thể toàn tấm (Full Slab view).<br>- Ảnh cận cảnh chi tiết vân đá sắc nét (Close-up Texture view / Zoom).<br>- Thông số kỹ thuật: Mã lô (Lot No.), Kích thước (Dài x Rộng x Dày), Xuất xứ, Số lượng thực tế còn tồn ($m^2$ hoặc số tấm).<br>- Cảnh báo độc bản: "Mỗi lô đá tự nhiên có vân sắc độc nhất vô nhị. Hết hàng là hết lô".<br>- **Nút bấm Zalo Tư vấn Thông minh:** Click mở Zalo kèm theo mã lô, tên đá, thông số và hình ảnh mẫu đá khách đang xem.<br><br>**4. Trang Công trình Tiêu biểu (Showcase Projects):**<br>- Trưng bày các công trình thực tế đẳng cấp đã thi công đá Queen Stone (Biệt thự, Dinh thự, Khách sạn 5 sao...).<br>- Gắn thẻ (tag) các loại đá đã sử dụng trong từng công trình.<br><br>**5. Trang Liên hệ & Hệ thống Showroom:**<br>- Thông tin liên hệ, hotline, Zalo chính thức.<br>- Danh sách mạng lưới Showroom / Tổng kho đá tại các địa điểm.<br>- Bản đồ dẫn đường trực quan tới từng showroom/kho.<br><br>**6. Quản trị Kho Thực tế (Admin Inventory Manager):**<br>- Thêm/sửa sản phẩm đá (mã lô, quy cách, ảnh tổng thể, ảnh vân).<br>- Nghiệp vụ Xuất kho / Trừ tồn nhanh.<br>- Đồng bộ tức thì: Khi xuất kho, số tồn trên mặt tiền Web cập nhật tức thì (ngay lập tức). | - Giao diện chuẩn phong cách Bright Architectural Gallery & Hoàng gia sang trọng.<br>- Nút Zalo hoạt động chính xác kèm payload thông tin sản phẩm.<br>- Lượng tồn cập nhật tức thì không trễ.<br>- Vượt qua 100% kiểm định QA bằng máy. |
| **OUT-OF-SCOPE** *(Tuyệt đối cấm tự thêm)* | 1. Báo giá tự động / Bảng tính dự toán online (Đã loại bỏ theo yêu cầu của Anh Mike).<br>2. Form tiếp nhận phiếu hẹn tư vấn phức tạp (Đã tinh giản qua Zalo trực tiếp).<br>3. Cổng thanh toán trực tuyến (VNPay, MoMo, thẻ tín dụng).<br>4. Đăng nhập mạng xã hội (Google, Facebook Auth).<br>5. Mô hình 3D AR quét phòng ảo gây nặng tải. | - Giữ mã nguồn tinh gọn, thời gian tải trang dưới 1.5s, không rò rỉ bộ nhớ, tiết kiệm tối đa tài nguyên máy và token. |

---

## 3. DANH MỤC CÁC PHÂN HỆ DỰ KIẾN (MODULE BREAKDOWN)

- **Module S01 — `S01_ShowroomDanhMuc` (Trưng bày & Chi tiết Sản phẩm Độc bản):**
  - Trang chủ, Trang danh mục đá, Bộ lọc đa tiêu chí.
  - Trang chi tiết: Hiển thị 2 góc nhìn (Tổng thể tấm slab + Cận cảnh vân đá), thông số mã lô, tồn kho thực tế.
  - Cơ chế nút bấm Zalo: Tạo deep link `zalo.me/...` kèm text mẫu và link ảnh/sản phẩm trực tiếp.
- **Module S02 — `S02_CongTrinhVaHeThongShowroom` (Dự án Tiêu biểu & Mạng lưới Showroom):**
  - Trang giới thiệu các công trình kiến trúc đẳng cấp đã thi công đá Queen Stone.
  - Trang liên hệ tích hợp định vị bản đồ tới các showroom và tổng kho đá.
- **Module S03 — `S03_QuanTriTonKho` (Quản trị Tồn kho & Đồng bộ Tức thì):**
  - Giao diện quản trị cho thủ kho: Danh sách lô đá, trạng thái còn hàng/hết hàng.
  - Thao tác xuất kho/nhập kho: Cập nhật biến động số lượng, đồng bộ trực tiếp ra API mặt tiền Web.

---

## 4. TIÊU CHUẨN CÔNG NGHỆ & GU THẨM MỸ (TECH STACK & AESTHETICS)

1. **Nền tảng kỹ thuật (Tech Stack):**
   - Web Application: Node.js + Express API + HTML5 / CSS3 Vanilla hiện đại + SQLite (chế độ WAL mode).
   - Cơ chế chạy: Đóng gói khởi động 1 click bằng `Chay_Ung_Dung.bat`, phục vụ trên `http://localhost:3000` (sẵn sàng chuyển giao lên Web host).
   - Đóng gói phản hồi: 100% API qua chuẩn `ApiResult<T>` có thông điệp tiếng Việt.
2. **Gu Thẩm mỹ Thiết kế (Bright Architectural Gallery & Royal Luxury):**
   - **Màu sắc chủ đạo:**
     - Nền: Trắng cẩm thạch Calacatta / Off-white thanh thoát (`#F9F9FB`, `#FFFFFF`).
     - Tông tương phản: Xám kiến trúc cao cấp (`#1F2421`, `#2D3142`).
     - Tông điểm xuyết Hoàng gia: Vàng Gold vương quyền (`#C5A059`, `#D4AF37`).
   - **Biểu tượng:** Vương miện Hoàng gia (Crown Logo) tinh xảo cùng chữ Queen Stone.
   - **Kiểu chữ (Typography):** Serif cao cấp (Cormorant Garamond / Playfair Display) cho tiêu đề kiến trúc và Sans-serif thanh lịch cho thông số kỹ thuật.
   - **Hình ảnh:** Tỉ lệ ảnh chuẩn, độ phân giải cao, hiển thị rõ cả góc rộng nguyên tấm đá (slab) và vân đá vi mô (macro vein).

---

## 5. BIÊN BẢN PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG

- [x] **Anh Mike đã duyệt bản Requirement này ngày:** 2026-09-08
- [x] **Trạng thái:** `[REQUIREMENTS_LOCKED]` → Sẵn sàng chuyển sang Chặng 2: Bóc tách Spec chi tiết (Spec_S01, Spec_S02, Spec_S03).
