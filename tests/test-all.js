/**
 * QA TẦNG A — FULL TEST SUITE (test-all.js)
 * ============================================================================
 * Chạy: node tests/test-all.js  hoặc  npm test
 *
 * Mục tiêu: Chạy toàn bộ test suite của dự án theo thứ tự:
 *   1. Local Test (Tầng A — test-local.js)
 *   2. Migration Test (Tầng B Lớp 4 — test-migration.js)
 *
 * Dùng khi: Chuẩn bị Milestone / Production Release.
 * ============================================================================
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('================================================================================');
console.log('🚀 FULL TEST SUITE — CHẠY TOÀN BỘ HỆ THỐNG KIỂM THỬ');
console.log('================================================================================\n');

let overallPassed = true;

function runSuite(label, scriptPath) {
  console.log(`\n▶ Đang chạy: ${label}`);
  console.log('─'.repeat(80));
  try {
    execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    console.log(`✅ ${label}: PASSED\n`);
  } catch {
    console.log(`❌ ${label}: FAILED\n`);
    overallPassed = false;
  }
}

// Chạy tuần tự các test suite
runSuite('QA Tầng A — Local Test', path.join(__dirname, 'test-local.js'));
runSuite('QA Tầng B Lớp 4 — Migration Test', path.join(__dirname, 'test-migration.js'));

// Kết luận
console.log('================================================================================');
if (overallPassed) {
  console.log('🎉 TOÀN BỘ TEST SUITE ĐẠT 100% — Sẵn sàng Release!');
  console.log('================================================================================\n');
  process.exit(0);
} else {
  console.log('🚨 CÓ TEST THẤT BẠI — Không được Release cho đến khi 100% XANH.');
  console.log('================================================================================\n');
  process.exit(1);
}
