/**
 * STONE PRODUCT DOMAIN SERVICE
 * Queen Stone Lab 03 - Vibe Coding Framework v5.0
 * Xử lý truy vấn danh mục đá, bộ lọc đa chiều, sắp xếp mới nhất,
 * gắn cờ New nhấp nháy cho top 6, trạng thái hết hàng và xuất kho atomic.
 */

const { getDb } = require('../src/db/database');
const { buildZaloConsultationLink } = require('./zalo-service');

class StoneService {
  constructor(db) {
    this.db = db || getDb();
  }

  /**
   * Lấy danh sách ID của đúng 6 sản phẩm được Up sau cùng trên toàn hệ thống
   */
  getTop6NewestIds() {
    const rows = this.db.prepare(`
      SELECT id FROM san_pham_da
      ORDER BY created_at DESC, id DESC
      LIMIT 6
    `).all();
    return new Set(rows.map(r => r.id));
  }

  /**
   * Danh sách đá có phân trang, bộ lọc và sắp xếp sản phẩm mới nhất lên đầu
   */
  listStones({ category, color, application, page = 1, limit = 9, search = '' } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = {};

    // Lọc theo Chủng loại (Marble, Quartzite, Granite, Onyx)
    if (category && category !== 'all' && category !== 'Tất Cả') {
      conditions.push('LOWER(loai_da) = LOWER(@category)');
      params.category = category;
    }

    // Lọc theo Màu sắc (Trắng, Đen, Xanh, Vàng)
    if (color && color !== 'all' && color !== 'Tất Cả') {
      conditions.push('LOWER(mau_sac) = LOWER(@color)');
      params.color = color;
    }

    // Lọc theo Ứng dụng kiến trúc (Mặt Tiền, Vách Phòng Khách, Đảo Bếp, Sàn Sảnh, Cầu Thang)
    if (application && application !== 'all' && application !== 'Tất Cả') {
      conditions.push('ung_dung LIKE @application');
      params.application = `%${application}%`;
    }

    // Tìm kiếm theo từ khóa
    if (search && search.trim()) {
      conditions.push('(ten_da LIKE @search OR ma_lo LIKE @search OR xuat_xu LIKE @search)');
      params.search = `%${search.trim()}%`;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Đếm tổng số bản ghi thỏa mãn điều kiện lọc
    const countStmt = this.db.prepare(`SELECT COUNT(*) as total FROM san_pham_da ${whereClause}`);
    const { total } = countStmt.get(params);

    // Truy vấn dữ liệu: SẮP XẾP SẢN PHẨM UP SAU CÙNG THÌ HIỆN LÊN TRÊN CÙNG
    const queryStmt = this.db.prepare(`
      SELECT * FROM san_pham_da
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT @limit OFFSET @offset
    `);

    const rows = queryStmt.all({ ...params, limit: limitNum, offset });
    const top6NewestIds = this.getTop6NewestIds();

    const items = rows.map(row => {
      const is_out_of_stock = row.so_luong_tam <= 0 || row.dien_tich_m2 <= 0;
      const is_new = top6NewestIds.has(row.id);
      const zalo = buildZaloConsultationLink(row);

      return {
        ...row,
        is_new, // 6 sản phẩm Up sau cùng có cờ is_new = true (nhấp nháy New)
        is_out_of_stock, // Số lượng = 0 thì ghi Hết hàng
        status_badge: is_out_of_stock ? 'HẾT HÀNG' : 'CÒN HÀNG',
        formatted_stock: is_out_of_stock ? 'Hết hàng (0 m²)' : `Còn ${row.dien_tich_m2} m² (${row.so_luong_tam} tấm)`,
        zalo_link: zalo.zalo_url,
        prefilled_zalo: zalo.prefilled_message
      };
    });

    const has_more = offset + items.length < total;

    return {
      success: true,
      data: {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        has_more, // Phục vụ cơ chế Cuộn Vô Tận (Infinite Scroll)
        total_pages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Lấy chi tiết 1 tấm đá theo Mã lô hoặc ID
   */
  getStoneByLotOrId(identifier) {
    let row;
    if (typeof identifier === 'number' || /^\d+$/.test(identifier)) {
      row = this.db.prepare('SELECT * FROM san_pham_da WHERE id = ?').get(identifier);
    } else {
      row = this.db.prepare('SELECT * FROM san_pham_da WHERE UPPER(ma_lo) = UPPER(?)').get(identifier);
    }

    if (!row) {
      return {
        success: false,
        code: 'STONE_NOT_FOUND',
        message: `Không tìm thấy lô đá với mã: ${identifier}`
      };
    }

    const top6NewestIds = this.getTop6NewestIds();
    const is_out_of_stock = row.so_luong_tam <= 0 || row.dien_tich_m2 <= 0;
    const is_new = top6NewestIds.has(row.id);
    const zalo = buildZaloConsultationLink(row);

    // Lấy thông tin tổng kho lưu giữ
    const depot = this.db.prepare('SELECT * FROM showroom_kho WHERE id = ?').get(row.kho_id) || {};

    return {
      success: true,
      data: {
        ...row,
        is_new,
        is_out_of_stock,
        status_badge: is_out_of_stock ? 'HẾT HÀNG' : 'CÒN HÀNG',
        formatted_stock: is_out_of_stock ? 'Hết hàng (0 m²)' : `Còn ${row.dien_tich_m2} m² (${row.so_luong_tam} tấm)`,
        depot,
        zalo_link: zalo.zalo_url,
        prefilled_zalo: zalo.prefilled_message
      }
    };
  }

  /**
   * Xuất kho đá (Thủ kho bảo vệ bằng mã PIN, giao dịch ACID Atomic)
   */
  exportStone({ ma_lo, so_tam, pin, nguoi_xuat = 'Thủ Kho Queen Stone', ten_cong_trinh, ghi_chu = '' } = {}) {
    const validPin = process.env.ADMIN_PIN || '1234';
    if (!pin || String(pin) !== String(validPin)) {
      return {
        success: false,
        code: 'INVALID_PIN',
        message: 'Mã PIN bảo mật quản trị kho không chính xác.'
      };
    }

    const soTamXuat = parseInt(so_tam, 10);
    if (!soTamXuat || soTamXuat <= 0) {
      return {
        success: false,
        code: 'INVALID_QUANTITY',
        message: 'Số lượng tấm xuất kho phải lớn hơn 0.'
      };
    }

    if (!ten_cong_trinh || !ten_cong_trinh.trim()) {
      return {
        success: false,
        code: 'MISSING_PROJECT_NAME',
        message: 'Vui lòng cung cấp tên công trình tiếp nhận đá.'
      };
    }

    // Thực hiện giao dịch nguyên khối (ACID Transaction)
    const exportTransaction = this.db.transaction(() => {
      const stone = this.db.prepare('SELECT * FROM san_pham_da WHERE UPPER(ma_lo) = UPPER(?)').get(ma_lo);
      if (!stone) {
        throw new Error(`STONE_NOT_FOUND: Không tìm thấy lô đá ${ma_lo}`);
      }

      if (stone.so_luong_tam < soTamXuat) {
        throw new Error(`INSUFFICIENT_STOCK: Tồn kho chỉ còn ${stone.so_luong_tam} tấm, không đủ xuất ${soTamXuat} tấm.`);
      }

      const dienTichPerTam = stone.so_luong_tam > 0 ? (stone.dien_tich_m2 / stone.so_luong_tam) : 0;
      const dienTichXuat = Math.round(dienTichPerTam * soTamXuat * 100) / 100;

      const soTamConLai = stone.so_luong_tam - soTamXuat;
      const dienTichConLai = Math.max(0, Math.round((stone.dien_tich_m2 - dienTichXuat) * 100) / 100);

      // 1. Giảm tồn kho thực tế
      this.db.prepare(`
        UPDATE san_pham_da
        SET so_luong_tam = ?, dien_tich_m2 = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(soTamConLai, dienTichConLai, stone.id);

      // 2. Ghi nhật ký Audit Log
      const maPhieu = `XK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
      this.db.prepare(`
        INSERT INTO lich_su_xuat_kho (ma_phieu, ma_lo, so_tam_xuat, dien_tich_xuat_m2, ten_cong_trinh, nguoi_xuat, ghi_chu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(maPhieu, stone.ma_lo, soTamXuat, dienTichXuat, ten_cong_trinh.trim(), nguoi_xuat, ghi_chu);

      return {
        ma_phieu: maPhieu,
        ma_lo: stone.ma_lo,
        ten_da: stone.ten_da,
        so_tam_xuat: soTamXuat,
        dien_tich_xuat: dienTichXuat,
        so_tam_con_lai: soTamConLai,
        dien_tich_con_lai: dienTichConLai,
        ten_cong_trinh: ten_cong_trinh.trim(),
        trang_thai: soTamConLai === 0 ? 'ĐÃ HẾT HÀNG' : 'CÒN HÀNG'
      };
    });

    try {
      const result = exportTransaction();
      return {
        success: true,
        message: `Xuất kho thành công lô ${result.ma_lo}! Tồn kho còn lại: ${result.so_tam_con_lai} tấm (${result.dien_tich_con_lai} m²).`,
        data: result
      };
    } catch (err) {
      return {
        success: false,
        code: 'TRANSACTION_FAILED',
        message: err.message.replace(/^Error: /, '')
      };
    }
  }

  /**
   * Lấy thống kê quản trị kho
   */
  getWarehouseStats() {
    const totalStones = this.db.prepare('SELECT COUNT(*) as count, SUM(so_luong_tam) as total_tam, SUM(dien_tich_m2) as total_m2 FROM san_pham_da').get();
    const outOfStock = this.db.prepare('SELECT COUNT(*) as count FROM san_pham_da WHERE so_luong_tam <= 0').get();
    const activeDepots = this.db.prepare('SELECT COUNT(*) as count FROM showroom_kho').get();
    const recentLogs = this.db.prepare(`
      SELECT l.*, s.ten_da
      FROM lich_su_xuat_kho l
      JOIN san_pham_da s ON l.ma_lo = s.ma_lo
      ORDER BY l.ngay_xuat DESC
      LIMIT 10
    `).all();

    return {
      success: true,
      data: {
        tong_so_lo_da: totalStones.count,
        tong_so_tam: totalStones.total_tam || 0,
        tong_dien_tich_m2: Math.round((totalStones.total_m2 || 0) * 10) / 10,
        so_lo_het_hang: outOfStock.count,
        so_kho_hoat_dong: activeDepots.count,
        lich_su_gan_nhat: recentLogs
      }
    };
  }

  /* ==========================================================================
     CÁC PHƯƠNG THỨC QUẢN TRỊ VIÊN (ADMIN PORTAL CRUD)
     ========================================================================== */

  /**
   * 1. Lấy toàn bộ cấu hình hệ thống & thương hiệu
   */
  getSettings() {
    try {
      const rows = this.db.prepare('SELECT key, value FROM cau_hinh_he_thong').all();
      const settings = {};
      rows.forEach(r => { settings[r.key] = r.value; });
      return { success: true, data: settings };
    } catch (e) {
      return { success: false, message: 'Lỗi truy xuất cấu hình: ' + e.message };
    }
  }

  /**
   * 1b. Cập nhật cấu hình hệ thống & thương hiệu
   */
  updateSettings(settingsObj) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO cau_hinh_he_thong (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      const updateMany = this.db.transaction((obj) => {
        for (const [key, val] of Object.entries(obj)) {
          if (val !== undefined && val !== null) {
            stmt.run(key, String(val).trim());
          }
        }
      });
      updateMany(settingsObj);
      return this.getSettings();
    } catch (e) {
      return { success: false, message: 'Lỗi cập nhật cấu hình: ' + e.message };
    }
  }

  /**
   * 2. Quản lý Phiến Đá Tự Nhiên Độc Bản: Thêm mới
   */
  createStone(data) {
    try {
      const {
        ma_lo, ten_da, loai_da, mau_sac, xuat_xu,
        chieu_dai_mm, chieu_rong_mm, do_day_mm = 20, be_mat = 'Polished (Bóng gương)',
        ung_dung, so_luong_tam = 0, hinh_anh_slab, hinh_anh_macro, kho_id = 'KHO_SG_01', mo_ta = ''
      } = data;

      if (!ma_lo || !ten_da || !loai_da || !mau_sac || !chieu_dai_mm || !chieu_rong_mm) {
        return { success: false, code: 'VALIDATION_ERROR', message: 'Thiếu các trường bắt buộc (Mã lô, Tên đá, Chủng loại, Màu sắc, Kích thước).' };
      }

      // Kiểm tra trùng mã lô
      const existing = this.db.prepare('SELECT id FROM san_pham_da WHERE ma_lo = ?').get(ma_lo.trim().toUpperCase());
      if (existing) {
        return { success: false, code: 'DUPLICATE_CODE', message: `Mã lô "${ma_lo}" đã tồn tại trên hệ thống!` };
      }

      const dai = parseInt(chieu_dai_mm, 10);
      const rong = parseInt(chieu_rong_mm, 10);
      const day = parseInt(do_day_mm, 10) || 20;
      const soTam = parseInt(so_luong_tam, 10) || 0;
      const dienTich = data.dien_tich_m2 !== undefined && data.dien_tich_m2 !== null && data.dien_tich_m2 !== ''
        ? parseFloat(data.dien_tich_m2)
        : Math.round(((dai * rong) / 1000000) * soTam * 100) / 100;

      const result = this.db.prepare(`
        INSERT INTO san_pham_da (
          ma_lo, ten_da, loai_da, mau_sac, xuat_xu,
          chieu_dai_mm, chieu_rong_mm, do_day_mm, be_mat,
          ung_dung, so_luong_tam, dien_tich_m2,
          hinh_anh_slab, hinh_anh_macro, kho_id, mo_ta, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `).run(
        ma_lo.trim().toUpperCase(),
        ten_da.trim(),
        loai_da.trim(),
        mau_sac.trim(),
        xuat_xu ? xuat_xu.trim() : 'Ý',
        dai,
        rong,
        day,
        be_mat.trim(),
        ung_dung ? ung_dung.trim() : 'Vách Phòng Khách, Đảo Bếp',
        soTam,
        dienTich,
        hinh_anh_slab ? hinh_anh_slab.trim() : '/assets/hero_slides/slide_01_foyer_emerald.jpg',
        hinh_anh_macro ? hinh_anh_macro.trim() : (hinh_anh_slab || '/assets/hero_slides/slide_01_foyer_emerald.jpg'),
        kho_id.trim(),
        mo_ta ? mo_ta.trim() : ''
      );

      const created = this.db.prepare('SELECT * FROM san_pham_da WHERE id = ?').get(result.lastInsertRowid);
      return { success: true, message: 'Thêm mới phiến đá độc bản thành công!', data: created };
    } catch (e) {
      return { success: false, message: 'Lỗi thêm mới phiến đá: ' + e.message };
    }
  }

  /**
   * 2b. Cập nhật thông tin phiến đá & lượng tồn kho
   */
  updateStone(id, data) {
    try {
      const stone = this.db.prepare('SELECT * FROM san_pham_da WHERE id = ?').get(id);
      if (!stone) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy phiến đá với ID: ' + id };
      }

      const ma_lo = data.ma_lo !== undefined ? data.ma_lo.trim().toUpperCase() : stone.ma_lo;
      if (ma_lo !== stone.ma_lo) {
        const duplicate = this.db.prepare('SELECT id FROM san_pham_da WHERE ma_lo = ? AND id != ?').get(ma_lo, id);
        if (duplicate) {
          return { success: false, code: 'DUPLICATE_CODE', message: `Mã lô "${ma_lo}" đã được sử dụng bởi phiến đá khác!` };
        }
      }

      const ten_da = data.ten_da !== undefined ? data.ten_da.trim() : stone.ten_da;
      const loai_da = data.loai_da !== undefined ? data.loai_da.trim() : stone.loai_da;
      const mau_sac = data.mau_sac !== undefined ? data.mau_sac.trim() : stone.mau_sac;
      const xuat_xu = data.xuat_xu !== undefined ? data.xuat_xu.trim() : stone.xuat_xu;
      const chieu_dai_mm = data.chieu_dai_mm !== undefined ? parseInt(data.chieu_dai_mm, 10) : stone.chieu_dai_mm;
      const chieu_rong_mm = data.chieu_rong_mm !== undefined ? parseInt(data.chieu_rong_mm, 10) : stone.chieu_rong_mm;
      const do_day_mm = data.do_day_mm !== undefined ? parseInt(data.do_day_mm, 10) : stone.do_day_mm;
      const be_mat = data.be_mat !== undefined ? data.be_mat.trim() : stone.be_mat;
      const ung_dung = data.ung_dung !== undefined ? data.ung_dung.trim() : stone.ung_dung;
      const so_luong_tam = data.so_luong_tam !== undefined ? Math.max(0, parseInt(data.so_luong_tam, 10)) : stone.so_luong_tam;
      let dien_tich_m2 = stone.dien_tich_m2;
      if (data.dien_tich_m2 !== undefined && data.dien_tich_m2 !== null && data.dien_tich_m2 !== '') {
        dien_tich_m2 = parseFloat(data.dien_tich_m2);
      } else if (data.so_luong_tam !== undefined && data.dien_tich_m2 === undefined) {
        dien_tich_m2 = Math.round(((chieu_dai_mm * chieu_rong_mm) / 1000000) * so_luong_tam * 100) / 100;
      }
      const hinh_anh_slab = data.hinh_anh_slab !== undefined ? data.hinh_anh_slab.trim() : stone.hinh_anh_slab;
      const hinh_anh_macro = data.hinh_anh_macro !== undefined ? data.hinh_anh_macro.trim() : stone.hinh_anh_macro;
      const kho_id = data.kho_id !== undefined ? data.kho_id.trim() : stone.kho_id;
      const mo_ta = data.mo_ta !== undefined ? data.mo_ta.trim() : stone.mo_ta;

      this.db.prepare(`
        UPDATE san_pham_da
        SET ma_lo = ?, ten_da = ?, loai_da = ?, mau_sac = ?, xuat_xu = ?,
            chieu_dai_mm = ?, chieu_rong_mm = ?, do_day_mm = ?, be_mat = ?,
            ung_dung = ?, so_luong_tam = ?, dien_tich_m2 = ?,
            hinh_anh_slab = ?, hinh_anh_macro = ?, kho_id = ?, mo_ta = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        ma_lo, ten_da, loai_da, mau_sac, xuat_xu,
        chieu_dai_mm, chieu_rong_mm, do_day_mm, be_mat,
        ung_dung, so_luong_tam, dien_tich_m2,
        hinh_anh_slab, hinh_anh_macro, kho_id, mo_ta,
        id
      );

      const updated = this.db.prepare('SELECT * FROM san_pham_da WHERE id = ?').get(id);
      return { success: true, message: `Cập nhật phiến đá ${ma_lo} thành công! Lượng tồn: ${so_luong_tam} tấm (${dien_tich_m2} m²).`, data: updated };
    } catch (e) {
      return { success: false, message: 'Lỗi cập nhật phiến đá: ' + e.message };
    }
  }

  /**
   * 2c. Xóa phiến đá độc bản
   */
  deleteStone(id) {
    try {
      const stone = this.db.prepare('SELECT * FROM san_pham_da WHERE id = ?').get(id);
      if (!stone) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy phiến đá với ID: ' + id };
      }

      this.db.prepare('DELETE FROM san_pham_da WHERE id = ?').run(id);
      return { success: true, message: `Đã xóa phiến đá ${stone.ma_lo} (${stone.ten_da}) thành công!` };
    } catch (e) {
      return { success: false, message: 'Lỗi khi xóa phiến đá: ' + e.message };
    }
  }

  /**
   * 3. Quản lý Album Ảnh Đá: Sửa ảnh
   */
  updateAlbumPhoto(id, data) {
    try {
      const photo = this.db.prepare('SELECT * FROM album_photos WHERE id = ?').get(id);
      if (!photo) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy ảnh trong Album với ID: ' + id };
      }

      const title = data.title !== undefined ? data.title.trim() : photo.title;
      const image_url = data.image_url !== undefined ? data.image_url.trim() : photo.image_url;
      const category = data.category !== undefined ? data.category.trim() : photo.category;
      const project_name = data.project_name !== undefined ? data.project_name.trim() : photo.project_name;
      const stone_name = data.stone_name !== undefined ? data.stone_name.trim() : photo.stone_name;
      const description = data.description !== undefined ? data.description.trim() : photo.description;
      const sort_order = data.sort_order !== undefined ? parseInt(data.sort_order, 10) : photo.sort_order;

      this.db.prepare(`
        UPDATE album_photos
        SET title = ?, image_url = ?, category = ?, project_name = ?,
            stone_name = ?, description = ?, sort_order = ?
        WHERE id = ?
      `).run(title, image_url, category, project_name, stone_name, description, sort_order, id);

      const updated = this.db.prepare('SELECT * FROM album_photos WHERE id = ?').get(id);
      return { success: true, message: 'Cập nhật ảnh Album thành công!', data: updated };
    } catch (e) {
      return { success: false, message: 'Lỗi cập nhật ảnh Album: ' + e.message };
    }
  }

  /**
   * 3b. Xóa ảnh khỏi Album
   */
  deleteAlbumPhoto(id) {
    try {
      const photo = this.db.prepare('SELECT * FROM album_photos WHERE id = ?').get(id);
      if (!photo) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy ảnh trong Album với ID: ' + id };
      }

      this.db.prepare('DELETE FROM album_photos WHERE id = ?').run(id);
      return { success: true, message: `Đã xóa ảnh "${photo.title}" khỏi Album thành công!` };
    } catch (e) {
      return { success: false, message: 'Lỗi khi xóa ảnh Album: ' + e.message };
    }
  }

  /**
   * 4. Quản lý Showroom: Thêm showroom mới (Hỗ trợ thêm vô hạn)
   */
  createDepot(data) {
    try {
      const {
        id, ten_co_so, loai, dia_chi, hotline,
        email = 'contact@queenstone.vn', gio_mo_cua = '08:00 — 18:30 hàng ngày',
        suc_chua_m2 = 10000, thiet_bi = 'Cẩu trục chuyên dụng', hinh_anh,
        google_map_url, google_map_embed_url, raw_map_link
      } = data;

      if (!ten_co_so || !dia_chi || !hotline) {
        return { success: false, code: 'VALIDATION_ERROR', message: 'Vui lòng điền tên cơ sở, địa chỉ và hotline showroom.' };
      }

      const depotId = id && id.trim() ? id.trim() : `SHOWROOM_${Date.now().toString().slice(-6)}`;
      const existing = this.db.prepare('SELECT id FROM showroom_kho WHERE id = ?').get(depotId);
      if (existing) {
        return { success: false, code: 'DUPLICATE_ID', message: `Mã cơ sở "${depotId}" đã tồn tại.` };
      }

      this.db.prepare(`
        INSERT INTO showroom_kho (
          id, ten_co_so, loai, dia_chi, hotline, email,
          gio_mo_cua, suc_chua_m2, thiet_bi, hinh_anh,
          google_map_url, google_map_embed_url, raw_map_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        depotId,
        ten_co_so.trim(),
        loai ? loai.trim() : 'Showroom Trưng Bày',
        dia_chi.trim(),
        hotline.trim(),
        email.trim(),
        gio_mo_cua.trim(),
        parseInt(suc_chua_m2, 10) || 10000,
        thiet_bi ? thiet_bi.trim() : '',
        hinh_anh ? hinh_anh.trim() : '/assets/branches/branch_tru_so_chinh.jpg',
        google_map_url ? google_map_url.trim() : '',
        google_map_embed_url ? google_map_embed_url.trim() : '',
        raw_map_link ? raw_map_link.trim() : ''
      );

      const created = this.db.prepare('SELECT * FROM showroom_kho WHERE id = ?').get(depotId);
      return { success: true, message: `Thêm showroom "${ten_co_so}" thành công!`, data: created };
    } catch (e) {
      return { success: false, message: 'Lỗi thêm showroom mới: ' + e.message };
    }
  }

  /**
   * 4b. Cập nhật Showroom
   */
  updateDepot(id, data) {
    try {
      const depot = this.db.prepare('SELECT * FROM showroom_kho WHERE id = ?').get(id);
      if (!depot) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy Showroom với mã: ' + id };
      }

      const ten_co_so = data.ten_co_so !== undefined ? data.ten_co_so.trim() : depot.ten_co_so;
      const loai = data.loai !== undefined ? data.loai.trim() : depot.loai;
      const dia_chi = data.dia_chi !== undefined ? data.dia_chi.trim() : depot.dia_chi;
      const hotline = data.hotline !== undefined ? data.hotline.trim() : depot.hotline;
      const email = data.email !== undefined ? data.email.trim() : depot.email;
      const gio_mo_cua = data.gio_mo_cua !== undefined ? data.gio_mo_cua.trim() : depot.gio_mo_cua;
      const suc_chua_m2 = data.suc_chua_m2 !== undefined ? parseInt(data.suc_chua_m2, 10) : depot.suc_chua_m2;
      const thiet_bi = data.thiet_bi !== undefined ? data.thiet_bi.trim() : depot.thiet_bi;
      const hinh_anh = data.hinh_anh !== undefined ? data.hinh_anh.trim() : depot.hinh_anh;
      const google_map_url = data.google_map_url !== undefined ? data.google_map_url.trim() : depot.google_map_url;
      const google_map_embed_url = data.google_map_embed_url !== undefined ? data.google_map_embed_url.trim() : depot.google_map_embed_url;
      const raw_map_link = data.raw_map_link !== undefined ? data.raw_map_link.trim() : depot.raw_map_link;

      this.db.prepare(`
        UPDATE showroom_kho
        SET ten_co_so = ?, loai = ?, dia_chi = ?, hotline = ?, email = ?,
            gio_mo_cua = ?, suc_chua_m2 = ?, thiet_bi = ?, hinh_anh = ?,
            google_map_url = ?, google_map_embed_url = ?, raw_map_link = ?
        WHERE id = ?
      `).run(
        ten_co_so, loai, dia_chi, hotline, email,
        gio_mo_cua, suc_chua_m2, thiet_bi, hinh_anh,
        google_map_url, google_map_embed_url, raw_map_link,
        id
      );

      const updated = this.db.prepare('SELECT * FROM showroom_kho WHERE id = ?').get(id);
      return { success: true, message: `Cập nhật thông tin showroom "${ten_co_so}" thành công!`, data: updated };
    } catch (e) {
      return { success: false, message: 'Lỗi cập nhật showroom: ' + e.message };
    }
  }

  /**
   * 4c. Xóa Showroom
   */
  deleteDepot(id) {
    try {
      const depot = this.db.prepare('SELECT * FROM showroom_kho WHERE id = ?').get(id);
      if (!depot) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy Showroom với mã: ' + id };
      }

      this.db.prepare('DELETE FROM showroom_kho WHERE id = ?').run(id);
      return { success: true, message: `Đã xóa cơ sở "${depot.ten_co_so}" thành công!` };
    } catch (e) {
      return { success: false, message: 'Lỗi khi xóa showroom: ' + e.message };
    }
  }
}

module.exports = {
  StoneService,
  stoneService: new StoneService()
};
