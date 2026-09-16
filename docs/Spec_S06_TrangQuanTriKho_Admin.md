# ĐẶC TẢ CHI TIẾT TRANG (PAGE SPECIFICATION)
*Mã trang:* **Spec_S06_TrangQuanTriKho_Admin**  
*Tên màn hình:* **Trang Bảng Điều Khiển Quản Trị Kho Thực Tế (Realtime Inventory Admin Screen)**  
*Đường dẫn truy cập (URL):* `/admin` hoặc `admin.html` (Bảo mật bằng Mã PIN Quản Trị)  
*Dự án:* 03. LAB 03 - Web ban Da Tu Nhien  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Cộng sự Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái:* `[SPEC_LOCKED]` *(Đã được Anh Mike phê duyệt ngày 2026-09-08)*  
*Tham chiếu Requirement:* [REQUIREMENTS.md §2, §3](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md)

---

## 1. MỤC TIÊU & NGHIỆP VỤ CỐT LÕI (OBJECTIVES & BUSINESS LOGIC)

- **Mục đích của Màn hình:**
  - Đây là trung tâm điều hành kho thực tế dành cho Thủ kho và Quản lý Queen Stone, giải quyết triệt để bài toán: **Đồng bộ tồn kho tức thì giữa bãi cẩu đá ngoài thực địa và mặt tiền Showroom trực tuyến ngoài Web**.
  - **Nghiệp vụ cốt lõi:**
    1. *Bảo mật truy cập:* Yêu cầu nhập Mã PIN quản trị (Admin Security PIN) trước khi hiển thị dữ liệu kho.
    2. *Thống kê trữ lượng kho (KPI Bar):* Theo dõi tổng số lô đá, tổng diện tích tồn thực tế ($m^2$), số lô còn hàng và số lô đã bán hết.
    3. *Nghiệp vụ Xuất kho / Trừ tồn nhanh (Quick Deduct):* Khi xe cẩu bốc đá giao cho công trình, thủ kho chọn lô đá, nhập số lượng tấm xuất và tên công trình $\rightarrow$ Bấm xác nhận.
    4. **Đồng Bộ Tức Thì (Instant Realtime Synchronization):** Lệnh xuất kho thực thi một Giao dịch ACID trong CSDL SQLite (chế độ WAL). Số lượng tấm tồn và diện tích $m^2$ được trừ ngay lập tức và **phản ánh ra API / Web mặt tiền ngay tức khắc**. Khách hàng hoặc nhân viên tư vấn đang xem ngoài Web sẽ thấy số tồn mới ngay lập tức mà không cần khởi động lại máy chủ.
    5. *Tự động đánh dấu HẾT LÔ:* Khi số tấm tồn giảm về 0, hệ thống tự động đổi cờ trạng thái thành `HET_HANG`. Trang chi tiết sản phẩm ngoài Web tự động đổi huy hiệu sang "ĐÃ HẾT LÔ".
    6. *Nhật ký Lưu vết (Audit History Log):* Ghi lại chi tiết mọi lần xuất hàng (Thời gian, Mã lô, Số tấm, Diện tích $m^2$, Công trình nhận, Người xuất) để đối soát cuối tháng.
    7. *Thêm mới / Chỉnh sửa lô đá:* Nhập thông số lô đá mới nhập khẩu về kho (Mã lô độc bản `UNIQUE`, Tên đá, Chủng loại, Kích thước, Ảnh slab, Ảnh vân).

- **Người dùng thao tác:**
  - Thủ kho thực hiện thao tác xuất kho khi bốc hàng lên xe.
  - Quản trị viên nhập lô đá mới cập cảng về kho.
  - Anh Mike (Kiến trúc sư trưởng) kiểm tra trữ lượng và lịch sử xuất hàng.

- **Quy tắc nghiệp vụ bất biến:**
  - **Quy tắc 1 (Chặn xuất vượt tồn):** Tuyệt đối cấm xuất số lượng lớn hơn số lượng tồn hiện có trong kho (`so_tam_xuat <= so_tam_ton`). Chặn ngay tại form nhập và chặn tại tầng backend API.
  - **Quy tắc 2 (Giao dịch toàn vẹn ACID):** Trừ số tồn và ghi nhật ký xuất kho phải diễn ra đồng thời trong 1 Transaction. Nếu ghi nhật ký lỗi $\rightarrow$ Tự động hoàn tác (Rollback) lệnh trừ kho.
  - **Quy tắc 3 (Mã lô là duy nhất):** Trường `ma_lo` bắt buộc không được trùng lặp trong toàn bộ hệ thống.

---

## 2. BỐ CỤC KHỐI CHI TIẾT TỪ TRÊN XUỐNG DƯỚI (SECTION-BY-SECTION UI BREAKDOWN)

> 💡 *Đây là căn cứ trực quan (Positive Blueprint) để chuyển giao cho Stitch MCP dựng UI ở Chặng 4.*

### KHỐI 1: Màn Hình Khóa Bảo Mật Mã PIN (Security Lock Screen)
- Xuất hiện khi người dùng chưa đăng nhập quản trị:
  - Khung khóa bảo mật sang trọng viền vàng giữa màn hình nền tối nhã nhặn.
  - Logo Vương miện Queen Stone.
  - Tiêu đề: *"TRUNG TÂM QUẢN TRỊ KHO ĐỘC BẢN QUEEN STONE"*.
  - Ô nhập liệu: Ô nhập **Mã PIN Quản Trị** (Ẩn ký tự `••••••`).
  - Nút bấm: **"Mở Khóa Bảng Quản Trị"**.
  - Cơ chế bảo vệ: Báo lỗi nếu sai mã PIN; khóa tạm 30 giây nếu nhập sai quá 5 lần.

### KHỐI 2: Admin Top Header & Thanh Trạng Thái Hệ Thống
- **Bên trái:** Logo Queen Stone Admin + Dòng chữ: `HỆ THỐNG ĐIỀU HÀNH KHO THỰC TẾ (REALTIME INVENTORY)`.
- **Bên phải:**
  - Chỉ báo kết nối CSDL: Đèn xanh nhấp nháy `● SQLite WAL: Hoạt Động Ổn Định`.
  - Đồng hồ thời gian thực: Hiển thị ngày giờ hệ thống `YYYY-MM-DD HH:mm:ss`.
  - Tên thủ kho đang trực: `Thủ Kho: Nguyễn Văn Long (Kho Miền Bắc)`.
  - Nút liên kết: **"Xem Mặt Tiền Web (Showroom)"** (Mở tab mới).
  - Nút bấm: **"Đăng Xuất"**.

### KHỐI 3: Thanh Thống Kê Tổng Quan Trữ Lượng Kho (KPI Summary Cards)
Bố cục 4 thẻ chỉ số nổi bật trên đỉnh trang:
- **Card 1 (Tổng Lô Đá):**  
  Số lượng: `24 Lô Đá` — *Tổng số vỉa đá tự nhiên đang quản lý* (Icon khối đá viền vàng).
- **Card 2 (Tổng Diện Tích Tồn Thực Tế):**  
  Số lượng: `1,248.60 m²` — *Trữ lượng khả dụng sẵn sàng xuất cho công trình* (Icon thước đo).
- **Card 3 (Số Lô Còn Hàng):**  
  Số lượng: `21 Lô` — *Đang sẵn sàng giao ngay* (Icon tích xanh ngọc).
- **Card 4 (Số Lô Đã Hết Hàng):**  
  Số lượng: `3 Lô` — *Đã xuất hết 100% cho dự án* (Icon cảnh báo xám chì).

### KHỐI 4: Thanh Công Cụ & Thao Tác Nhanh (Action Toolbar)
- **Bên trái:**
  - Ô tìm kiếm nhanh: Nhập mã lô (`QS-...`) hoặc tên mẫu đá $\rightarrow$ Bảng tự động lọc kết quả tức thì.
  - Nút lọc trạng thái: `[Tất Cả]` | `[Đang Còn Hàng]` | `[Sắp Hết (< 3 tấm)]` | `[Đã Hết Lô]`.
- **Bên phải:**
  - Nút chính nổi bật (Màu vàng Gold): **"[+ Nhập Lô Đá Mới Về Kho]"** (Mở Modal thêm mới).
  - Nút chuyển tab: **"[Xem Lịch Sử Xuất Kho (Audit Log)]"**.

### KHỐI 5: Bảng Dữ Liệu Quản Trị Lô Đá (Realtime Inventory Data Table)
Bảng dữ liệu chuẩn mực, kẻ viền thanh lịch, gồm các cột:
1. **Ảnh:** Ảnh slab nhỏ (Thumbnail 60x40px, nhấp vào phóng to).
2. **Mã Lô:** Badge vàng viền sắc sảo (Ví dụ: `QS-CALA-01`).
3. **Tên Đá & Xuất Xứ:** Tên thương mại (`Calacatta Borghini Extra`) + Mỏ khai thác (`Ý`).
4. **Chủng Loại:** `Marble` / `Granite` / `Quartzite` / `Onyx`.
5. **Quy Cách (DxRxD):** `2,950 x 1,850 x 20 mm`.
6. **Số Tấm Tồn:** Hiển thị con số lớn in đậm (Ví dụ: **8 tấm**).
7. **Diện Tích Tồn ($m^2$):** Tính tự động (Ví dụ: **43.66 m²**).
8. **Trạng Thái:** Pill xanh `Còn hàng` hoặc Pill xám `Đã hết lô`.
9. **Cột Thao Tác (Action Buttons):**
   - **Nút 1 (Chính - Màu Vàng Đồng):** **"[Xuất Kho]"** $\rightarrow$ Mở ngay Modal Xuất Kho Nhanh.
   - **Nút 2:** **"[Sửa]"** $\rightarrow$ Mở Modal chỉnh sửa quy cách/ảnh.
   - **Nút 3:** **"[Xem Web]"** $\rightarrow$ Nhảy thẳng ra trang chi tiết ngoài Web để xem hiển thị thực tế.

### KHỐI 6: Modal Popup Nghiệp Vụ Xuất Kho Nhanh (Quick Deduct Modal)
Khi thủ kho bấm nút **"[Xuất Kho]"** tại bất kỳ dòng nào, Modal nổi lên chính giữa màn hình:
- **Tiêu đề Modal:** `"XUẤT KHO LÔ ĐÁ: [MÃ LÔ] - [TÊN ĐÁ]"`
- **Thông tin tham chiếu:**
  - Kích thước 1 tấm: `[Dài] x [Rộng] mm` (Diện tích 1 tấm = `[X] m²`).
  - Số tấm tồn khả dụng hiện tại: **`[Y] tấm`** (Tương đương `[Z] m²`).
- **Các ô nhập liệu bắt buộc:**
  1. **Số tấm cần xuất (Số nguyên):**
     - Mặc định là `1`.
     - Giới hạn: Phải $\ge 1$ và $\le [Y]$ (số tấm tồn).
     - *Tính toán tự động theo thời gian thực:* Khi gõ số tấm, hệ thống lập tức tính ra:  
       `Diện tích xuất: [A] m² | Số tấm còn lại sau khi xuất: [B] tấm ([C] m²)`.
  2. **Tên Công Trình / Khách Hàng Nhận Đá (Bắt buộc):**  
     - Ví dụ: `Dinh thự Anh Tuấn - Ecopark Hưng Yên`.
  3. **Người thực hiện xuất kho (Bắt buộc):**  
     - Mặc định lấy theo tên thủ kho đang đăng nhập.
  4. **Ghi chú xuất bãi (Tùy chọn):**  
     - Ví dụ: `Xe cẩu biển số 29C-123.45 bốc chuyến 1, nguyên kiện`.
- **Thanh nút bấm hành động:**
  - Nút Hủy: `[Đóng]`
  - Nút Xác nhận (Vàng Gold, Debounce 1.5s):  
    ⚡ **"[XÁC NHẬN XUẤT KHO & ĐỒNG BỘ TỨC THÌ]"**
  - *Hành vi sau khi bấm:* Gửi API `POST /api/kho/xuat-kho`, hiển thị hiệu ứng xoay spinner nhẹ, cập nhật CSDL SQLite trong 50ms, đóng modal, phát chuông báo thành công, cập nhật ngay con số mới trên bảng và đẩy dữ liệu ra mặt tiền Web!

### KHỐI 7: Tab Nhật Ký Lịch Sử Xuất Kho (Audit History Log Table)
- Khi bấm tab "Xem Lịch Sử Xuất Kho":
  - Bảng hiển thị thứ tự thời gian từ mới nhất đến cũ nhất:
    | Thời Gian Xuất | Mã Lô | Tên Mẫu Đá | Số Tấm Xuất | Diện Tích ($m^2$) | Tên Công Trình Nhận | Thủ Kho Xuất | Ghi Chú |
    |---|---|---|---|---|---|---|---|
    | 2026-09-08 09:15 | `QS-CALA-01` | Calacatta Extra | **2 tấm** | 10.92 m² | Biệt thự Vườn Cam | Nguyễn Văn Long | Chuyến sáng |
    | 2026-09-07 16:30 | `QS-PATA-02` | Patagonia Prime | **1 tấm** | 5.20 m² | Penthouse Lotte | Trần Hữu Nam | Giao mặt bàn |

### KHỐI 8: Modal Popup Thêm Mới Lô Đá (Add New Stone Lot Modal)
- Biểu mẫu nhập liệu chuẩn chỉnh:
  - Mã lô (VD: `QS-MB-009` - Chặn trùng lặp).
  - Tên mẫu đá (VD: `Onyx Tiger Gold`).
  - Chủng loại (Dropdown: Marble, Granite, Quartzite, Onyx).
  - Xuất xứ mỏ (VD: `Ý`, `Brazil`, `Tây Ban Nha`).
  - Tông màu chủ đạo & Ứng dụng khuyên dùng.
  - Kích thước quy cách: Dài (mm), Rộng (mm), Độ dày (mm).
  - Số lượng tấm nhập ban đầu.
  - Đường dẫn ảnh Slab toàn tấm & Đường dẫn ảnh Vân cận cảnh.
  - Mô tả ngắn gọn vỉa đá.
  - Nút bấm: **"[Lưu Lô Đá Mới Vào Kho]"**.

---

## 3. RANH GIỚI BẮT BUỘC CHO STITCH MCP (STITCH MCP BOUNDARIES)

### A. Positive Blueprint (Bắt buộc phải vẽ):
- Màn hình khóa PIN bảo mật.
- Header Admin chuyên nghiệp có đồng hồ thời gian và trạng thái CSDL.
- 4 Card KPI thống kê tồn kho rõ ràng.
- Bảng dữ liệu quản trị đầy đủ cột Mã lô, Kích thước, Số tấm tồn, Diện tích $m^2$, Trạng thái và Nút Xuất kho.
- Modal Xuất kho nhanh có tính toán tự động số $m^2$ và ô nhập tên công trình.
- Tab Lịch sử xuất kho (Audit Log).
- Modal Thêm mới lô đá.

### B. Negative Constraints (TUYỆT ĐỐI CẤM VẼ THỪA):
- ❌ **CẤM vẽ các tính năng thương mại bán lẻ (Giỏ hàng, cổng thanh toán khách hàng).**
- ❌ **CẤM cho phép nhập số lượng xuất là số âm hoặc lớn hơn số tồn hiện có.**
- ❌ **CẤM thiết kế kiểu giao diện rườm rà; phải tối ưu thao tác nhanh trong vòng 3 cú nhấp chuột cho thủ kho đang làm việc ngoài bãi.**

---

## 4. ĐẶC TẢ HAI TRẠNG THÁI GIAO DIỆN (DUAL-STATE UI SPECIFICATION)

### Trạng thái 1: Zero-State (Khi kho chưa có lô đá nào)
- Hiển thị bảng trống kèm thông báo: *"Kho đá hiện đang trống. Hãy nhấn nút 'Nhập Lô Đá Mới' hoặc bấm 'Nạp Dữ Liệu Hạt Giống 10 Lô Đá Mẫu' để bắt đầu thử nghiệm hệ thống."*

### Trạng thái 2: Active-State (Khi kho có dữ liệu hoạt động)
- Hiển thị đầy đủ bảng dữ liệu, các thẻ KPI và sẵn sàng cho thao tác xuất kho tức thì.

---

## 5. BỘ LỌC 10 GÓC KHUẤT BIÊN (RELEVANT EDGE CASES)

- [x] **Góc 1 (Xuất vượt quá số lượng tồn trong kho):** Khi thủ kho nhập số tấm xuất $> so\_tam\_ton$, ô nhập liệu lập tức viền đỏ, nút xác nhận bị vô hiệu hóa kèm cảnh báo: *"Không thể xuất quá số lượng tồn kho khả dụng"*.
- [x] **Góc 2 (Chống bấm đúp nút xuất kho - Debounce):** Nút "Xác Nhận Xuất Kho" tự động khóa trong 1.5 giây sau khi bấm và hiện spinner xoay nhẹ để ngăn việc trừ tồn 2 lần cho cùng 1 chuyến xe.
- [x] **Góc 3 (Tranh chấp ghi đồng thời - Concurrency Control):** Nếu 2 thủ kho cùng mở một lô đá có 5 tấm và cùng lúc bấm xuất 4 tấm $\rightarrow$ Lệnh SQL sử dụng điều kiện `WHERE id = ? AND so_tam_ton >= ?`. Người bấm trước xuất thành công 4 tấm (còn 1 tấm), người bấm sau bị từ chối ngay vì kho chỉ còn 1 tấm.
- [x] **Góc 4 (Xuất hết sạch tấm về 0):** Hệ thống tự động chuyển cờ `trang_thai = 'HET_HANG'`, dòng sản phẩm trên bảng chuyển sang màu xám mờ và ngoài Web mặt tiền lập tức hiển thị nhãn "ĐÃ HẾT LÔ".
- [x] **Góc 5 (Thủ kho nhập nhầm mã PIN):** Khóa tạm thời 30 giây sau 5 lần nhập sai để chống tấn công brute-force dò mã PIN.
- [x] **Góc 6 (Bảo toàn dữ liệu khi mất điện đột ngột):** SQLite được cấu hình `PRAGMA synchronous = NORMAL;` và `journal_mode = WAL;`, đảm bảo mọi giao dịch đã xác nhận đều được ghi an toàn xuống đĩa cứng, không bao giờ bị hỏng file CSDL.

---

## 6. PHÊ DUYỆT CỦA KIẾN TRÚC SƯ TRƯỞNG
- [x] **Anh Mike đã duyệt bản Spec này ngày:** 2026-09-08
- [x] **Trạng thái:** `[SPEC_LOCKED]` → Sẵn sàng chuyển sang Chặng 3: Bản vẽ Kiến trúc Bình dân (SYSTEM_OVERVIEW.md).
