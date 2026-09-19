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

const { execSync, spawn } = require('child_process');
const http = require('http');
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

function checkServerReady(port = 3000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/v1/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function runLiveE2ESuite() {
  const label = 'QA Tầng C — Live E2E Server Test';
  console.log(`\n▶ Đang chạy: ${label}`);
  console.log('─'.repeat(80));

  let spawnedServer = null;
  const isAlreadyRunning = await checkServerReady(3000);

  if (!isAlreadyRunning) {
    console.log('⏳ Máy chủ chưa hoạt động, tự động khởi chạy tiến trình ngầm (PORT=3000)...');
    spawnedServer = spawn(process.execPath, ['src/server.js'], {
      cwd: ROOT,
      env: { ...process.env, PORT: '3000', HOST: '127.0.0.1' },
      stdio: 'ignore'
    });

    // Chờ tối đa 5 giây để server sẵn sàng
    let ready = false;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 200));
      ready = await checkServerReady(3000);
      if (ready) break;
    }

    if (!ready) {
      console.log(`❌ ${label}: FAILED (Không thể khởi động server ngầm trên cổng 3000)\n`);
      if (spawnedServer) {
        try { spawnedServer.kill(); } catch (e) {}
      }
      overallPassed = false;
      return;
    }
  }

  try {
    execSync(`node "${path.join(__dirname, 'test-e2e-live.js')}"`, { stdio: 'inherit' });
    console.log(`✅ ${label}: PASSED\n`);
  } catch {
    console.log(`❌ ${label}: FAILED\n`);
    overallPassed = false;
  } finally {
    if (spawnedServer) {
      console.log('🧹 Đang dọn dẹp và tắt tiến trình máy chủ thử nghiệm...');
      try {
        spawnedServer.kill('SIGTERM');
      } catch (e) {}
    }
  }
}

async function main() {
  // 1. Chạy tuần tự các bài kiểm thử cô lập
  runSuite('QA Tầng A — Local Test', path.join(__dirname, 'test-local.js'));
  runSuite('QA Tầng B Lớp 4 — Migration Test', path.join(__dirname, 'test-migration.js'));

  // 2. Chạy kiểm thử E2E Live với server tự khởi động
  await runLiveE2ESuite();

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
}

main();

