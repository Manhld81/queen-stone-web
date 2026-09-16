/**
 * SCRIPT KIỂM TRA CÂN BẰNG THẺ HTML 1:1 (DOM TAGS CHECKER)
 * Tuân thủ Nguyên tắc bất di bất dịch số 5 (Machine-Verified Truth) — SOP v4.0
 */

const fs = require('fs');
const path = require('path');

const candidatePaths = [
  'public/index.html',
  'src/renderer/index.html',
  'src/index.html',
  'index.html'
];

let htmlFiles = [];
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    htmlFiles.push(p);
  }
}

// Nếu có thư mục public hoặc src, tìm thêm tất cả các file .html
['public', 'src'].forEach(targetDir => {
  if (fs.existsSync(targetDir)) {
    function findHtml(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== 'node_modules') {
          findHtml(full);
        } else if (e.isFile() && e.name.endsWith('.html') && !htmlFiles.includes(full)) {
          htmlFiles.push(full);
        }
      }
    }
    findHtml(targetDir);
  }
});

console.log('================================================================================');
console.log('🔍 LỚP QA 4: KIỂM TRA CÂN BẰNG THẺ HTML 1:1 (DOM TAGS CHECKER)');
console.log('================================================================================\n');

if (htmlFiles.length === 0) {
  console.log('ℹ️ Chưa phát hiện file HTML nào trong dự án (Giai đoạn khởi tạo). Bỏ qua kiểm tra DOM.\n');
  console.log('================================================================================');
  console.log('🎉 KẾT QUẢ: KHÔNG CÓ LỖI HTML!');
  console.log('================================================================================\n');
  process.exit(0);
}

const tags = ['div', 'section', 'main', 'header', 'footer', 'nav', 'aside', 'article', 'table', 'form', 'button', 'h1', 'h2', 'h3', 'h4', 'span', 'p', 'strong', 'tbody', 'thead', 'tr', 'td', 'th', 'datalist', 'select', 'option'];

let hasError = false;

for (const filePath of htmlFiles) {
  console.log(`📄 Đang kiểm tra file: ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');

  tags.forEach(t => {
    const openRegex = new RegExp(`<${t}(\\s|[>])`, 'gi');
    const closeRegex = new RegExp(`</${t}>`, 'gi');
    const openCount = (html.match(openRegex) || []).length;
    const closeCount = (html.match(closeRegex) || []).length;
    if (openCount !== closeCount) {
      console.error(`  ❌ Lệch thẻ <${t}>: Mở = ${openCount}, Đóng = ${closeCount}`);
      hasError = true;
    }
  });

  if (!hasError) {
    console.log(`  ✅ Cấu trúc DOM hoàn toàn cân bằng 1:1.\n`);
  }
}

console.log('================================================================================');
if (hasError) {
  console.error('🚨 PHÁT HIỆN LỖI LỆCH THẺ HTML! Vui lòng sửa lại mã nguồn.');
  process.exit(1);
} else {
  console.log('🎉 TẤT CẢ CÁC THẺ HTML ĐẠT CHUẨN CÂN BẰNG 1:1!');
  console.log('================================================================================\n');
}
