/**
 * DATABASE ENGINE (better-sqlite3) - WAL MODE
 * Queen Stone Lab 03 - Vibe Coding Framework v5.0
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'queen_stone.db');

let db;

function getDb(customPath) {
  if (db && !customPath) return db;

  const targetPath = customPath || DB_PATH;
  const instance = new Database(targetPath);

  // Kích hoạt WAL mode & Foreign Keys theo chuẩn Vibe Coding
  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');
  instance.pragma('synchronous = NORMAL');

  // Khởi chạy schema nếu chưa có bảng
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    instance.exec(schemaSql);
  }

  // Tự động nâng cấp bảng cong_trinh nếu thiếu cột
  try {
    const tableInfo = instance.prepare("PRAGMA table_info(cong_trinh)").all();
    const colNames = tableInfo.map(c => c.name);
    if (!colNames.includes('album_json')) {
      instance.exec("ALTER TABLE cong_trinh ADD COLUMN album_json TEXT;");
    }
    if (!colNames.includes('dien_tich')) {
      instance.exec("ALTER TABLE cong_trinh ADD COLUMN dien_tich TEXT DEFAULT '1200 m²';");
    }
  } catch (e) {
    // Bảng chưa sẵn sàng, bỏ qua
  }

  // Tự động nâng cấp bảng showroom_kho nếu thiếu cột
  try {
    const showroomInfo = instance.prepare("PRAGMA table_info(showroom_kho)").all();
    const showroomCols = showroomInfo.map(c => c.name);
    if (!showroomCols.includes('email')) {
      instance.exec("ALTER TABLE showroom_kho ADD COLUMN email TEXT DEFAULT 'contact@queenstone.vn';");
    }
    if (!showroomCols.includes('hinh_anh')) {
      instance.exec("ALTER TABLE showroom_kho ADD COLUMN hinh_anh TEXT;");
    }
    if (!showroomCols.includes('google_map_url')) {
      instance.exec("ALTER TABLE showroom_kho ADD COLUMN google_map_url TEXT;");
    }
    if (!showroomCols.includes('google_map_embed_url')) {
      instance.exec("ALTER TABLE showroom_kho ADD COLUMN google_map_embed_url TEXT;");
    }
    if (!showroomCols.includes('raw_map_link')) {
      instance.exec("ALTER TABLE showroom_kho ADD COLUMN raw_map_link TEXT;");
    }
  } catch (e) {
    // Bảng chưa sẵn sàng, bỏ qua
  }

  // Tự động khởi tạo bảng cau_hinh_he_thong nếu chưa có
  try {
    instance.exec(`
      CREATE TABLE IF NOT EXISTS cau_hinh_he_thong (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    // Bỏ qua
  }

  // Tự động nạp dữ liệu mẫu ban đầu nếu CSDL chính mới tinh chưa có sản phẩm
  if (!customPath) {
    try {
      const stoneCount = instance.prepare("SELECT COUNT(*) as count FROM san_pham_da").get();
      if (stoneCount && stoneCount.count === 0) {
        const { seedDatabase } = require('./seed');
        seedDatabase(instance);
      }
    } catch (e) {
      // Bảng chưa sẵn sàng
    }
  }

  if (!customPath) {
    db = instance;
  }
  return instance;
}

module.exports = {
  getDb,
  db: getDb()
};
