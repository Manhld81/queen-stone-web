-- ============================================================================
-- QUEEN STONE DATABASE SCHEMA (SQLite WAL Mode)
-- Chuẩn kiến trúc Queen Stone Lab 03 - Vibe Coding v5.0
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Bảng Sản phẩm Đá Tự Nhiên & Lô hàng
CREATE TABLE IF NOT EXISTS san_pham_da (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_lo TEXT UNIQUE NOT NULL,
    ten_da TEXT NOT NULL,
    loai_da TEXT NOT NULL, -- Marble, Quartzite, Granite, Onyx
    mau_sac TEXT NOT NULL, -- Trắng, Đen, Xanh, Vàng
    xuat_xu TEXT NOT NULL, -- Carrara (Ý), Brazil, Hy Lạp, Tây Ban Nha, Iran
    chieu_dai_mm INTEGER NOT NULL,
    chieu_rong_mm INTEGER NOT NULL,
    do_day_mm INTEGER NOT NULL DEFAULT 20,
    be_mat TEXT NOT NULL DEFAULT 'Polished (Bóng gương)',
    ung_dung TEXT NOT NULL, -- Mặt Tiền, Vách Phòng Khách, Đảo Bếp, Sàn Sảnh, Cầu Thang
    so_luong_tam INTEGER NOT NULL DEFAULT 0,
    dien_tich_m2 REAL NOT NULL DEFAULT 0.0,
    hinh_anh_slab TEXT NOT NULL,
    hinh_anh_macro TEXT NOT NULL,
    kho_id TEXT NOT NULL DEFAULT 'KHO_SG_01',
    mo_ta TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chỉ mục tối ưu truy vấn bộ lọc và sắp xếp
CREATE INDEX IF NOT EXISTS idx_san_pham_created ON san_pham_da(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_san_pham_loai ON san_pham_da(loai_da);
CREATE INDEX IF NOT EXISTS idx_san_pham_mau ON san_pham_da(mau_sac);

-- Bảng Nhật ký Xuất kho (Audit Log)
CREATE TABLE IF NOT EXISTS lich_su_xuat_kho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_phieu TEXT UNIQUE NOT NULL,
    ma_lo TEXT NOT NULL,
    so_tam_xuat INTEGER NOT NULL,
    dien_tich_xuat_m2 REAL NOT NULL,
    ten_cong_trinh TEXT NOT NULL,
    nguoi_xuat TEXT NOT NULL DEFAULT 'Thủ Kho Queen Stone',
    ghi_chu TEXT,
    ngay_xuat DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_lo) REFERENCES san_pham_da(ma_lo)
);

-- Bảng Công trình Thực tế (Lookbook)
CREATE TABLE IF NOT EXISTS cong_trinh (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_cong_trinh TEXT NOT NULL,
    dia_diem TEXT NOT NULL,
    loai_hinh TEXT NOT NULL, -- Dinh Thự, Biệt Thự, Penthouse, Lâu Đài
    dien_tich TEXT DEFAULT '1200 m²',
    hinh_anh TEXT NOT NULL,
    da_su_dung TEXT NOT NULL,
    mo_ta TEXT,
    nam_hoan_thanh INTEGER DEFAULT 2025,
    album_json TEXT
);

-- Bảng Hệ thống Showroom & Tổng kho toàn quốc
CREATE TABLE IF NOT EXISTS showroom_kho (
    id TEXT PRIMARY KEY,
    ten_co_so TEXT NOT NULL,
    loai TEXT NOT NULL, -- Trụ Sở Chính Toàn Quốc, Showroom 1 - Miền Bắc, ...
    dia_chi TEXT NOT NULL,
    hotline TEXT NOT NULL,
    email TEXT DEFAULT 'contact@queenstone.vn',
    gio_mo_cua TEXT NOT NULL,
    suc_chua_m2 INTEGER DEFAULT 15000,
    thiet_bi TEXT,
    hinh_anh TEXT,
    google_map_url TEXT,
    google_map_embed_url TEXT,
    raw_map_link TEXT
);

-- Bảng Thư viện Album Ảnh Đá Tự Nhiên (Vô Hạn Ảnh Công Trình Thực Tế)
CREATE TABLE IF NOT EXISTS album_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Đại Sảnh', -- Đại Sảnh, Phòng Khách, Khu Bếp, Cầu Thang, Master Spa, Mặt Tiền
    project_name TEXT DEFAULT 'Dinh Thự Hoàng Gia',
    stone_name TEXT DEFAULT 'Cẩm thạch Marble Ý',
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Cấu hình Hệ thống & Thương hiệu (Website Settings)
CREATE TABLE IF NOT EXISTS cau_hinh_he_thong (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

