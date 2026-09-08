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

// ─── VÍ DỤ — XÓA BỎ KHI THÊM TEST THẬT ─────────────────────────────────────
// === MODULE: PLACEHOLDER (Xóa section này khi có test thật) ===
console.log('📋 MODULE: PLACEHOLDER (chưa có test case)');
assert(true, 'Framework test infrastructure hoạt động', 'Sẵn sàng nhận test case từ AI');
// ─────────────────────────────────────────────────────────────────────────────

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
