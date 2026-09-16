# HỒ SƠ THIẾT KẾ GIAO DIỆN STITCH MCP (SCREEN_SPECS_STITCH.md)
*Dự án: 03. LAB 03 - Web ban Da Tu Nhien*  
*Thương hiệu:* **Queen Stone** (Biểu tượng: Vương miện Hoàng gia)  
*Kiến trúc sư trưởng / Chủ dự án:* **Anh Mike (Mike Lam)**  
*Tổng thầu Thi công Kỹ thuật AI:* **Antigravity (Gemini)**  
*Trạng thái hồ sơ:* `[SCREEN_LOCKED]` *(Đã dựng hoàn tất 5 màn hình Stitch MCP)*  
*Mã dự án Stitch (Project ID):* `1311205433068026806`  
*Hệ thống thiết kế (Design System):* `assets/069c099b3e8044229603e356b2c90fa2` (Royal Gallery System)

---

## 1. THIẾT KẾ NỀN TẢNG (DESIGN SYSTEM FOUNDATION)

- **Phong cách thị giác:** `Bright Architectural Gallery & Royal Luxury` (Tối giản kiến trúc kết hợp vương quyền thanh thoát).
- **Màu sắc chủ đạo:**
  - `royal-gold`: `#C5A059` — Điểm xuyết vương quyền, viền tinh tế, nút bấm VIP, huy hiệu độc bản.
  - `deep-charcoal`: `#121212` — Tông chữ chủ đạo, thanh điều hướng quản trị kho, khối chân trang.
  - `gallery-white`: `#FDFDFD` & `surface`: `#FBF9F8` — Nền cẩm thạch trắng sáng Calacatta không gây chói mắt.
  - `stone-mist`: `#E5E5E1` — Đường viền mảnh 1px phân tách các khối kiến trúc.
- **Hệ phông chữ (Typography):**
  - Tiêu đề (Headlines): `Libre Caslon Text` / `Playfair Display` (Serif cổ điển quyền uy, sang trọng).
  - Nội dung & Thẻ kỹ thuật (Body & Technical Data): `Hanken Grotesk` / `Plus Jakarta Sans` & `JetBrains Mono` cho mã lô, quy cách $m^2$.
- **Hình khối (Shape):** `Sharp (0px - 4px)` mô phỏng đường cắt vuông vức tinh xảo của các phiến đá tự nhiên nguyên tấm (slab).

---

## 2. DANH MỤC CÁC MÀN HÌNH ĐÃ DỰNG TRÊN STITCH MCP

| STT | Tên màn hình | Screen ID trên Stitch | Độ phân giải | Chức năng nghiệp vụ & Điểm nhấn UX/UI |
|---|---|---|---|---|
| **S01a** | **Showroom Gallery (Imperial Emerald Green - Desktop)** | `c5869271f76c4378985a8ccd1db81bec` | 2560 x 5300 | Header Hoàng gia; **Hero Slider ảnh động gồm 5 bức ảnh biệt thự xa hoa** đại diện cho 5 khu vực tiêu biểu (Đại sảnh, Vách phòng khách, Đảo bếp Onyx, Cầu thang xoắn, Master Spa Suite); Chuyển động xoay vòng **1 chiều duy nhất từ PHẢI sang TRÁI** (Ảnh 1 ➔ 5 ➔ 1 vô tận, khắc phục triệt để lỗi đảo chiều ở ảnh 5 bằng Seamless Clone Buffer), chu kỳ **2.0s / lần chuyển**; 5 vạch tiến trình nạp nhịp 2.0s; Phân cấp Slogan mỹ thuật "Tuyệt tác đá tự nhiên," (lớn) + "Đẳng cấp hoàng gia." (nhỏ hơn, vàng kim); Bộ lọc đá đa chiều & Lưới thẻ slab. |
| **S01b** | **Slab Inspection (Chi Tiết Slab & Soi Vân)** | `d2e485b1285242b4bb4fef7f43e35fa9` | 2560 x 4304 | Bố cục đối xứng song song: 1 bên ảnh toàn tấm (Full Slab) + 1 bên zoom cận cảnh vân đá vi mô (Macro Vein); Bảng thông số kỹ thuật; Cam kết độc bản; **Nút bấm Zalo VIP 1-Click**. |
| **S02** | **Architectural Lookbook (Công Trình Thực Tế)** | `2d12a778527b4575bbed3144faee9a4e` | 2560 x 10500 | Không gian nội thất dinh thự, biệt thự, penthouse; Các điểm ghim tương tác (Pin Badges) định danh chính xác lô đá đã thi công; Banner tư vấn thiết kế mẫu đá tương tự qua Zalo. |
| **S03** | **Nationwide Depot Network (Tổng Kho & Showroom)** | `b2cd339bc4e4473098bf68419b5e9f39` | 2560 x 8066 | Hệ thống 4 tổng kho chiến lược (HN, ĐN, TP.HCM, Cần Thơ); Thông số cẩu trục chuyên dụng 10 tấn, máy quét 3D; Bản đồ định vị và form đăng ký xem đá trực tiếp tại kho. |
| **S04** | **Warehouse Management Portal (Quản Trị Kho)** | `7bec4ff199294c9abbc85812a0f91168` | 2560 x 3068 | Thanh điều hành bảo mật; 4 thẻ chỉ số tồn kho; Bảng danh mục lô đá; **Khung xuất kho trừ tồn bảo vệ bằng mã PIN 4 số**; Cảnh báo đồng bộ tức thì ra mặt tiền Web; Nhật ký giao dịch Audit Log. |
| **S01_Mob** | **Mobile Showroom (Imperial Emerald Green - Di Động)** | `73e75f55cdbe4ecba3ed3f094fd5618a` | 780 x 4818 | Tone màu Xanh Lục Bảo; Hero Slider 5 khu vực biệt thự trượt 1 chiều duy nhất từ Phải sang Trái 2.0s (1 ➔ 5 ➔ 1 xoay vòng vô tận, không đảo chiều); Phân cấp kích thước slogan nghệ thuật không rớt dòng; Tương phản siêu nét; **Thanh đáy Sticky Bottom Bar nút Zalo 1-Click**. |

---

## 3. CHI TIẾT TỪNG MÀN HÌNH & ẢNH CHỤP GIAO DIỆN (SCREENSHOTS)

### Màn hình S01a: Queen Stone - Imperial Emerald Green Showroom (Trang Chủ Xanh Lục Bảo Mỹ Thuật & Hero Slider Động)
- **ID:** `c5869271f76c4378985a8ccd1db81bec`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1U6XREz3WaSCPWuQLcYcZeuu1eDiHUerLWcGnnAcon3GebXkJ8ELXOLXNJwaiR8O9XcczVP9VYvYLlzhEakEgSU2NvLW-NOwb5X8papBSSblR_XX-j6NspUOGx7MeDHwG8ZSgMPTssUqkU2FYaHiMDb1uiDGSsJu5awrIzMbKi7HtjuMAU9pzSct0C_BnK8xrzqdHjmlu9z-NVhKWur_Ni09fZvdHo6f8Hfnb6KiSljzEbco74S2dAtt3Y)
- **Điểm nhấn thiết kế theo chỉ đạo của Anh Mike:**
  - **Hero Slider ảnh động 5 khu vực biệt thự xa hoa:**
    1. *Zone 1 — Đại Sảnh Thông Tầng Hoàng Gia:* Cột cẩm thạch Xanh Lục Bảo Verde Alpi & sàn Statuario bóng gương.
    2. *Zone 2 — Vách Thông Tầng Phòng Khách:* Đá Thạch Anh Patagonia đối vân cao 7m.
    3. *Zone 3 — Đảo Bếp & Quầy Bar Hoàng Gia:* Mặt đá Onyx xuyên sáng quý tộc.
    4. *Zone 4 — Đại Cầu Thang Xoắn Ốc Dinh Thự:* Bậc đá cẩm thạch trắng nguyên khối uốn lượn.
    5. *Zone 5 — Phòng Tắm Master Suite Spa:* Đá Arabescato Corchia vân mây xa hoa.
  - **Chuyển động 1 chiều duy nhất từ Phải sang Trái (*Strictly Unidirectional Right-to-Left*):**
    - Chu kỳ **2.0 giây / 1 lần chuyển** (*2000ms*).
    - Xoay vòng liên tục vô tận: `Ảnh 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ 1 ➔ 2...` hoàn toàn liền mạch không giật lùi, không đảo chiều tại ảnh 5 nhờ thuật toán Seamless Clone Buffer (`[Clone 5, 1, 2, 3, 4, 5, Clone 1]`).
    - 5 thanh tiến trình nạp đầy liên tục thể hiện khu vực đang trình chiếu.
  - **Phân cấp Slogan đậm chất nghệ thuật:**
    - Dòng 1: `Tuyệt tác đá tự nhiên,` — Khổ chữ lớn, nét thanh nét đậm uyển chuyển bằng phông Libre Caslon Text màu Trắng tuyết (`#FFFFFF`).
    - Dòng 2: `Đẳng cấp hoàng gia.` — Khổ chữ nhỏ hơn tinh tế (~70%), phối màu Vàng kim Royal Gold (`#D4AF37`) với độ giãn chữ (tracking) quý phái.
  - **Lớp phủ Scrim Emerald tương phản cao:** Tôn vinh vẻ đẹp chữ đọc rõ ràng trên mọi góc nhìn.

### Màn hình S01b: Queen Stone - Slab Inspection
- **ID:** `d2e485b1285242b4bb4fef7f43e35fa9`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1UQVq4rqVVnPXc4P7cPB7jzLPsIaUzTHJvzzwlKS9y9jlaB-ngg1v9PLPfQ7eXwkFz51Hwkxna26P3kFLHIK3T63BzxY6M92Pw_F-8iz-9ldnLdhKySIKZfnr2RjI2R0H9dwjFpIEWcsOHR-kBrUTsHDbXx2_kglpNKqzTVZGOxSpnZLw7jQZsvh_2FPkgCEHC_NnFpV6akZeNWe9lNMwRw5OAu2DOFCzkQVLnd31E3QYt5lev-oCv1FA)
- **Điểm nhấn thiết kế:**
  - Trải nghiệm soi vân đá siêu nét: So sánh trực tiếp giữa góc rộng tấm slab nguyên khối và cận cảnh đường vân tự nhiên.
  - Khối thông số kỹ thuật chuẩn công nghiệp kiến trúc: Kích thước, độ dày, bề mặt hoàn thiện, kho lưu trữ thực tế.
  - Nút bấm Zalo 1-Click nổi bật, kích hoạt kịch bản gửi ảnh và mã lô sang chuyên viên tư vấn.

### Màn hình S02: Queen Stone - Architectural Lookbook
- **ID:** `2d12a778527b4575bbed3144faee9a4e`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1UoqDFRIvD-iypYvfFNkKzyZ9DREceoQGaXx_TYWpGDOzCg1JsOLVLoqoE6nHjgDsSg1A5WXIPGpOAXZJD7U9jIdvcPyUfR_x5c2kEwTwk7Ryp-_CvmI3rJeA439ZE5kswuoNCcPcZBcP754FynCoT7hjPEckfrDShcm523746DyctQQG1EwNAKmwxUJVCz9Qq1JrzJdrxK4PWTv7rm07hLS5x9vMm6mhBlrWB8MLsY6a2x_yriJVaMQw)
- **Điểm nhấn thiết kế:**
  - Tạp chí kiến trúc sống động với các công trình thực tế (Dinh thự Thảo Điền, Penthouse Grand Marina Ba Son).
  - Tương tác thông minh: Bấm vào từng điểm ghim (pin) trên hình ảnh để biết chính xác mẫu đá và mã lô sử dụng.
  - Kết nối trực tiếp: Nút Zalo tư vấn áp dụng mẫu đá tương tự cho công trình của khách hàng.

### Màn hình S03: Queen Stone - Nationwide Depot Network
- **ID:** `b2cd339bc4e4473098bf68419b5e9f39`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1W6kCaRUKema9inmnC7RB-Gin4gVphU9FC14ypCvjb8g-8c9GayIWyPO-xr1Pa21ZdcSUbiIoMCx6T-OVG5GGz0uXweJSRxnF_aidDogNrmM5xwPg4Eu4Y0khmq-0sJFoZ-F4a2K8Qy-fdVt-lc9rJjH3IlUmZIPv_n2tZJkdwF1G_e_o52IX0OWL3mn2FxQ19dO3xqTqudbTtTrNEzfp8qROIiNQbhja88wJwLmZpq8_0tcHhQEC-IBg)
- **Điểm nhấn thiết kế:**
  - Hệ thống 4 đại tổng kho và showroom trên toàn quốc với đầy đủ thông số năng lực bốc dỡ, diện tích và hotline trưởng kho.
  - Khẳng định uy tín nhà phân phối đá tự nhiên hàng đầu với thiết bị cẩu trục 10 tấn chuyên dụng và máy quét 3D.
  - Tính năng chỉ đường Google Maps 1-Click và form đăng ký xe đưa đón tham quan kho đá thực tế.

### Màn hình S04: Queen Stone - Warehouse Management Portal
- **ID:** `7bec4ff199294c9abbc85812a0f91168`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1VVgEPgZX7gJRyexaepaM01x2wvVKnNuN1PDFCLzBh6LhD3Vnxd7LLGIQyzRWv6NYw0CpFlHU9oczMYUkRgRWzWCGEILJSTfTUSgrceDyYzlqKWxT316NCimOp0nKYVtCZLCwxyYYSDLxQXOY7CwK0QFclsfsbO2-s77JHh07pUmu7rZNULxkFP8Lru08BbS4ylnqq4vd41bKDAOKijvaVfVeBhvLS46-HUbl2s7aUKzUeWHxwnNKGAMw)
- **Điểm nhấn thiết kế:**
  - Giao diện tác nghiệp ERP chuyên nghiệp, tốc độ cao, hiển thị số liệu theo thời gian thực.
  - Cửa sổ xuất kho trừ tồn với cảnh báo đồng bộ tức thì ra mặt tiền Web.
  - Cơ chế xác thực mã PIN 4 số an toàn tuyệt đối, phân quyền rõ ràng cho thủ kho.
  - Sổ nhật ký xuất nhập kho (Audit Log) minh bạch, lưu vết từng giao dịch.

### Màn hình S01_Mob: Queen Stone - Royal Mobile Cool Elegance (Di Động Tone Lạnh & Slogan Chuẩn 2 Dòng)
- **ID:** `c6a5d4d45cf147d6b4ddee33c3aff2e8`
- **Ảnh chụp giao diện:** [Xem ảnh trực tiếp](https://lh3.googleusercontent.com/aida/AEtjO1V9jGOlDeWwRIlPAEnG1tmvbZ8Us2uecb8yCwuRKvTLZEKYsy3SKu9dp0QOEsvoWTrI9oGrajRjmlBVleqtjXUCOAUd7I2joeowQ-vpt05IqjfquciWR6VVB09nvxYHb31jgmnxG5c3WlXUx8TvF5d3vgyLCvA03F5EEuvYmSwf37sRZ8L78FgKxfMA4_C_yhJmDTATeoSQZxafmufPRiwfxneeFUn0QXO7OhfLxIoezK2F5fCO2FXhAnE)
- **Điểm nhấn thiết kế trên điện thoại (Mobile UX):**
  - **Slogan căn chỉnh tỷ lệ chuẩn (Font-size 22px-24px):** Hiển thị gọn gàng, sắc sảo trên đúng **2 DÒNG DUY NHẤT**, hoàn toàn không bị rớt từ hay ngắt chữ luộm thuộm.
  - **Đồng bộ tone màu lạnh Statuario & Arabescato:** Kết hợp lớp phủ tương phản cao, chữ trắng tuyết và vàng kim nổi bật rõ nét từng chi tiết.
  - **Single-Column Fluid Feed:** Danh sách mẫu đá xếp dọc tràn viền, tối ưu hóa diện tích hiển thị trên smartphone.
  - **Sticky Bottom Action Bar (Thumb Zone):** Nút **Tư Vấn Zalo 1-Click** & Hotline ghim cố định đáy màn hình, chạm là kết nối ngay.

---

## 4. KẾT LUẬN & SẴN SÀNG CHUYỂN PHA 2 (THI CÔNG)

Toàn bộ 5 bản vẽ giao diện đã được dựng trực quan trên Stitch MCP, thỏa mãn 100% các tiêu chí trong [REQUIREMENTS.md](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/REQUIREMENTS.md), trọn bộ 6 bản đặc tả [Spec_S01 đến Spec_S06](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/docs) và bản vẽ kiến trúc [SYSTEM_OVERVIEW.md](file:///c:/1.%20D%E1%BB%AE%20LI%E1%BB%86U/HOC%20VIBE%20CODING/6.%20LAB%2003%20-%20Web%20ban%20Da%20Tu%20Nhien/SYSTEM_OVERVIEW.md).

Hồ sơ sẵn sàng khóa `[SCREEN_LOCKED]` để Anh Mike duyệt chuyển sang **Pha 2: Tổng thầu Thi công Trọn gói (4 lớp: Database ➔ Core ➔ API ➔ UI)**.
