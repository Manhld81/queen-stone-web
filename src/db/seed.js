/**
 * SEED DATA GENERATOR FOR QUEEN STONE
 * Nạp 24 lô đá tự nhiên đẳng cấp, công trình lookbook và tổng kho
 */

const { getDb } = require('./database');

function seedDatabase(customDb) {
  const db = customDb || getDb();

  // Xóa dữ liệu cũ nếu chạy lại seed
  db.exec('DELETE FROM lich_su_xuat_kho;');
  db.exec('DELETE FROM san_pham_da;');
  db.exec('DELETE FROM cong_trinh;');
  db.exec('DELETE FROM showroom_kho;');
  try {
    db.exec('DELETE FROM album_photos;');
    // Giữ nguyên cấu hình hệ thống cau_hinh_he_thong để bảo toàn logo và cài đặt Admin đã chỉnh
  } catch (e) {
    // Nếu bảng chưa có, schema sẽ tạo
  }

  const insertStone = db.prepare(`
    INSERT INTO san_pham_da (
      ma_lo, ten_da, loai_da, mau_sac, xuat_xu,
      chieu_dai_mm, chieu_rong_mm, do_day_mm, be_mat,
      ung_dung, so_luong_tam, dien_tich_m2,
      hinh_anh_slab, hinh_anh_macro, kho_id, mo_ta, created_at
    ) VALUES (
      @ma_lo, @ten_da, @loai_da, @mau_sac, @xuat_xu,
      @chieu_dai_mm, @chieu_rong_mm, @do_day_mm, @be_mat,
      @ung_dung, @so_luong_tam, @dien_tich_m2,
      @hinh_anh_slab, @hinh_anh_macro, @kho_id, @mo_ta, @created_at
    )
  `);

  // Mảng 24 lô đá tự nhiên độc bản (sắp xếp theo created_at từ mới nhất tới cũ hơn)
  // Top 6 lô mới nhất (6 sản phẩm đầu tiên) sẽ có cờ is_new = true (nhấp nháy New)
  // Lô số 5, 12, 19 có số lượng = 0 để kiểm thử trạng thái "Hết hàng"
  const stones = [
    // 1. MỚI NHẤT (Top 1)
    {
      ma_lo: 'QS-CALA-802',
      ten_da: 'Calacatta Michelangelo Marble',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Carrara, Italy',
      chieu_dai_mm: 2980,
      chieu_rong_mm: 1750,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Sàn Sảnh, Cầu Thang',
      so_luong_tam: 12,
      dien_tich_m2: 62.5,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Đỉnh cao của dòng đá cẩm thạch Ý với nền trắng tuyết tinh khôi và những dải vân xám khói ánh vàng kim độc bản.',
      created_at: '2026-09-08 10:30:00'
    },
    // 2. MỚI THỨ 2
    {
      ma_lo: 'QS-PATA-701',
      ten_da: 'Patagonia Original Quartzite',
      loai_da: 'Quartzite',
      mau_sac: 'Vàng',
      xuat_xu: 'Bahia, Brazil',
      chieu_dai_mm: 3100,
      chieu_rong_mm: 1950,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp, Mặt Tiền',
      so_luong_tam: 8,
      dien_tich_m2: 48.3,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Thạch anh quý hiếm kết tinh các khối tinh thể thấu quang tự nhiên và vân hoàng thổ núi lửa kỳ vĩ.',
      created_at: '2026-09-08 09:15:00'
    },
    // 3. MỚI THỨ 3
    {
      ma_lo: 'QS-ONYX-901',
      ten_da: 'Emerald Green Onyx',
      loai_da: 'Onyx',
      mau_sac: 'Xanh',
      xuat_xu: 'Yazd, Iran',
      chieu_dai_mm: 2450,
      chieu_rong_mm: 1650,
      do_day_mm: 18,
      be_mat: 'Translucent Polished (Xuyên sáng)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp, Quầy Bar',
      so_luong_tam: 6,
      dien_tich_m2: 24.2,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_HN_01',
      mo_ta: 'Ngọc cẩm thạch xanh lục bảo thấu quang huyền ảo, tạo điểm nhấn vương giả và phong thủy thịnh vượng.',
      created_at: '2026-09-08 08:00:00'
    },
    // 4. MỚI THỨ 4
    {
      ma_lo: 'QS-STAT-303',
      ten_da: 'Statuario Extra Pure Marble',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Carrara, Italy',
      chieu_dai_mm: 3050,
      chieu_rong_mm: 1800,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Sàn Sảnh, Cầu Thang',
      so_luong_tam: 15,
      dien_tich_m2: 82.3,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Dòng đá hoàng gia danh giá nhất thế giới với nền trắng không tì vết và vân xám đậm sắc nét tựa tranh thuỷ mặc.',
      created_at: '2026-09-07 16:20:00'
    },
    // 5. MỚI THỨ 5 - [TEST HẾT HÀNG TRONG TOP NEW]
    {
      ma_lo: 'QS-BLRO-505',
      ten_da: 'Blue Roma Quartzite',
      loai_da: 'Quartzite',
      mau_sac: 'Xanh',
      xuat_xu: 'Bahia, Brazil',
      chieu_dai_mm: 3120,
      chieu_rong_mm: 1880,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp',
      so_luong_tam: 0, // ĐÃ HẾT HÀNG!
      dien_tich_m2: 0.0,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Sắc xanh ngọc lam hòa quyện các dải vân đồng vàng cổ điển độc nhất vô nhị. Toàn bộ lô đã được đặt cọc thi công.',
      created_at: '2026-09-07 14:00:00'
    },
    // 6. MỚI THỨ 6 (Top 6 cuối cùng có cờ NEW)
    {
      ma_lo: 'QS-VRAL-404',
      ten_da: 'Verde Alpi Imperial Marble',
      loai_da: 'Marble',
      mau_sac: 'Xanh',
      xuat_xu: 'Valle d’Aosta, Italy',
      chieu_dai_mm: 2850,
      chieu_rong_mm: 1650,
      do_day_mm: 20,
      be_mat: 'Honed & Polished',
      ung_dung: 'Cột Đại Sảnh, Vách Phòng Khách, Mặt Tiền',
      so_luong_tam: 10,
      dien_tich_m2: 47.0,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3E16kXD3SXt9lVBwc3WaRSsFmcaTkC-8t0IGYjVicnjETlYQoAyhV-uH2ZAxPiYLY5QOGAeUhhi8TYzKqfaHd6-Q1uC2rr0j1ReYYfqRH26QxSpXWOASCkymcB_alyvBnc9uYGo-U9Mu0vOn5dhUVQM5lp7yDwjDsLzbnnFF3u8brtFK2OA_idKuiSWpN2Vt1YaFCkLL9irIQ7T8-SEVUV9oxQI3ZsDbcgV9mMZugMR_RINxn3lNJI2QS_izD7m5m0IqgUB1_wtI',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Đá cẩm thạch xanh ngọc lục bảo thẫm với mạng lưới tinh thể canxit trắng muốt tạo chiều sâu thị giác uy nghi.',
      created_at: '2026-09-07 11:30:00'
    },
    // 7. CŨ HƠN (Không có badge NEW)
    {
      ma_lo: 'QS-ARAB-202',
      ten_da: 'Arabescato Corchia Marble',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Stazzema, Italy',
      chieu_dai_mm: 2900,
      chieu_rong_mm: 1720,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Phòng Tắm Master, Vách Phòng Khách, Đảo Bếp',
      so_luong_tam: 9,
      dien_tich_m2: 44.9,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_DN_01',
      mo_ta: 'Vân mây Arabesque cuồn cuộn huyền bí trên nền cẩm thạch trắng ngà, được ưa chuộng cho phòng tắm penthouse.',
      created_at: '2026-09-06 15:00:00'
    },
    // 8
    {
      ma_lo: 'QS-BLTA-606',
      ten_da: 'Black Taurus Granite',
      loai_da: 'Granite',
      mau_sac: 'Đen',
      xuat_xu: 'Minas Gerais, Brazil',
      chieu_dai_mm: 3200,
      chieu_rong_mm: 1900,
      do_day_mm: 20,
      be_mat: 'Polished & Leathered',
      ung_dung: 'Mặt Tiền, Bàn Bếp, Đảo Bếp',
      so_luong_tam: 14,
      dien_tich_m2: 85.1,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Nền đen sâu thẳm hòa quyện cùng các vệt sóng vàng hoàng kim rực rỡ, độ cứng vượt trội chống trầy xước.',
      created_at: '2026-09-05 10:00:00'
    },
    // 9
    {
      ma_lo: 'QS-CALB-101',
      ten_da: 'Calacatta Borghini Royal',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Carrara, Italy',
      chieu_dai_mm: 3000,
      chieu_rong_mm: 1780,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp, Sàn Sảnh',
      so_luong_tam: 8,
      dien_tich_m2: 42.7,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_HN_01',
      mo_ta: 'Dòng Borghini cổ điển với vân vàng mật ong đan xen xám khói, biểu tượng của sự quyền quý bất biến.',
      created_at: '2026-09-04 09:20:00'
    },
    // 10
    {
      ma_lo: 'QS-CRTF-808',
      ten_da: 'Cristallo Tiffany Quartzite',
      loai_da: 'Quartzite',
      mau_sac: 'Xanh',
      xuat_xu: 'Brazil',
      chieu_dai_mm: 2950,
      chieu_rong_mm: 1700,
      do_day_mm: 20,
      be_mat: 'Translucent Polished',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp, Quầy Bar',
      so_luong_tam: 7,
      dien_tich_m2: 35.1,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Thạch anh xanh ngọc Tiffany quý tộc, độ trong suốt cao có thể lắp đèn xuyên sáng tạo hiệu ứng băng tuyết lộng lẫy.',
      created_at: '2026-09-03 14:10:00'
    },
    // 11
    {
      ma_lo: 'QS-NERO-111',
      ten_da: 'Nero Marquina Marble',
      loai_da: 'Marble',
      mau_sac: 'Đen',
      xuat_xu: 'Markina, Spain',
      chieu_dai_mm: 2800,
      chieu_rong_mm: 1600,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Sàn Sảnh, Cầu Thang, Phòng Tắm',
      so_luong_tam: 18,
      dien_tich_m2: 80.6,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_CT_01',
      mo_ta: 'Sắc đen nhung tuyền điểm xuyết những sợi tia chớp trắng bất quy tắc, tạo điểm nhấn tương phản mạnh mẽ.',
      created_at: '2026-09-02 11:45:00'
    },
    // 12 - [TEST HẾT HÀNG]
    {
      ma_lo: 'QS-PAND-222',
      ten_da: 'Panda White Marble Bookmatched',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Sichuan',
      chieu_dai_mm: 2900,
      chieu_rong_mm: 1750,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Sàn Sảnh',
      so_luong_tam: 0, // ĐÃ HẾT HÀNG!
      dien_tich_m2: 0.0,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_HN_01',
      mo_ta: 'Hai mảng màu đen trắng tương phản kịch tính như bức hoạ thuỷ mặc. Đã hoàn tất thi công cho lâu đài Thành Thắng.',
      created_at: '2026-09-01 16:30:00'
    },
    // 13
    {
      ma_lo: 'QS-PORT-777',
      ten_da: 'Portoro Gold Black Marble',
      loai_da: 'Marble',
      mau_sac: 'Đen',
      xuat_xu: 'La Spezia, Italy',
      chieu_dai_mm: 2750,
      chieu_rong_mm: 1550,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Cầu Thang, Phòng Tắm',
      so_luong_tam: 5,
      dien_tich_m2: 21.3,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Cẩm thạch đen chỉ vàng đắt đỏ bậc nhất nước Ý, chuyên dùng cho các chi tiết nội thất xa xỉ của hoàng gia châu Âu.',
      created_at: '2026-08-30 10:00:00'
    },
    // 14
    {
      ma_lo: 'QS-GLDO-333',
      ten_da: 'Golden Macaubas Quartzite',
      loai_da: 'Quartzite',
      mau_sac: 'Vàng',
      xuat_xu: 'Brazil',
      chieu_dai_mm: 3150,
      chieu_rong_mm: 1920,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Mặt Tiền, Bàn Bếp, Đảo Bếp',
      so_luong_tam: 11,
      dien_tich_m2: 66.5,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_DN_01',
      mo_ta: 'Các đường vân vàng sa mạc uốn lượn nhịp nhàng trên nền thạch anh kem ấm, kháng axit và chịu lực tối đa.',
      created_at: '2026-08-28 15:40:00'
    },
    // 15
    {
      ma_lo: 'QS-WHBE-444',
      ten_da: 'White Beauty Ice Jade Marble',
      loai_da: 'Marble',
      mau_sac: 'Xanh',
      xuat_xu: 'Yunnan',
      chieu_dai_mm: 2850,
      chieu_rong_mm: 1680,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp',
      so_luong_tam: 13,
      dien_tich_m2: 62.2,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3E16kXD3SXt9lVBwc3WaRSsFmcaTkC-8t0IGYjVicnjETlYQoAyhV-uH2ZAxPiYLY5QOGAeUhhi8TYzKqfaHd6-Q1uC2rr0j1ReYYfqRH26QxSpXWOASCkymcB_alyvBnc9uYGo-U9Mu0vOn5dhUVQM5lp7yDwjDsLzbnnFF3u8brtFK2OA_idKuiSWpN2Vt1YaFCkLL9irIQ7T8-SEVUV9oxQI3ZsDbcgV9mMZugMR_RINxn3lNJI2QS_izD7m5m0IqgUB1_wtI',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Sự pha trộn tuyệt mỹ giữa mảng xanh ngọc bích, đen huyền và trắng băng tuyết tạo cảm giác nghệ thuật đương đại.',
      created_at: '2026-08-25 09:10:00'
    },
    // 16
    {
      ma_lo: 'QS-AMAZ-555',
      ten_da: 'Amazonite Exotic Granite',
      loai_da: 'Granite',
      mau_sac: 'Xanh',
      xuat_xu: 'Minas Gerais, Brazil',
      chieu_dai_mm: 3050,
      chieu_rong_mm: 1850,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Đảo Bếp, Quầy Bar, Vách Phòng Khách',
      so_luong_tam: 6,
      dien_tich_m2: 33.8,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Màu xanh ngọc lam Amazon tự nhiên hiếm thấy trong khoáng sản đá, quý hiếm và tôn vinh đẳng cấp thượng lưu.',
      created_at: '2026-08-22 14:00:00'
    },
    // 17
    {
      ma_lo: 'QS-TITA-999',
      ten_da: 'Titanium Gold Granite',
      loai_da: 'Granite',
      mau_sac: 'Đen',
      xuat_xu: 'Brazil',
      chieu_dai_mm: 3100,
      chieu_rong_mm: 1900,
      do_day_mm: 20,
      be_mat: 'Leathered (Nhám mịn)',
      ung_dung: 'Mặt Tiền, Bàn Bếp, Cầu Thang',
      so_luong_tam: 16,
      dien_tich_m2: 94.2,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_HN_01',
      mo_ta: 'Dòng hoa cương đen ánh titan lấp lánh vân vàng, bề mặt hoàn thiện da thuộc mềm mại chống bám vân tay.',
      created_at: '2026-08-20 11:15:00'
    },
    // 18
    {
      ma_lo: 'QS-ROSE-666',
      ten_da: 'Rosa Zarci Luxury Marble',
      loai_da: 'Marble',
      mau_sac: 'Vàng',
      xuat_xu: 'Spain',
      chieu_dai_mm: 2700,
      chieu_rong_mm: 1600,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Sàn Sảnh, Cầu Thang, Phòng Tắm',
      so_luong_tam: 10,
      dien_tich_m2: 43.2,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_CT_01',
      mo_ta: 'Tông màu vàng hồng phấn ấm áp mang phong cách cung điện hoàng gia Tây Ban Nha lãng mạn.',
      created_at: '2026-08-18 16:00:00'
    },
    // 19 - [TEST HẾT HÀNG]
    {
      ma_lo: 'QS-ONWH-888',
      ten_da: 'Pure White Onyx Translucent',
      loai_da: 'Onyx',
      mau_sac: 'Trắng',
      xuat_xu: 'Iran',
      chieu_dai_mm: 2500,
      chieu_rong_mm: 1550,
      do_day_mm: 18,
      be_mat: 'Translucent Polished',
      ung_dung: 'Vách Phòng Khách, Quầy Bar',
      so_luong_tam: 0, // ĐÃ HẾT HÀNG!
      dien_tich_m2: 0.0,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Ngọc cẩm thạch trắng tinh khiết thấu quang 100%, tựa ngọc bích quý phái. Đã xuất kho bàn giao toàn bộ.',
      created_at: '2026-08-15 10:20:00'
    },
    // 20
    {
      ma_lo: 'QS-VOLA-002',
      ten_da: 'Volakas Classic Greek Marble',
      loai_da: 'Marble',
      mau_sac: 'Trắng',
      xuat_xu: 'Drama, Greece',
      chieu_dai_mm: 2950,
      chieu_rong_mm: 1720,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Sàn Sảnh, Cầu Thang, Phòng Tắm',
      so_luong_tam: 22,
      dien_tich_m2: 111.6,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_HN_01',
      mo_ta: 'Đá trắng Hy Lạp với dải vân xám tím mềm mại như dòng suối tuyết, mang lại nét thanh tao cho không gian.',
      created_at: '2026-08-12 14:30:00'
    },
    // 21
    {
      ma_lo: 'QS-MAGM-007',
      ten_da: 'Magma Gold Exotic Granite',
      loai_da: 'Granite',
      mau_sac: 'Vàng',
      xuat_xu: 'Brazil',
      chieu_dai_mm: 3100,
      chieu_rong_mm: 1880,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Đảo Bếp, Mặt Tiền, Vách Phòng Khách',
      so_luong_tam: 8,
      dien_tich_m2: 46.6,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9iYp1Y8_1r4Yq9n6L3zK0j_7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Dòng nham thạch vàng rực cuộn trên nền đá đen sẫm, thể hiện quyền uy tối thượng và sinh khí dồi dào.',
      created_at: '2026-08-10 10:00:00'
    },
    // 22
    {
      ma_lo: 'QS-FUSI-008',
      ten_da: 'Fusion Wow Multi Quartzite',
      loai_da: 'Quartzite',
      mau_sac: 'Xanh',
      xuat_xu: 'Bahia, Brazil',
      chieu_dai_mm: 3000,
      chieu_rong_mm: 1800,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Vách Phòng Khách, Đảo Bếp',
      so_luong_tam: 7,
      dien_tich_m2: 37.8,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_DN_01',
      mo_ta: 'Bản giao hưởng màu sắc rực rỡ từ xanh rêu, cam đất đến xám bạc như một bức tranh trừu tượng sống động.',
      created_at: '2026-08-08 15:20:00'
    },
    // 23
    {
      ma_lo: 'QS-EMER-009',
      ten_da: 'Emerald Green Quartzite Royal',
      loai_da: 'Quartzite',
      mau_sac: 'Xanh',
      xuat_xu: 'Brazil',
      chieu_dai_mm: 3100,
      chieu_rong_mm: 1900,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Mặt Tiền, Vách Phòng Khách, Đảo Bếp',
      so_luong_tam: 12,
      dien_tich_m2: 70.6,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3E16kXD3SXt9lVBwc3WaRSsFmcaTkC-8t0IGYjVicnjETlYQoAyhV-uH2ZAxPiYLY5QOGAeUhhi8TYzKqfaHd6-Q1uC2rr0j1ReYYfqRH26QxSpXWOASCkymcB_alyvBnc9uYGo-U9Mu0vOn5dhUVQM5lp7yDwjDsLzbnnFF3u8brtFK2OA_idKuiSWpN2Vt1YaFCkLL9irIQ7T8-SEVUV9oxQI3ZsDbcgV9mMZugMR_RINxn3lNJI2QS_izD7m5m0IqgUB1_wtI',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
      kho_id: 'KHO_SG_01',
      mo_ta: 'Thạch anh xanh lục bảo nguyên khối, độ bền vĩnh cửu và độ bóng hoàn hảo cho các công trình triệu đô.',
      created_at: '2026-08-05 09:00:00'
    },
    // 24 (CŨ NHẤT)
    {
      ma_lo: 'QS-CREM-010',
      ten_da: 'Crema Marfil Classic Marble',
      loai_da: 'Marble',
      mau_sac: 'Vàng',
      xuat_xu: 'Alicante, Spain',
      chieu_dai_mm: 2850,
      chieu_rong_mm: 1650,
      do_day_mm: 20,
      be_mat: 'Polished (Bóng gương)',
      ung_dung: 'Sàn Sảnh, Cầu Thang',
      so_luong_tam: 25,
      dien_tich_m2: 117.5,
      hinh_anh_slab: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVspxhrepQelwc14nKb699kiPwFIjmi1YMJcbWTbi5GP4xreihRMaNGsTITPmpKVclZPJhn5lJ9Db4ugtoOBmy1b4bEGeB0P3kF23Ejb85_EzlThLlxk3-cfTSOXo9LetqRG4e6p_CvQ_62Kf1gPU1oJIflpGDq1zFKoJ75FyMS5IVLoX1FHesCOPQOP9CdHx9-1reTvVRP8dw38mhTjNvga6vIGpU6E2KJBi_hu6p4zg9gN5gBxDYBgCtpXCOHQkgP63s4W-N-iM',
      hinh_anh_macro: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1c56hXq38r3NfMv9_Nf9n0GcxI0M53k44b_4vjF7c7W2c4E3P4B6S1a2M3K4N5L6J7H8G9F0E1D2C3B4A5',
      kho_id: 'KHO_CT_01',
      mo_ta: 'Sắc kem cổ điển ấm áp của vùng Địa Trung Hải, vân chỉ quế thanh nhã được lát cho sảnh đón khách sạn 5 sao.',
      created_at: '2026-08-01 08:30:00'
    }
  ];

  for (const s of stones) {
    if (!s.hinh_anh_slab || s.hinh_anh_slab.startsWith('https://lh3.googleusercontent.com')) {
      s.hinh_anh_slab = `/assets/stones/slab_${s.ma_lo}.jpg`;
    }
    if (!s.hinh_anh_macro || s.hinh_anh_macro.startsWith('https://lh3.googleusercontent.com')) {
      s.hinh_anh_macro = `/assets/stones/macro_${s.ma_lo}.jpg`;
    }
    insertStone.run(s);
  }

  // Seed bảng công trình lookbook (Công trình tiêu biểu)
  const insertProject = db.prepare(`
    INSERT INTO cong_trinh (ten_cong_trinh, dia_diem, loai_hinh, dien_tich, hinh_anh, da_su_dung, mo_ta, nam_hoan_thanh, album_json)
    VALUES (@ten_cong_trinh, @dia_diem, @loai_hinh, @dien_tich, @hinh_anh, @da_su_dung, @mo_ta, @nam_hoan_thanh, @album_json)
  `);

  const projects = [
    {
      ten_cong_trinh: 'Dinh Thự Hoàng Gia The Rivus',
      dia_diem: 'Thủ Đức, TP. Hồ Chí Minh',
      loai_hinh: 'Dinh Thự Thượng Lưu',
      dien_tich: '1.450 m²',
      hinh_anh: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
      da_su_dung: 'Verde Alpi Marble, Statuario Extra, Patagonia Quartzite',
      mo_ta: 'Hệ thức cột cẩm thạch Verde Alpi kết hợp sàn Statuario và vách đá thạch anh Patagonia thông tầng 8m kiệt tác.',
      nam_hoan_thanh: 2025,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
          title: 'Đại Sảnh Thông Tầng Hoàng Gia',
          desc: 'Hệ cột cẩm thạch xanh ngọc Verde Alpi nguyên khối kết hợp sàn đá cẩm thạch trắng Statuario bóng gương.',
          tag: 'Đại Sảnh'
        },
        {
          url: '/assets/hero_slides/slide_02_living_room_wall.jpg',
          title: 'Vách Thông Tầng Phòng Khách 8m',
          desc: 'Đá thạch anh Patagonia Brazil bookmatched đối vân tự nhiên tạo điểm nhấn thị giác uy nghi.',
          tag: 'Phòng Khách'
        },
        {
          url: '/assets/hero_slides/slide_04_grand_staircase.jpg',
          title: 'Đại Cầu Thang Xoắn Ốc Cẩm Thạch',
          desc: 'Bậc cầu thang uốn lượn gia công CNC từ cẩm thạch Statuario nguyên khối sang trọng.',
          tag: 'Cầu Thang'
        },
        {
          url: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
          title: 'Đảo Bếp & Quầy Bar Ngọc Onyx Phát Quang',
          desc: 'Hệ đèn LED âm xuyên qua phiến đá Emerald Green Onyx tạo hiệu ứng huyền ảo hoàng gia.',
          tag: 'Khu Bếp'
        },
        {
          url: '/assets/hero_slides/slide_05_master_spa.jpg',
          title: 'Phòng Tắm Master Suite Spa',
          desc: 'Toàn bộ tường và bồn tắm nguyên khối ốp đá cẩm thạch Arabescato nhập khẩu Ý.',
          tag: 'Master Spa'
        },
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          title: 'Toàn Cảnh Mặt Tiền Dinh Thự Ban Ngày',
          desc: 'Kiến trúc tân cổ điển sử dụng đá Granite và Marble tự nhiên chống chịu thời tiết vĩnh cửu.',
          tag: 'Mặt Tiền'
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
          title: 'Hành Lang Thư Viện Dinh Thự',
          desc: 'Lối đi lát đá Calacatta Michelangelo với hoa văn đối xứng tân cổ điển tinh xảo.',
          tag: 'Hành Lang'
        },
        {
          url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
          title: 'Chi Tiết Bàn Ăn Đại Tiệc Mặt Đá Tự Nhiên',
          desc: 'Mặt bàn dài 4.2m chế tác từ phiến đá thạch anh Quartzite Patagonia chống trầy xước tuyệt đối.',
          tag: 'Phòng Ăn'
        }
      ])
    },
    {
      ten_cong_trinh: 'Biệt Thự Đảo Ecopark Grand',
      dia_diem: 'Văn Giang, Hưng Yên',
      loai_hinh: 'Biệt Thự Đảo Triệu Đô',
      dien_tich: '980 m²',
      hinh_anh: '/assets/hero_slides/slide_02_living_room_wall.jpg',
      da_su_dung: 'Calacatta Michelangelo, Emerald Green Onyx, Black Taurus',
      mo_ta: 'Vách tivi 7m ốp đá Patagonia bookmatched tự nhiên kết hợp đảo bếp Onyx xanh phát quang xuyên sáng.',
      nam_hoan_thanh: 2025,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_02_living_room_wall.jpg',
          title: 'Vách Tivi Phòng Khách 7m Đối Vân Tự Nhiên',
          desc: 'Phiến đá thạch anh Patagonia Brazil ghép đôi bookmatched hoàn hảo đón ánh sáng tự nhiên.',
          tag: 'Phòng Khách'
        },
        {
          url: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
          title: 'Đảo Bếp Onyx Xanh Xuyên Sáng Độc Bản',
          desc: 'Mặt đảo bếp kết hợp quầy rượu phát quang dịu nhẹ mang năng lượng phong thủy thịnh vượng.',
          tag: 'Bếp & Bar'
        },
        {
          url: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
          title: 'Sảnh Đón Biệt Thự Hướng Hồ',
          desc: 'Nền đá cẩm thạch Ý hoa văn tròn tâm điểm sảnh chính dẫn lối ra sân vườn ven sông.',
          tag: 'Sảnh Đón'
        },
        {
          url: '/assets/hero_slides/slide_05_master_spa.jpg',
          title: 'Phòng Xông Hơi & Tắm Massage Master',
          desc: 'Đá cẩm thạch trắng vân xám thanh khiết mang lại không gian thư giãn đẳng cấp resort 6 sao.',
          tag: 'Phòng Tắm'
        },
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
          title: 'Không Gian Sân Vườn Biệt Thự Đảo',
          desc: 'Hồ cá Koi và lối dạo sân vườn lát đá tự nhiên chống trơn trượt chuẩn phong cách sinh thái thượng lưu.',
          tag: 'Cảnh Quan'
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
          title: 'Phòng Ngủ Master View Hồ Nước',
          desc: 'Vách đầu giường ốp đá ngọc cẩm thạch mài mờ kết hợp ốp gỗ óc chó Bắc Mỹ thượng hạng.',
          tag: 'Phòng Ngủ'
        }
      ])
    },
    {
      ten_cong_trinh: 'Penthouse Thảo Điền Pearl',
      dia_diem: 'Quận 2, TP. Hồ Chí Minh',
      loai_hinh: 'Penthouse Hoàng Gia',
      dien_tich: '650 m²',
      hinh_anh: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
      da_su_dung: 'Emerald Green Onyx, Black Taurus Granite, Statuario Extra',
      mo_ta: 'Quầy bar và đảo bếp đá ngọc cẩm thạch Onyx nguyên khối xuyên sáng huyền ảo phong thủy.',
      nam_hoan_thanh: 2024,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
          title: 'Đảo Bếp & Quầy Pha Chế Onyx Xuyên Sáng',
          desc: 'Kiệt tác ngọc xuyên sáng nhập khẩu Iran với ánh sáng xanh ngọc lục bảo tôn vinh phòng khách tầng cao.',
          tag: 'Đảo Bếp'
        },
        {
          url: '/assets/hero_slides/slide_04_grand_staircase.jpg',
          title: 'Cầu Thang Duplex Kính Cường Lực & Đá Statuario',
          desc: 'Bậc đá cẩm thạch trắng Ý kết hợp tay vịn mạ vàng kim PVD sang trọng nối liền 2 tầng penthouse.',
          tag: 'Cầu Thang'
        },
        {
          url: '/assets/hero_slides/slide_05_master_spa.jpg',
          title: 'Bồn Tắm Panorama Ngắm Toàn Cảnh Sông Sài Gòn',
          desc: 'Không gian tắm master ốp đá cẩm thạch Calacatta với bồn ngâm độc lập hướng thẳng chân trời.',
          tag: 'Master Bath'
        },
        {
          url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
          title: 'Phòng Khách Duplex Trần Cao 6m',
          desc: 'Sàn lát đá Marble Statuario trắng vân lớn 1200x1200mm liền mạch phản chiếu hoàng hôn lộng lẫy.',
          tag: 'Phòng Khách'
        },
        {
          url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=80',
          title: 'Ban Công Sky Lounge Sân Vườn Trên Không',
          desc: 'Sàn ngoài trời lát đá Granite hoa cương chống thấm cao cấp làm nơi thưởng trà và ngắm pháo hoa.',
          tag: 'Sky Lounge'
        }
      ])
    },
    {
      ten_cong_trinh: 'Lâu Đài Cổ Điển Chateau Phú Mỹ Hưng',
      dia_diem: 'Quận 7, TP. Hồ Chí Minh',
      loai_hinh: 'Lâu Đài Cổ Điển Pháp',
      dien_tich: '1.800 m²',
      hinh_anh: '/assets/hero_slides/slide_04_grand_staircase.jpg',
      da_su_dung: 'Crema Marfil, Dark Emperador, Calacatta Gold',
      mo_ta: 'Kiến trúc lâu đài kiểu Pháp với đại sảnh vòm cao 12m và cầu thang xoắn ốc uốn lượn bằng đá Marble Tây Ban Nha.',
      nam_hoan_thanh: 2024,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_04_grand_staircase.jpg',
          title: 'Đại Cầu Thang Hoàng Gia Tây Ban Nha',
          desc: 'Được chế tác hoàn toàn thủ công từ đá Crema Marfil kết hợp viền hoa văn Dark Emperador sang trọng.',
          tag: 'Đại Sảnh'
        },
        {
          url: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
          title: 'Hành Lang Cột Tròn Cẩm Thạch',
          desc: 'Hệ thức cột Doric cẩm thạch nguyên khối nâng đỡ mái vòm dát vàng cổ điển.',
          tag: 'Hành Lang'
        },
        {
          url: '/assets/hero_slides/slide_02_living_room_wall.jpg',
          title: 'Phòng Tiếp Khách Đại Huynh Đệ',
          desc: 'Vách lò sưởi chạm khắc đá cẩm thạch thủ công theo phong cách quý tộc Châu Âu thế kỷ 19.',
          tag: 'Phòng Khách'
        },
        {
          url: '/assets/hero_slides/slide_05_master_spa.jpg',
          title: 'Khu Vực Thư Giãn Tắm Hoàng Gia',
          desc: 'Hồ bơi trong nhà và bể sục jacuzzi ốp cẩm thạch Calacatta Gold ánh kim quý phái.',
          tag: 'Hồ Bơi & Spa'
        },
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          title: 'Toàn Cảnh Lâu Đài Về Đêm',
          desc: 'Hệ thống ánh sáng kiến trúc tôn vinh các chi tiết phào chỉ và cột đá tự nhiên đồ sộ.',
          tag: 'Ngoại Thất'
        }
      ])
    },
    {
      ten_cong_trinh: 'Villa Nghỉ Dưỡng Thung Lũng Mây Đà Lạt',
      dia_diem: 'Đà Lạt, Lâm Đồng',
      loai_hinh: 'Villa Nghỉ Dưỡng Đồi',
      dien_tich: '850 m²',
      hinh_anh: '/assets/hero_slides/slide_05_master_spa.jpg',
      da_su_dung: 'Arabescato Orobico, Blue Roma Quartzite, Travertine',
      mo_ta: 'Villa nghỉ dưỡng hòa mình cùng thiên nhiên sương mây, ứng dụng đá Travertine mộc và cẩm thạch Ý thanh lịch.',
      nam_hoan_thanh: 2025,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_05_master_spa.jpg',
          title: 'Phòng Tắm Master Mở Ra Rừng Thông',
          desc: 'Không gian tắm thư giãn ốp đá cẩm thạch Arabescato tự nhiên đón trọn khung cảnh đồi thông bảng lảng sương.',
          tag: 'Master Spa'
        },
        {
          url: '/assets/hero_slides/slide_02_living_room_wall.jpg',
          title: 'Vách Đá Lò Sưởi Phòng Khách Ấm Áp',
          desc: 'Đá Quartzite Blue Roma Brazil vân đồng nâu ấm cúng tạo cảm giác gần gũi và tĩnh tại.',
          tag: 'Phòng Khách'
        },
        {
          url: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
          title: 'Bàn Trà Chiều Xuyên Sáng Giữa Sương Núi',
          desc: 'Mặt bàn đá ngọc phát quang nhẹ nhàng làm ấm không gian những chiều hoàng hôn cao nguyên.',
          tag: 'Phòng Trà'
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
          title: 'Hiên Ban Công Ngắm Bình Minh',
          desc: 'Lát đá Travertine chống trơn trượt mộc mạc, phù hợp với khí hậu se lạnh và sương mù Đà Lạt.',
          tag: 'Ban Công'
        }
      ])
    },
    {
      ten_cong_trinh: 'Dinh Thự Ven Biển Ocean Villa Danang',
      dia_diem: 'Sơn Trà, TP. Đà Nẵng',
      loai_hinh: 'Dinh Thự Biển Độc Bản',
      dien_tich: '1.200 m²',
      hinh_anh: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
      da_su_dung: 'Azul Macaubas, Calacatta Michelangelo, Black Taurus',
      mo_ta: 'Dinh thự trực diện biển Mỹ Khê ứng dụng sắc xanh biển sâu ngọc bích Azul Macaubas hòa cùng làn sóng xanh đại dương.',
      nam_hoan_thanh: 2024,
      album_json: JSON.stringify([
        {
          url: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
          title: 'Sảnh Đón Cửa Biển Lộng Gió',
          desc: 'Mặt sàn đá Marble bóng gương phản chiếu bầu trời và biển xanh ngắt.',
          tag: 'Sảnh Đón'
        },
        {
          url: '/assets/hero_slides/slide_03_kitchen_onyx.jpg',
          title: 'Quầy Bar Tiệc Cocktail Hoàng Hôn Biển',
          desc: 'Quầy bar đá Onyx phát quang kết hợp đá Azul Macaubas xanh ngọc độc nhất vô nhị.',
          tag: 'Quầy Bar'
        },
        {
          url: '/assets/hero_slides/slide_02_living_room_wall.jpg',
          title: 'Vách Trang Trí Phòng Khách Vô Cực',
          desc: 'Vách đá Quartzite Patagonia tự nhiên không góc chết hướng tầm mắt ra vịnh biển.',
          tag: 'Phòng Khách'
        },
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
          title: 'Bể Bơi Vô Cực Trực Diện Biển',
          desc: 'Đáy và thành hồ bơi ốp đá tự nhiên kháng muối biển và chống bám rêu tuyệt đối.',
          tag: 'Bể Bơi'
        }
      ])
    }
  ];

  for (const p of projects) {
    insertProject.run(p);
  }

  // Seed bảng showroom_kho
  const insertDepot = db.prepare(`
    INSERT INTO showroom_kho (id, ten_co_so, loai, dia_chi, hotline, email, gio_mo_cua, suc_chua_m2, thiet_bi, hinh_anh, google_map_url)
    VALUES (@id, @ten_co_so, @loai, @dia_chi, @hotline, @email, @gio_mo_cua, @suc_chua_m2, @thiet_bi, @hinh_anh, @google_map_url)
  `);

  const depots = [
    {
      id: 'KHO_SG_01',
      ten_co_so: 'Trụ Sở Chính — Queen Stone TP.HCM',
      loai: 'Trụ Sở Chính Toàn Quốc',
      dia_chi: 'Số 18 Đại Lộ Mai Chí Thọ, P. An Phú, TP. Thủ Đức, TP.HCM',
      hotline: '0988.888.789',
      email: 'contact@queenstone.vn',
      gio_mo_cua: '08:00 - 18:30 (Cả Thứ 7, CN)',
      suc_chua_m2: 25000,
      thiet_bi: 'Cẩu trục chuyên dụng 10 tấn, máy quét 3D vân đá, bãi xe VIP',
      hinh_anh: '/assets/branches/branch_tru_so_chinh.jpg',
      google_map_url: 'https://www.google.com/maps/search/?api=1&query=18+Mai+Ch%C3%AD+Th%E1%BB%8D%2C+An+Ph%C3%BA%2C+Th%E1%BB%A7+%C4%90%E1%BB%A9c%2C+H%E1%BB%93+Ch%C3%AD+Minh'
    },
    {
      id: 'KHO_HN_01',
      ten_co_so: 'Showroom 1 — Tổng Kho Miền Bắc (Hà Nội)',
      loai: 'Showroom 1 — Miền Bắc',
      dia_chi: 'KCN Nam Từ Liêm, Đường Cầu Diễn, Q. Bắc Từ Liêm, Hà Nội',
      hotline: '0988.888.123',
      email: 'hanoi@queenstone.vn',
      gio_mo_cua: '08:00 - 18:00 (Cả Thứ 7, CN)',
      suc_chua_m2: 20000,
      thiet_bi: 'Cẩu trục đôi 12 tấn, hệ thống chiếu sáng showroom chuẩn CRI 98',
      hinh_anh: '/assets/branches/branch_showroom_01_hanoi.jpg',
      google_map_url: 'https://www.google.com/maps/search/?api=1&query=KCN+Nam+T%E1%BB%AB+Li%C3%AAm%2C+C%E1%BA%A7u+Di%E1%BB%85n%2C+B%E1%BA%AFc+T%E1%BB%AB+Li%C3%AAm%2C+H%C3%A0+N%E1%BB%99i'
    },
    {
      id: 'KHO_DN_01',
      ten_co_so: 'Showroom 2 — Tổng Kho Miền Trung (Đà Nẵng)',
      loai: 'Showroom 2 — Miền Trung',
      dia_chi: 'Đường Trường Chinh, P. Hòa Phát, Q. Cẩm Lệ, TP. Đà Nẵng',
      hotline: '0988.888.456',
      email: 'danang@queenstone.vn',
      gio_mo_cua: '08:00 - 17:30',
      suc_chua_m2: 15000,
      thiet_bi: 'Cẩu trục 10 tấn, máy cắt tia nước CNC 5 trục',
      hinh_anh: '/assets/branches/branch_showroom_02_danang.jpg',
      google_map_url: 'https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+Chinh%2C+C%E1%BA%A9m+L%E1%BB%87%2C+%C4%90%C3%A0+N%E1%BA%B5ng'
    },
    {
      id: 'KHO_CT_01',
      ten_co_so: 'Showroom 3 — Tổng Kho Tây Nam Bộ (Cần Thơ)',
      loai: 'Showroom 3 — Tây Nam Bộ',
      dia_chi: 'Khu Nam Sông Hậu, P. Phú Thứ, Q. Cái Răng, TP. Cần Thơ',
      hotline: '0988.888.789',
      email: 'cantho@queenstone.vn',
      gio_mo_cua: '08:00 - 17:30',
      suc_chua_m2: 12000,
      thiet_bi: 'Cẩu trục 8 tấn bọc cao su chống xước, bãi slab chuẩn Châu Âu',
      hinh_anh: '/assets/branches/branch_showroom_03_cantho.jpg',
      google_map_url: 'https://www.google.com/maps/search/?api=1&query=Khu+Nam+S%C3%B4ng+H%E1%BA%ADu%2C+C%C3%A1i+R%C4%83ng%2C+C%E1%BA%A7n+Th%C6%A1'
    }
  ];

  for (const d of depots) {
    insertDepot.run(d);
  }

  // Khởi tạo và nạp dữ liệu bảng album_photos (Kho ảnh vô hạn công trình đá tự nhiên)
  db.exec(`
    CREATE TABLE IF NOT EXISTS album_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'Đại Sảnh',
      project_name TEXT DEFAULT 'Dinh Thự Hoàng Gia',
      stone_name TEXT DEFAULT 'Cẩm thạch Marble Ý',
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const insertAlbumPhoto = db.prepare(`
    INSERT INTO album_photos (title, image_url, category, project_name, stone_name, description, sort_order)
    VALUES (@title, @image_url, @category, @project_name, @stone_name, @description, @sort_order)
  `);

  let totalAlbumPhotos = 0;
  let sortOrder = 1;
  for (const p of projects) {
    let pPhotos = [];
    try {
      pPhotos = p.album_json ? JSON.parse(p.album_json) : [];
    } catch (e) {
      pPhotos = [];
    }
    for (const ph of pPhotos) {
      insertAlbumPhoto.run({
        title: ph.title,
        image_url: ph.url,
        category: ph.tag || 'Đại Sảnh',
        project_name: p.ten_cong_trinh,
        stone_name: p.da_su_dung,
        description: ph.desc || p.mo_ta,
        sort_order: sortOrder++
      });
      totalAlbumPhotos++;
    }
  }

  // 20 Tác phẩm Album Đá Tự Nhiên Độc Bản Tuyển Chọn Kèm Thuyết Minh Kiến Trúc Đầy Đủ
  const curatedAlbumPhotos = [
    {
      title: 'Đại Sảnh Vòm Cẩm Thạch Calacatta Michelangelo & Cầu Thang Xoắn Đôi',
      image_url: '/assets/album/album_calacatta_foyer.jpg',
      category: 'Đại Sảnh',
      project_name: 'Dinh Thự Hoàng Gia The Rivus Ba Son',
      stone_name: 'Calacatta Michelangelo Marble Ý',
      description: 'Không gian đại sảnh thông tầng ấn tượng với kiến trúc vòm bán nguyệt tân cổ điển. Toàn bộ sàn được lát cẩm thạch Calacatta Michelangelo kết hợp hoa văn sao tám cánh đối xứng tinh xảo, hòa quyện hoàn mỹ cùng hệ cầu thang xoắn đôi ốp đá nguyên khối dát đồng vương giả.'
    },
    {
      title: 'Quầy Bar Ngọc Cẩm Thạch Onyx Xanh Xuyên Sáng Panorama Sky Lounge',
      image_url: '/assets/album/album_lounge_onyx_bar.jpg',
      category: 'Sky Lounge',
      project_name: 'Penthouse Grand Marina Saigon',
      stone_name: 'Emerald Green Onyx Iran Xuyên Sáng',
      description: 'Điểm nhấn xa hoa bậc nhất của Sky Lounge với đảo quầy bar uốn cong bọc ngọc cẩm thạch Emerald Onyx thấu quang từ Iran. Khi hệ thống đèn LED ẩn bên trong bật sáng, các đường vân ngọc bích và hổ phách tự nhiên bừng sáng huyền ảo đối lập ngoạn mục cùng toàn cảnh thành phố đêm.'
    },
    {
      title: 'Vách Thông Tầng Thạch Anh Patagonia Bookmatch Nghệ Thuật Biệt Thự Đảo',
      image_url: '/assets/album/album_patagonia_living.jpg',
      category: 'Phòng Khách',
      project_name: 'Villa Biển Độc Bản Regent Horizon',
      stone_name: 'Patagonia Original Quartzite Brazil',
      description: 'Mảng vách thông tầng cao 7.5m sử dụng 4 phiến thạch anh Patagonia ghép đối xứng Bookmatch hoàn hảo tạo hình cánh bướm kỳ vĩ. Các khối tinh thể thấu quang tự nhiên được kích hoạt ánh sáng nền, tạo nên một tác phẩm nghệ thuật địa chất sống động nhìn thẳng ra hồ bơi vô cực.'
    },
    {
      title: 'Sảnh Đón Cột Trụ Cẩm Thạch Verde Alpi & Lát Nền Hoa Văn Thảm Đá',
      image_url: '/assets/album/album_foyer_01.jpg',
      category: 'Đại Sảnh',
      project_name: 'Château De Royale Sala',
      stone_name: 'Verde Alpi Marble & Statuario Extra',
      description: 'Lối vào tiền sảnh uy nghi với hệ thức cột La Mã ốp đá cẩm thạch xanh lục bảo Verde Alpi từ thung lũng Aosta nước Ý. Nền sảnh đan xen thảm đá hoa văn viền đen Nero Marquina và tâm trắng Statuario mang lại ấn tượng bề thế cho khách quý.'
    },
    {
      title: 'Sảnh Vòm Tân Cổ Điển Cẩm Thạch Arabescato Corchia Khắc Phù Điêu',
      image_url: '/assets/album/album_foyer_02.jpg',
      category: 'Đại Sảnh',
      project_name: 'Dinh Thự Holm Villas Thảo Điền',
      stone_name: 'Arabescato Corchia Marble Ý',
      description: 'Vòm sảnh đón được kiến tạo bởi các phiến đá Arabescato Corchia có hoa văn breccia mây xám cuộn xoáy trên nền trắng tinh khiết. Ánh sáng tự nhiên từ giếng trời rọi chiếu làm nổi bật chiều sâu ba chiều của từng đường vân tự nhiên.'
    },
    {
      title: 'Vách Tivi & Lò Sưởi Cẩm Thạch Portoro Gold Ý Dinh Thự Ciputra',
      image_url: '/assets/album/album_living_01.jpg',
      category: 'Phòng Khách',
      project_name: 'Biệt Thự Đảo Ecopark Grand',
      stone_name: 'Portoro Gold Black Marble Ý',
      description: 'Sự kết hợp táo bạo giữa nền đá đen tuyền huyền bí và những dải chỉ vàng hổ phách sáng chói của đá Portoro Ý. Tấm vách đá tự nhiên độc bản làm nền tôn vinh hệ lò sưởi âm tường và nội thất da thuộc bespoke thủ công phong cách Milan.'
    },
    {
      title: 'Không Gian Phòng Khách Tối Giản Với Vách Đá Xuyên Sáng Cristallo Tiffany',
      image_url: '/assets/album/album_living_02.jpg',
      category: 'Phòng Khách',
      project_name: 'Penthouse Serenity Sky Villas',
      stone_name: 'Cristallo Tiffany Quartzite Brazil',
      description: 'Không gian phòng khách hiện đại ứng dụng đá thạch anh Cristallo Tiffany xanh ngọc biển trong suốt. Khả năng khúc xạ ánh sáng độc đáo của tinh thể thạch anh biến bức vách thành một tấm gương phản chiếu năng lượng thanh bình và thịnh vượng.'
    },
    {
      title: 'Phòng Khách Master Với Mặt Sàn Bookmatch Calacatta Borghini',
      image_url: '/assets/album/album_living_03.jpg',
      category: 'Phòng Khách',
      project_name: 'Biệt Thự Chateau Phú Mỹ Hưng',
      stone_name: 'Calacatta Borghini Royal Marble',
      description: 'Toàn bộ sàn phòng khách rộng 120m2 được tuyển chọn từ các phiến cẩm thạch Calacatta Borghini khai thác cùng một vỉa đá tại Carrara. Kỹ thuật mài bóng gương và thi công mạch khít tiêu chuẩn 0.5mm tạo cảm giác như một mặt hồ gương cẩm thạch liền mạch.'
    },
    {
      title: 'Bàn Đảo Bếp Nguyên Khối Thạch Anh Blue Roma Kết Hợp Gỗ Óc Chó',
      image_url: '/assets/album/album_kitchen_01.jpg',
      category: 'Đảo Bếp',
      project_name: 'Penthouse Diamond Island Quận 2',
      stone_name: 'Blue Roma Quartzite Brazil',
      description: 'Bàn đảo bếp trung tâm dài 3.6m được chế tác từ phiến thạch anh Blue Roma nguyên khối với sắc xanh lam ánh thép và vân vàng đồng độc nhất vô nhị. Bề mặt vát cạnh 45 độ tinh xảo chống ố mài mòn tuyệt đối chuẩn công năng ẩm thực cao cấp.'
    },
    {
      title: 'Hệ Tủ Bếp & Mặt Bàn Đảo Cẩm Thạch Statuario Extra Pure',
      image_url: '/assets/album/album_kitchen_02.jpg',
      category: 'Đảo Bếp',
      project_name: 'Villa Compound Lan Anh Village',
      stone_name: 'Statuario Extra Pure Marble Ý',
      description: 'Không gian bếp phong cách Châu Âu thượng lưu với mặt bàn và ốp tường backsplash hoàn toàn bằng cẩm thạch Statuario vân đậm sắc nét. Đường vân chảy liền mạch từ mặt bàn xuống hai bên chân thác nước (waterfall edge) đạt độ chuẩn xác cơ học cao.'
    },
    {
      title: 'Quầy Bar Bếp Xuyên Sáng Ngọc Cẩm Thạch Trắng Pure White Onyx',
      image_url: '/assets/album/album_kitchen_03.jpg',
      category: 'Đảo Bếp',
      project_name: 'Dinh Thự Vườn Mai Ecopark',
      stone_name: 'Pure White Onyx Translucent Iran',
      description: 'Quầy bar kết hợp không gian ăn nhanh sử dụng đá Onyx trắng ngọc thấu quang 100%. Ánh sáng dịu nhẹ xuyên qua thớ đá tạo bầu không khí ấm cúng, biến không gian bếp thành tâm điểm thư giãn thưởng rượu của gia chủ.'
    },
    {
      title: 'Cầu Thang Lượn Điêu Khắc Ốp Đá Cẩm Thạch Panda White Bookmatch',
      image_url: '/assets/album/album_stair_01.jpg',
      category: 'Cầu Thang',
      project_name: 'Dinh Thự Cổ Điển Vinhomes Riverside',
      stone_name: 'Panda White Marble Bookmatched',
      description: 'Tác phẩm cầu thang nghệ thuật uốn cong tự do với các bậc thang ốp đá Panda White. Sự đối lập mãnh liệt giữa nền trắng tinh và các vệt đen tuyền tạo hiệu ứng thị giác dòng thác đổ cuồn cuộn giữa lòng kiến trúc.'
    },
    {
      title: 'Cầu Thang Hoàng Gia Cẩm Thạch Carrara Phối Viền Đá Đen Kim Sa',
      image_url: '/assets/album/album_stair_02.jpg',
      category: 'Cầu Thang',
      project_name: 'Lâu Đài Cổ Điển Nam Cường Hải Phòng',
      stone_name: 'Carrara White Marble & Black Galaxy',
      description: 'Hệ cầu thang tam cấp bề thế với từng mũi bậc thang được bo tròn chỉ cong R15 thủ công tỉ mỉ. Viền đá đen kim sa bao quanh nền trắng Carrara định hình nhịp bước chân vững chãi và quyền quý.'
    },
    {
      title: 'Master Spa Phòng Tắm Tổng Thống Ốp Toàn Diện Calacatta Gold',
      image_url: '/assets/album/album_bath_01.jpg',
      category: 'Master Spa',
      project_name: 'The Peak Midtown Phú Mỹ Hưng',
      stone_name: 'Calacatta Gold Marble Ý',
      description: 'Không gian phòng tắm master đẳng cấp khách sạn 6 sao với các vách đá Calacatta Gold ghép vân đối xứng liên tục quanh bồn tắm massage ngắm nhìn công viên. Khả năng chống thấm 5 lớp công nghệ Nano giúp đá duy trì độ sáng bóng vĩnh cửu.'
    },
    {
      title: 'Phòng Tắm Thư Giãn Phong Cách Onsen Với Đá Sa Thạch & Granit Đen',
      image_url: '/assets/album/album_bath_02.jpg',
      category: 'Master Spa',
      project_name: 'Biệt Thự Zen Villa Tam Đảo',
      stone_name: 'Black Taurus Granite & Travertine',
      description: 'Không gian tắm trị liệu hướng thiên nhiên kết hợp giữa vẻ thô mộc ấm áp của Travertine tự nhiên và sự vững chắc của đá granite Black Taurus xử lý mặt da Leather finish chống trơn trượt hoàn hảo trong môi trường ẩm ướt.'
    },
    {
      title: 'Phòng Tắm Kính Master Suite Ốp Thạch Anh Xanh Ngọc Biển Amazonite',
      image_url: '/assets/album/album_bath_03.jpg',
      category: 'Master Spa',
      project_name: 'Biệt Thự Mũi Né Oceanfront',
      stone_name: 'Amazonite Exotic Granite Brazil',
      description: 'Tông xanh ngọc lam lam ngọc bích của đá Amazonite hòa cùng ánh nắng đại dương qua vách kính trong suốt. Từng mảng vân thạch anh trắng lấp lánh mang hơi thở biển nhiệt đới thuần khiết vào từng khoảnh khắc nghỉ dưỡng của chủ nhân.'
    },
    {
      title: 'Mặt Tiền Dinh Thự Cổ Điển Ốp Đá Travertine La Mã Nguyên Khối',
      image_url: '/assets/album/album_facade_01.jpg',
      category: 'Mặt Tiền',
      project_name: 'Dinh Thự Ven Sông Thảo Điền',
      stone_name: 'Travertine Romano Classico Italy',
      description: 'Kiến trúc mặt tiền trường tồn cùng thời gian với 100% diện tích ốp đá Travertine La Mã nhập khẩu trực tiếp từ vùng Tivoli nước Ý. Cấu trúc hang hốc tự nhiên và gam màu be cát vàng tạo nét đẹp hoài niệm, sang trọng và cách nhiệt tối ưu.'
    },
    {
      title: 'Đại Cổng & Sảnh Đón Biệt Thự Hiện Đại Đá Granite Titanium Gold',
      image_url: '/assets/album/album_facade_02.jpg',
      category: 'Mặt Tiền',
      project_name: 'Villa Star Hill Phú Quốc',
      stone_name: 'Titanium Gold Granite Brazil',
      description: 'Cổng vòm và diện tường mặt tiền sử dụng đá granite Titanium Gold dày 30mm gia cố hệ khung inox 316 chịu đựng hoàn hảo gió biển và muối mặn. Các dải vân vàng đồng kim loại phản chiếu ánh hoàng hôn tạo diện mạo uy nghiêm lộng lẫy.'
    },
    {
      title: 'Phòng Tiệc Đại Yến Với Bàn Ăn 24 Ghế Đá Cẩm Thạch Rosa Zarci',
      image_url: '/assets/album/album_dining_01.jpg',
      category: 'Phòng Ăn',
      project_name: 'Dinh Thự Tổng Lãnh Sự Thụy Sĩ',
      stone_name: 'Rosa Zarci Luxury Marble Tây Ban Nha',
      description: 'Mặt bàn đại tiệc dài 6.8m được ghép nối liền mạch từ hai tấm đá Rosa Zarci với sắc hồng phấn hoàng gia dịu dàng và những dải vân thạch anh xám tro. Không gian toát lên vẻ trang nhã, ấm áp lý tưởng cho những buổi tiếp khách thượng lưu.'
    },
    {
      title: 'Hành Lang Nghệ Thuật & Vách Ngăn Thạch Anh Fusion Wow Đa Sắc',
      image_url: '/assets/album/album_hall_01.jpg',
      category: 'Phòng Khách',
      project_name: 'Penthouse King Palace Hà Nội',
      stone_name: 'Fusion Wow Multi Quartzite Brazil',
      description: 'Hành lang trưng bày tranh và cổ vật được trang hoàng bằng vách đá thạch anh Fusion Wow với những dải sóng màu lam ngọc, gỉ sắt, hổ phách và bạch ngọc cuộn trào mãnh liệt. Đây là minh chứng hùng hồn cho bàn tay sáng tạo vô song của Mẹ Thiên Nhiên.'
    }
  ];

  for (const ph of curatedAlbumPhotos) {
    insertAlbumPhoto.run({
      title: ph.title,
      image_url: ph.image_url,
      category: ph.category,
      project_name: ph.project_name,
      stone_name: ph.stone_name,
      description: ph.description,
      sort_order: sortOrder++
    });
    totalAlbumPhotos++;
  }

  // Khởi tạo Cấu hình Hệ thống & Thương hiệu mặc định nếu chưa tồn tại
  const insertSetting = db.prepare('INSERT OR IGNORE INTO cau_hinh_he_thong (key, value) VALUES (?, ?)');
  const defaultSettings = [
    ['logo_url', '/uploads/qs_1788947224644_QUEENSTONE.png'],
    ['company_name', 'CÔNG TY CỔ PHẦN THƯƠNG MẠI NỮ HOÀNG'],
    ['hotline', '0988.456.789'],
    ['email', 'contact@queenstone.vn'],
    ['gio_mo_cua', '08:00 — 18:30 hàng ngày'],
    ['dia_chi_tru_so', 'Số 140, đường Bạch Đằng 2, Phường Thủy Nguyên, TP Hải Phòng, Việt Nam.'],
    ['map_embed_url', 'https://maps.google.com/maps?q=20.9227635,106.6617997&z=16&output=embed'],
    ['google_map_search_url', 'https://maps.app.goo.gl/RcmrNd2msAgEujqJA'],
    ['headquarters_image', '/assets/branches/branch_tru_so_chinh.jpg']
  ];
  for (const [key, val] of defaultSettings) {
    insertSetting.run(key, val);
  }

  console.log(`✅ Đã nạp thành công: ${stones.length} lô đá, ${projects.length} công trình lookbook, ${depots.length} tổng kho, ${totalAlbumPhotos} ảnh vào kho Album đá tự nhiên và cấu hình hệ thống!`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
