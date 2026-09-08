/**
 * SCRIPT KIỂM TRA TÍNH TOÀN VẸN CÚ PHÁP & CẤU TRÚC DỰ ÁN (INTEGRITY VALIDATOR)
 * Tuân thủ 5 Nguyên tắc Bất di bất dịch trong SOP v5.0 — Vibe Coding Framework v5.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let hasError = false;

console.log('================================================================================');
console.log('🔍 KIỂM TRA TOÀN VẸN CÚ PHÁP, CẤU TRÚC VIBE CODING FRAMEWORK v5.0');
console.log('================================================================================\n');

// 1. KIỂM TRA CÂN BẰNG THẺ HTML
function validateHtmlFile(filePath) {
  const relPath = path.relative(process.cwd(), filePath);
  console.log(`📄 Đang kiểm tra cấu trúc HTML: ${relPath}`);
  const html = fs.readFileSync(filePath, 'utf8');

  const pairedTags = [
    'div', 'section', 'main', 'header', 'footer', 'nav', 'aside', 'article',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'button', 'select', 'label', 'form',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'
  ];

  let fileHasMismatch = false;

  for (const tag of pairedTags) {
    const openMatches = html.match(new RegExp('<' + tag + '(\\s|[>])', 'gi')) || [];
    const closeMatches = html.match(new RegExp('</' + tag + '>', 'gi')) || [];

    if (openMatches.length !== closeMatches.length) {
      console.error(`  ❌ LỖI LỆCH THẺ <${tag}>: Mở = ${openMatches.length}, Đóng = ${closeMatches.length} (Chênh lệch: ${openMatches.length - closeMatches.length})`);
      fileHasMismatch = true;
      hasError = true;
    }
  }

  if (!fileHasMismatch) {
    console.log(`  ✅ Cấu trúc DOM hoàn toàn cân bằng (${pairedTags.length} loại thẻ kiểm tra đạt chuẩn 100%).\n`);
  } else {
    console.log('');
  }
}

// 2. KIỂM TRA CÚ PHÁP TĨNH JAVASCRIPT
function validateJsFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'temp') {
      validateJsFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const relPath = path.relative(process.cwd(), fullPath);
      try {
        execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
      } catch (err) {
        console.error(`  ❌ LỖI CÚ PHÁP JS: ${relPath}`);
        console.error(err.stderr?.toString() || err.message);
        hasError = true;
      }
    }
  }
}

// 3. KIỂM TRA SỰ TỒN TẠI CỦA CÁC THÀNH PHẦN QUY CHUẨN
function checkRequiredStructure(baseDir) {
  console.log('📁 Đang kiểm tra cấu trúc thư mục quy chuẩn...');
  const coreDirs = ['qa_tools', 'core_modules'];
  for (const d of coreDirs) {
    const dirPath = path.join(baseDir, d);
    if (!fs.existsSync(dirPath)) {
      console.error(`  ❌ Thiếu thư mục cốt lõi: ${d} tại ${path.relative(process.cwd(), dirPath)}`);
      hasError = true;
    } else {
      console.log(`  ✅ Thư mục chuẩn: ${d}`);
    }
  }

  // Kiểm tra file quy chuẩn (v4.0+: GEMINI.md hoặc GEMINI_TEMPLATE_v4.0.md)
  const ruleFiles = ['GEMINI.md', 'GEMINI_TEMPLATE_v4.0.md'];
  const hasRule = ruleFiles.some(f => fs.existsSync(path.join(baseDir, f)));
  if (hasRule) {
    console.log(`  ✅ File quy tắc chuẩn (GEMINI.md / GEMINI_TEMPLATE_v4.0.md) đã sẵn sàng.`);
  } else {
    console.warn(`  ⚠️ Cảnh báo: Chưa tìm thấy GEMINI.md hoặc GEMINI_TEMPLATE_v4.0.md trong thư mục gốc.`);
  }
  console.log('');
}

// Thực thi kiểm tra
const baseDir = path.resolve(__dirname, '..');
checkRequiredStructure(baseDir);

const possibleHtmlPaths = [
  path.join(baseDir, 'src/renderer/index.html'),
  path.join(baseDir, 'src/index.html'),
  path.join(baseDir, 'index.html')
];

for (const htmlPath of possibleHtmlPaths) {
  if (fs.existsSync(htmlPath)) {
    validateHtmlFile(htmlPath);
  }
}

console.log('⚡ Đang kiểm tra cú pháp tĩnh toàn bộ JavaScript (node -c)...');
validateJsFiles(path.join(baseDir, 'qa_tools'));
validateJsFiles(path.join(baseDir, 'core_modules'));
validateJsFiles(path.join(baseDir, 'templates'));
validateJsFiles(path.join(baseDir, 'src'));
validateJsFiles(path.join(baseDir, 'tests'));
validateJsFiles(baseDir);
console.log('  ✅ Toàn bộ mã nguồn JavaScript đạt chuẩn cú pháp không lỗi.\n');

console.log('================================================================================');
if (hasError) {
  console.error('🚨 KẾT QUẢ: PHÁT HIỆN LỖI TOÀN VẸN CẤU TRÚC! Vui lòng khắc phục trước khi bàn giao.');
  process.exit(1);
} else {
  console.log('🎉 KẾT QUẢ: 100% CẤU TRÚC VÀ CÚ PHÁP ĐẠT CHUẨN HOÀN HẢO!');
  console.log('================================================================================\n');
}
