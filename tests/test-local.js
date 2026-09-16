/**
 * QA TẦNG A — LOCAL TEST SUITE (test-local.js)
 * ============================================================================
 * Chạy: node tests/test-local.js  hoặc  npm run test:local
 *
 * Mục tiêu: Kiểm thử cục bộ nhanh gọn sau mỗi tác vụ hoàn thành.
 *   - Lớp 1: Môi trường test cô lập trong tests/temp/ (không ô nhiễm data thật)
 *   - Lớp 2: Positive Test (dữ liệu đúng → xử lý thành công)
 *           + Negative Test (dữ liệu sai/thiếu → chặn đứng, trả mã lỗi chuẩn)
 *   - Lớp 3: Kiểm tra cú pháp tĩnh JavaScript
 *
 * ============================================================================
 * HƯỚNG DẪN CHO AI: Khi Anh Mike yêu cầu viết test cho module X,
 *   hãy thêm các test case vào đúng section bên dưới theo mẫu có sẵn.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ─── SETUP MÔI TRƯỜNG TEST CÔ LẬP (Lớp 1) ───────────────────────────────────
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

let passed = 0;
let failed = 0;
const failures = [];

// Hàm assert chuẩn hoá
function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}${detail ? ' — ' + detail : ''}`);
    failed++;
    failures.push(testName);
  }
}

// Hàm assert lỗi: kỳ vọng function NÉM ra exception hoặc trả ApiResult{success:false}
function assertError(fn, testName, expectedCode = null) {
  try {
    const result = fn();
    // Kiểm tra ApiResult pattern
    if (result && result.success === false) {
      if (expectedCode && result.code !== expectedCode) {
        assert(false, testName, `Kỳ vọng code="${expectedCode}", nhận được code="${result.code}"`);
      } else {
        assert(true, testName);
      }
    } else {
      assert(false, testName, 'Kỳ vọng thất bại nhưng nhận được thành công');
    }
  } catch (err) {
    assert(true, testName); // Exception được chấp nhận là Negative test pass
  }
}

// ─── TEST SUITE ────────────────────────────────────────────────────────────────

console.log('================================================================================');
console.log('🧪 QA TẦNG A — LOCAL TEST SUITE');
console.log('================================================================================\n');

// TODO: Thêm test cases vào đây theo mẫu bên dưới.
// Anh Mike gõ lệnh yêu cầu AI viết test, AI sẽ tự thêm vào đúng section.

// ─── MODULE: STONE CATALOG & QUERY LOGIC ──────────────────────────────────────
const { StoneService } = require('../core_modules/stone-service');
const { getDb } = require('../src/db/database');
const { seedDatabase } = require('../src/db/seed');

// Thiết lập test database cô lập trong TEMP_DIR
const TEST_DB_PATH = path.join(TEMP_DIR, 'test_queen_stone.db');
if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
const testDb = getDb(TEST_DB_PATH);
seedDatabase(testDb);

const testService = new StoneService(testDb);

console.log('📋 MODULE 1: THỨ TỰ SẮP XẾP SẢN PHẨM (CREATED_AT DESC)');
const allStonesRes = testService.listStones({ limit: 100 });
assert(allStonesRes.success === true, 'Truy vấn danh sách đá thành công');
const allItems = allStonesRes.data.items;
assert(allItems.length === 24, 'Tổng số sản phẩm mẫu đạt chuẩn 24 lô đá');

// Kiểm tra: Sản phẩm Up sau cùng thì hiện lên trên cùng
assert(allItems[0].ma_lo === 'QS-CALA-802', 'Sản phẩm đầu tiên là sản phẩm Up sau cùng (QS-CALA-802)');
assert(allItems[allItems.length - 1].ma_lo === 'QS-CREM-010', 'Sản phẩm cuối cùng là sản phẩm cũ nhất (QS-CREM-010)');

// Kiểm tra tính đơn điệu giảm dần của created_at
let isSortedDesc = true;
for (let i = 0; i < allItems.length - 1; i++) {
  if (new Date(allItems[i].created_at) < new Date(allItems[i + 1].created_at)) {
    isSortedDesc = false;
    break;
  }
}
assert(isSortedDesc, 'Toàn bộ danh sách được sắp xếp giảm dần theo thời gian tạo (created_at DESC)');

console.log('\n📋 MODULE 2: HUY HIỆU NEW NHẤP NHÁY (ĐÚNG 6 SẢN PHẨM UP SAU CÙNG)');
const newItems = allItems.filter(item => item.is_new);
assert(newItems.length === 6, `Chính xác 6 sản phẩm Up sau cùng có cờ is_new=true (nhận được: ${newItems.length})`);
assert(allItems[0].is_new === true, 'Sản phẩm #1 có cờ is_new = true');
assert(allItems[5].is_new === true, 'Sản phẩm #6 có cờ is_new = true');
assert(allItems[6].is_new === false, 'Sản phẩm #7 có cờ is_new = false');

console.log('\n📋 MODULE 3: TRẠNG THÁI TỒN KHO & HẾT HÀNG');
const outOfStockItems = allItems.filter(item => item.is_out_of_stock);
assert(outOfStockItems.length >= 3, `Có ít nhất 3 sản phẩm hết hàng để kiểm thử (nhận được: ${outOfStockItems.length})`);

outOfStockItems.forEach(item => {
  assert(item.so_luong_tam === 0, `Sản phẩm hết hàng ${item.ma_lo} có số lượng tấm = 0`);
  assert(item.status_badge === 'HẾT HÀNG', `Sản phẩm ${item.ma_lo} hiển thị huy hiệu 'HẾT HÀNG'`);
});

const inStockItem = allItems.find(item => item.so_luong_tam > 0);
assert(inStockItem.is_out_of_stock === false, `Sản phẩm còn hàng ${inStockItem.ma_lo} có is_out_of_stock = false`);
assert(inStockItem.status_badge === 'CÒN HÀNG', `Sản phẩm còn hàng hiển thị huy hiệu 'CÒN HÀNG'`);

console.log('\n📋 MODULE 4: PHÂN TRANG CUỘN VÔ TẬN (INFINITE SCROLL)');
const page1 = testService.listStones({ page: 1, limit: 9 });
assert(page1.data.items.length === 9, 'Trang 1 nạp đúng 9 sản phẩm');
assert(page1.data.has_more === true, 'Trang 1 có cờ has_more = true để cuộn tiếp');

const page2 = testService.listStones({ page: 2, limit: 9 });
assert(page2.data.items.length === 9, 'Trang 2 nạp tiếp 9 sản phẩm');
assert(page2.data.has_more === true, 'Trang 2 có cờ has_more = true để cuộn tiếp');

const page3 = testService.listStones({ page: 3, limit: 9 });
assert(page3.data.items.length === 6, 'Trang 3 nạp 6 sản phẩm còn lại (tổng 24)');
assert(page3.data.has_more === false, 'Trang 3 hết sản phẩm, has_more = false để dừng cuộn vô tận');

console.log('\n📋 MODULE 5: BỘ LỌC ĐA CHIỀU (CHỦNG LOẠI, MÀU SẮC, ỨNG DỤNG)');
const marbleStones = testService.listStones({ category: 'Marble', limit: 100 });
assert(marbleStones.data.items.every(i => i.loai_da === 'Marble'), 'Bộ lọc Marble chỉ trả về đá Marble');

const greenStones = testService.listStones({ color: 'Xanh', limit: 100 });
assert(greenStones.data.items.every(i => i.mau_sac === 'Xanh'), 'Bộ lọc Xanh chỉ trả về đá màu Xanh');

const kitchenStones = testService.listStones({ application: 'Đảo Bếp', limit: 100 });
assert(kitchenStones.data.items.every(i => i.ung_dung.includes('Đảo Bếp')), 'Bộ lọc Đảo Bếp chỉ trả về đá phù hợp đảo bếp');

console.log('\n📋 MODULE 6: QUẢN TRỊ KHO & XUẤT KHO MÃ PIN (ATOMIC TRANSACTION)');
// Negative test: Sai mã PIN
const invalidPinResult = testService.exportStone({
  ma_lo: 'QS-CALA-802',
  so_tam: 2,
  pin: '9999',
  ten_cong_trinh: 'Test'
});
assert(invalidPinResult.success === false, 'Chặn đứng khi nhập sai mã PIN');
assert(invalidPinResult.code === 'INVALID_PIN', 'Trả mã lỗi chuẩn INVALID_PIN');

// Negative test: Xuất vượt quá tồn
const overStockResult = testService.exportStone({
  ma_lo: 'QS-CALA-802',
  so_tam: 999,
  pin: '1234',
  ten_cong_trinh: 'Test'
});
assert(overStockResult.success === false, 'Chặn đứng khi xuất vượt quá tồn kho thực tế');

// Positive test: Xuất hợp lệ
const validExportResult = testService.exportStone({
  ma_lo: 'QS-CALA-802',
  so_tam: 2,
  pin: '1234',
  ten_cong_trinh: 'Dinh Thự Grand Villa Ecopark'
});
assert(validExportResult.success === true, 'Xuất kho thành công với mã PIN chuẩn');
assert(validExportResult.data.so_tam_con_lai === 10, 'Tồn kho được trừ chính xác từ 12 xuống 10 tấm');

// Kiểm tra Audit Log đã được ghi
const stats = testService.getWarehouseStats();
assert(stats.data.lich_su_gan_nhat.length > 0, 'Nhật ký xuất kho Audit Log ghi nhận giao dịch thành công');
assert(stats.data.lich_su_gan_nhat[0].ma_lo === 'QS-CALA-802', 'Audit log lưu đúng mã lô đá vừa xuất');

// ─── MODULE 7: LOOKBOOK CÔNG TRÌNH TIÊU BIỂU & ALBUM ẢNH ────────────────────
console.log('📋 MODULE 7: LOOKBOOK CÔNG TRÌNH TIÊU BIỂU & ALBUM ẢNH');
const projects = testDb.prepare('SELECT * FROM cong_trinh ORDER BY id ASC').all();
assert(projects.length === 6, `Tổng số công trình tiêu biểu đạt chuẩn 6 dự án (nhận được: ${projects.length})`);

for (const p of projects) {
  assert(p.ten_cong_trinh && p.ten_cong_trinh.length > 0, `Công trình #${p.id} có tên hợp lệ (${p.ten_cong_trinh})`);
  assert(p.album_json && p.album_json.length > 0, `Công trình #${p.id} có album_json`);
  let parsedAlbum = [];
  try {
    parsedAlbum = JSON.parse(p.album_json);
  } catch (e) {
    parsedAlbum = [];
  }
  assert(parsedAlbum.length >= 4, `Album công trình #${p.id} có ít nhất 4 ảnh (nhận được: ${parsedAlbum.length})`);
}

// ─── MODULE 8: ALBUM ĐÁ TỰ NHIÊN (KHO ẢNH VÔ HẠN & BỘ LỌC KHÔNG GIAN) ────────
console.log('\n📋 MODULE 8: ALBUM ĐÁ TỰ NHIÊN (KHO ẢNH VÔ HẠN & BỘ LỌC KHÔNG GIAN)');
const albumPhotosCount = testDb.prepare('SELECT COUNT(*) as total FROM album_photos').get();
assert(albumPhotosCount.total === 52, `Tổng số ảnh mẫu ban đầu trong album_photos là 52 (nhận được: ${albumPhotosCount.total})`);

// Kiểm tra phân trang album ảnh
const page1Photos = testDb.prepare('SELECT * FROM album_photos ORDER BY sort_order ASC, id ASC LIMIT 12 OFFSET 0').all();
assert(page1Photos.length === 12, 'Trang 1 album nạp đúng 12 ảnh dạng lưới');

// Kiểm tra lọc theo không gian
const lobbyPhotos = testDb.prepare('SELECT * FROM album_photos WHERE category = ?').all('Đại Sảnh');
assert(lobbyPhotos.length > 0, `Lọc không gian Đại Sảnh thành công (nhận được: ${lobbyPhotos.length} ảnh)`);
assert(lobbyPhotos.every(p => p.category === 'Đại Sảnh'), '100% ảnh thuộc không gian Đại Sảnh');

// Kiểm tra tính năng thêm ảnh mới (Upload vô hạn)
const newPhotoInsert = testDb.prepare(`
  INSERT INTO album_photos (title, image_url, category, project_name, stone_name, description, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run('Penthouse Master Suite', 'https://example.com/photo33.jpg', 'Master Spa', 'Penthouse Diamond', 'Patagonia Quartzite', 'Đá xuyên sáng nghệ thuật', 999);

assert(newPhotoInsert.changes === 1, 'Thêm ảnh mới vào kho Album vô hạn thành công');
const updatedCount = testDb.prepare('SELECT COUNT(*) as total FROM album_photos').get();
assert(updatedCount.total === 53, `Kho album ảnh mở rộng thành công lên 53 ảnh (nhận được: ${updatedCount.total})`);

console.log('\n📋 MODULE 9: QUẢN TRỊ VIÊN TOÀN DIỆN (ADMIN DASHBOARD CRUD)');
// 9.1 Cấu hình Logo & Cài đặt hệ thống
const initialSettings = testService.getSettings();
assert(initialSettings.success === true, 'Truy xuất cấu hình hệ thống thành công');
assert(!!initialSettings.data.logo_url, 'Cấu hình có logo_url hợp nhất');

const updateLogoRes = testService.updateSettings({ logo_url: '/assets/custom_queen_stone_logo.png' });
assert(updateLogoRes.success === true, 'Cập nhật Logo Website thành công');
assert(updateLogoRes.data.logo_url === '/assets/custom_queen_stone_logo.png', 'Logo mới được lưu vĩnh viễn vào CSDL');

// 9.2 Quản lý Phiến Đá & Lượng tồn kho
const createStoneRes = testService.createStone({
  ma_lo: 'QS-TEST-999',
  ten_da: 'Đá Thạch Anh Vàng Kim Hoàng Gia',
  loai_da: 'Quartzite',
  mau_sac: 'Vàng',
  xuat_xu: 'Brazil',
  chieu_dai_mm: 3000,
  chieu_rong_mm: 2000,
  do_day_mm: 20,
  be_mat: 'Polished',
  ung_dung: 'Vách Thông Tầng',
  so_luong_tam: 10,
  hinh_anh_slab: '/assets/hero_slides/slide_01_foyer_emerald.jpg',
  hinh_anh_macro: '/assets/hero_slides/slide_01_foyer_emerald.jpg'
});
assert(createStoneRes.success === true, 'Thêm mới phiến đá độc bản thành công');
assert(createStoneRes.data.dien_tich_m2 === 60, 'Tự động tính diện tích tồn: 3m x 2m x 10 tấm = 60 m²');

// Cập nhật số lượng tồn kho (tăng từ 10 lên 15 tấm)
const updateStoneRes = testService.updateStone(createStoneRes.data.id, { so_luong_tam: 15 });
assert(updateStoneRes.success === true, 'Cập nhật lượng hàng tồn kho thành công');
assert(updateStoneRes.data.so_luong_tam === 15, 'Số lượng tấm tồn cập nhật lên 15');
assert(updateStoneRes.data.dien_tich_m2 === 90, 'Diện tích tự động cập nhật: 3m x 2m x 15 tấm = 90 m²');

// Cập nhật diện tích tồn thực tế do Anh Mike nhập tay (không tự động tính)
const manualAreaRes = testService.updateStone(createStoneRes.data.id, { so_luong_tam: 12, dien_tich_m2: 65.5 });
assert(manualAreaRes.success === true, 'Cập nhật diện tích tồn thực tế nhập tay thành công');
assert(manualAreaRes.data.dien_tich_m2 === 65.5, 'Diện tích tồn thực tế lưu đúng giá trị nhập tay 65.5 m² (không tự động tính)');

// Xóa phiến đá test
const deleteStoneRes = testService.deleteStone(createStoneRes.data.id);
assert(deleteStoneRes.success === true, 'Xóa phiến đá thành công');

// 9.3 Quản lý Album Ảnh
const testPhoto = testDb.prepare('SELECT id, title FROM album_photos LIMIT 1').get();
const updateAlbumRes = testService.updateAlbumPhoto(testPhoto.id, { title: 'Đại Sảnh Hoàng Gia Sửa Lại' });
assert(updateAlbumRes.success === true, 'Cập nhật thông tin ảnh Album thành công');

// 9.4 Quản lý Showroom (Thêm vô hạn showroom)
const createDepotRes = testService.createDepot({
  id: 'SHOWROOM_TEST_05',
  ten_co_so: 'Showroom 5 — Tây Nguyên & Nam Trung Bộ',
  loai: 'Showroom Trưng Bày',
  dia_chi: 'Số 100 Trần Hưng Đạo, TP. Buôn Ma Thuột',
  hotline: '0988.999.888',
  email: 'taynguyen@queenstone.vn'
});
assert(createDepotRes.success === true, 'Thêm Showroom mới vô hạn thành công');
const updateDepotRes = testService.updateDepot('SHOWROOM_TEST_05', { hotline: '0988.777.666' });
assert(updateDepotRes.success === true, 'Cập nhật thông tin Showroom thành công');
const deleteDepotRes = testService.deleteDepot('SHOWROOM_TEST_05');
assert(deleteDepotRes.success === true, 'Xóa cơ sở Showroom thành công');

// ─── KẾT QUẢ ─────────────────────────────────────────────────────────────────
console.log('\n================================================================================');
console.log(`📊 KẾT QUẢ TẦNG A: ${passed + failed} test | ✅ ${passed} PASS | ❌ ${failed} FAIL`);
if (failures.length > 0) {
  console.log('\n❌ CÁC TEST THẤT BẠI:');
  failures.forEach(f => console.log(`   - ${f}`));
  console.log('\n🚨 TẦNG A CHƯA ĐẠT — Không được commit cho đến khi 100% XANH.');
  console.log('================================================================================\n');
  process.exit(1);
} else {
  console.log('\n✅ TẦNG A ĐẠT 100% — Sẵn sàng Daily Git Commit.');
  console.log('================================================================================\n');
  process.exit(0);
}
