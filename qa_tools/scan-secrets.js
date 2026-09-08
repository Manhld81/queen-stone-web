/**
 * LỚP QA THỨ 6: QUÉT LỘ BÍ MẬT TRONG MÃ NGUỒN (SECRET SCANNER)
 * ============================================================================
 * VÌ SAO CÓ TỆP NÀY (bài học đắt giá từ bản v1.4):
 *
 * Bộ "Tự kiểm thử 5 Lớp Khắc nghiệt" của bản v1.4 gồm: Trạng thái Trắng, Cặp Test
 * Đôi, Migration CSDL, Cân bằng thẻ HTML, và Ma trận Đối chiếu Chéo. Cả 5 lớp đều
 * chỉ soi CÚ PHÁP và GIAO DIỆN — không lớp nào soi AN TOÀN THÔNG TIN.
 *
 * Kết quả: Client Secret của Google bị viết thẳng vào GoogleOAuthService.js dòng 29,
 * đi qua trọn vẹn 5 lớp QA mà không ai phát hiện, rồi bị đẩy lên GitHub công khai.
 * Dự án vẫn tự tuyên bố "22/22 TESTS PASSED" và "ĐỒNG BỘ 100%".
 *
 * Bài học: QUY TRÌNH CHỈ CHẶN ĐƯỢC NHỮNG GÌ NÓ THỰC SỰ ĐI KIỂM TRA.
 * Tệp này biến luật "không được hardcode bí mật" từ một câu khẩu hiệu
 * thành một lệnh chạy được bằng máy, không phụ thuộc việc AI có "nhớ" luật hay không.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

// Thư mục bỏ qua khi quét
const SKIP_DIRS = new Set(['node_modules', '.git', 'tests', 'dist', 'build', 'release']);

// Phần mở rộng tệp cần quét
const SCAN_EXTENSIONS = new Set(['.js', '.json', '.html', '.md', '.bat', '.ps1', '.yml', '.yaml']);

// Tệp được phép chứa từ khóa mẫu hoặc biến môi trường cục bộ (đã được .gitignore bảo vệ, không lên Git)
// ANTI_PATTERNS.md: tài liệu giảng dạy, chứa ví dụ minh họa lỗi (không phải code thật)
const ALLOWLIST_FILES = new Set(['.env.example', 'scan-secrets.js', '.env', '.env.local', 'google_auth_session.json', 'ANTI_PATTERNS.md']);


/**
 * Danh mục dấu hiệu bí mật bị lộ.
 * Mỗi mục: tên gọi dễ hiểu + biểu thức nhận dạng + mức độ.
 */
const SECRET_PATTERNS = [
  {
    name: 'Google OAuth Client Secret',
    regex: /GOCSPX-[A-Za-z0-9_-]{10,}/g,
    severity: 'CRITICAL',
    hint: 'Đưa vào biến môi trường GOOGLE_CLIENT_SECRET trong tệp .env'
  },
  {
    name: 'Google OAuth Client ID (giá trị thật)',
    regex: /\b\d{10,}-[a-z0-9]{20,}\.apps\.googleusercontent\.com/g,
    severity: 'CAO',
    hint: 'Đưa vào biến môi trường GOOGLE_CLIENT_ID trong tệp .env'
  },
  {
    name: 'Google API Key',
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    severity: 'CRITICAL',
    hint: 'Đưa vào biến môi trường, không viết vào mã nguồn'
  },
  {
    name: 'Refresh Token / Access Token gán trực tiếp',
    regex: /["'](?:refresh_token|access_token)["']\s*:\s*["'](?!mock|test|<|\s*["'])[A-Za-z0-9._/-]{20,}["']/g,
    severity: 'CRITICAL',
    hint: 'Token phải nằm trong tệp dữ liệu đã .gitignore, không nằm trong mã nguồn'
  },
  {
    name: 'Khóa riêng tư (Private Key)',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
    severity: 'CRITICAL',
    hint: 'Không bao giờ đưa khóa riêng tư vào kho mã nguồn'
  },
  {
    name: 'Mật khẩu gán trực tiếp trong mã',
    regex: /(?:password|passwd|secret)\s*[:=]\s*["'](?!mock|test|example|your[_-]|<|\$\{|\s*["'])[^"'\n]{8,}["']/gi,
    severity: 'CAO',
    hint: 'Chuyển sang biến môi trường'
  }
];

let filesScanned = 0;
const findings = [];

/**
 * Quét một tệp đơn lẻ
 */
function scanFile(filePath) {
  const fileName = path.basename(filePath);
  if (ALLOWLIST_FILES.has(fileName)) return;

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return; // Tệp nhị phân hoặc không đọc được — bỏ qua
  }

  filesScanned++;
  const lines = content.split(/\r?\n/);

  for (const pattern of SECRET_PATTERNS) {
    lines.forEach((line, index) => {
      pattern.regex.lastIndex = 0;
      const match = pattern.regex.exec(line);
      if (!match) return;

      // Che bớt giá trị khi in ra, tránh chính báo cáo lại làm lộ thêm bí mật
      const raw = match[0];
      const masked = raw.length > 14
        ? `${raw.slice(0, 10)}…${raw.slice(-4)}`
        : `${raw.slice(0, 4)}…`;

      findings.push({
        file: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
        line: index + 1,
        name: pattern.name,
        severity: pattern.severity,
        masked,
        hint: pattern.hint
      });
    });
  }
}

/**
 * Đi đệ quy toàn bộ cây thư mục dự án
 */
function walkDirectory(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkDirectory(fullPath);
    } else if (entry.isFile()) {
      if (SCAN_EXTENSIONS.has(path.extname(entry.name)) || entry.name.startsWith('.env')) {
        scanFile(fullPath);
      }
    }
  }
}

// ============================================================================
// THỰC THI
// ============================================================================
console.log('================================================================================');
console.log('🔐 LỚP QA 6: QUÉT LỘ BÍ MẬT TRONG MÃ NGUỒN (SECRET SCANNER)');
console.log('================================================================================\n');

walkDirectory(PROJECT_ROOT);

console.log(`📄 Đã quét: ${filesScanned} tệp`);
console.log(`🔍 Số dấu hiệu tìm kiếm: ${SECRET_PATTERNS.length} loại bí mật\n`);

if (findings.length === 0) {
  console.log('✅ KHÔNG PHÁT HIỆN BÍ MẬT NÀO BỊ VIẾT THẲNG VÀO MÃ NGUỒN.');
  console.log('================================================================================');
  process.exit(0);
}

console.log(`❌ PHÁT HIỆN ${findings.length} BÍ MẬT BỊ LỘ TRONG MÃ NGUỒN:\n`);

for (const f of findings) {
  console.log(`  [${f.severity}] ${f.name}`);
  console.log(`     Vị trí   : ${f.file}:${f.line}`);
  console.log(`     Giá trị  : ${f.masked}  (đã che bớt)`);
  console.log(`     Khắc phục: ${f.hint}\n`);
}

console.log('--------------------------------------------------------------------------------');
console.log('⚠️  VIỆC BẮT BUỘC: nếu bí mật này ĐÃ TỪNG được commit và đẩy lên GitHub thì');
console.log('    việc xóa khỏi mã nguồn LÀ KHÔNG ĐỦ. Phải THU HỒI (revoke) bí mật đó tại');
console.log('    nhà cung cấp (Google Cloud Console...) và cấp lại bí mật mới.');
console.log('================================================================================');
process.exit(1);
