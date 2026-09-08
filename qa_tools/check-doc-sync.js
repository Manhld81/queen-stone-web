/**
 * LỚP QA THỨ 7: ĐỐI SOÁT TỰ ĐỘNG TÀI LIỆU ↔ MÃ NGUỒN (DOC-CODE SYNC CHECKER)
 * ============================================================================
 * VÌ SAO CÓ TỆP NÀY (bài học từ bản v1.4):
 *
 * Bảng tiến độ bản v1.4 ghi "ĐÃ PHÊ DUYỆT & ĐỒNG BỘ 100% VỚI MÃ NGUỒN".
 * Nhưng cụm "đồng bộ 100%" đó là kết luận của MỘT lần đối chiếu bằng mắt trong
 * một phiên chat, rồi biến mất cùng phiên chat. Không ai chạy lại được.
 *
 * Thực tế khi đối soát bằng máy: 18 điểm lệch pha, trong đó có
 *   - 5 kênh IPC được đặc tả mà KHÔNG TỒN TẠI trong code (file:*)
 *   - 6 kênh IPC có thật mà KHÔNG XUẤT HIỆN trong bất kỳ tài liệu nào (doc:*)
 *   - 13/18 kiểu dữ liệu chỉ có tên, không có định nghĩa (kể cả CaseDTO, ApiResult)
 *   - Sơ đồ kiến trúc vỡ cú pháp Markdown
 *
 * Nguyên tắc rút ra: LỜI TUYÊN BỐ "ĐỒNG BỘ 100%" CHỈ CÓ GIÁ TRỊ
 * KHI NÓ LÀ KẾT QUẢ CỦA MỘT LỆNH CHẠY ĐƯỢC.
 *
 * Tệp này biến việc đối soát từ "AI phải tự nhớ mà làm" thành "máy tự kiểm".
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);

const read = (f) => {
  try { return fs.readFileSync(f, 'utf8'); } catch { return null; }
};

let errors = 0;
let warnings = 0;
let checks = 0;

function section(title) {
  console.log(`\n${'─'.repeat(80)}\n▶ ${title}\n${'─'.repeat(80)}`);
}
function ok(msg) { checks++; console.log(`  ✅ ${msg}`); }
function fail(msg, detail) {
  checks++; errors++;
  console.log(`  ❌ ${msg}`);
  if (detail) String(detail).split('\n').forEach((l) => console.log(`       ${l}`));
}
function warn(msg, detail) {
  checks++; warnings++;
  console.log(`  ⚠️  ${msg}`);
  if (detail) String(detail).split('\n').forEach((l) => console.log(`       ${l}`));
}

const DATA_CONTRACT = read(P('DATA_CONTRACT.md'));
const ARCHITECTURE = read(P('SYSTEM_ARCHITECTURE.md'));
const IPC_SRC = read(P('src', 'main', 'ipc', 'ipcHandlers.js'));
const SCHEMA_SQL = read(P('src', 'main', 'db', 'schema.sql'));

console.log('='.repeat(80));
console.log('🔗 LỚP QA 7: ĐỐI SOÁT TỰ ĐỘNG TÀI LIỆU ↔ MÃ NGUỒN');
console.log('='.repeat(80));

// ============================================================================
// KIỂM TRA 1: KÊNH IPC — tài liệu vs code
// ============================================================================
section('KIỂM TRA 1: Danh mục kênh IPC (Hợp đồng Dữ liệu vs ipcHandlers.js)');

if (!DATA_CONTRACT && !IPC_SRC) {
  // Dự án mới chưa có hợp đồng và code IPC → bỏ qua gracefully (không báo lỗi)
  ok('SKIP — DATA_CONTRACT.md và ipcHandlers.js chưa tồn tại (dự án mới, chưa vào Chặng 3)');
} else if (!DATA_CONTRACT || !IPC_SRC) {
  // Một trong hai tồn tại mà cái kia không có → đây mới là lỗi thật
  const missing = !DATA_CONTRACT ? 'DATA_CONTRACT.md' : 'src/main/ipc/ipcHandlers.js';
  fail(`Không đọc được ${missing} — file này đã có file đối chiếu nhưng bị thiếu`);
} else {
  // Kênh thật trong code
  const codeChannels = [...IPC_SRC.matchAll(/ipcMain\.handle\(\s*['"]([^'"]+)['"]/g)]
    .map((m) => m[1]).sort();

  // Kênh trong bảng IPC của tài liệu (bỏ mục sự kiện phát broadcast)
  const ipcTableSection = DATA_CONTRACT.split(/##\s*4\./)[0];
  const broadcastSection = (ipcTableSection.match(/###\s*3\.7[\s\S]*/) || [''])[0];
  const invokeSection = ipcTableSection.replace(broadcastSection, '');

  const docChannels = [...new Set(
    [...invokeSection.matchAll(/^\|\s*`([a-z]+:[A-Za-z]+)`/gm)].map((m) => m[1])
  )].sort();

  const fictional = docChannels.filter((c) => !codeChannels.includes(c));
  const undocumented = codeChannels.filter((c) => !docChannels.includes(c));

  if (fictional.length === 0) {
    ok(`Không có kênh nào bị đặc tả hư cấu (${docChannels.length} kênh trong tài liệu đều tồn tại)`);
  } else {
    fail(`${fictional.length} kênh được ĐẶC TẢ nhưng KHÔNG TỒN TẠI trong code:`,
      fictional.join('\n'));
  }

  if (undocumented.length === 0) {
    ok(`Toàn bộ ${codeChannels.length} kênh trong code đều đã được tài liệu hóa`);
  } else {
    fail(`${undocumented.length} kênh CÓ THẬT trong code nhưng KHÔNG được tài liệu hóa:`,
      undocumented.join('\n'));
  }

  // Con số ghi trong tiêu đề mục 3 phải khớp số kênh thật
  const headerCount = (DATA_CONTRACT.match(/DANH MỤC\s+(\d+)\s+KÊNH/i) || [])[1];
  if (headerCount && Number(headerCount) !== codeChannels.length) {
    fail(`Tiêu đề tài liệu ghi "${headerCount} kênh" nhưng code có ${codeChannels.length} kênh`);
  } else if (headerCount) {
    ok(`Tiêu đề tài liệu ghi đúng ${headerCount} kênh`);
  }

  // Comment trong mã nguồn cũng phải khớp
  for (const file of ['src/main/main.js', 'src/main/ipc/ipcHandlers.js']) {
    const content = read(P(...file.split('/')));
    if (!content) continue;
    const m = content.match(/(\d+)\s*[Kk]ênh IPC/);
    if (m && Number(m[1]) !== codeChannels.length) {
      fail(`Comment trong ${file} ghi "${m[1]} kênh IPC" nhưng thực tế có ${codeChannels.length}`);
    } else if (m) {
      ok(`Comment trong ${file} ghi đúng ${m[1]} kênh`);
    }
  }
}

// ============================================================================
// KIỂM TRA 2: KIỂU DỮ LIỆU — mọi kiểu được tham chiếu phải được định nghĩa
// ============================================================================
section('KIỂM TRA 2: Kiểu dữ liệu (DTO) — tham chiếu vs định nghĩa');

if (DATA_CONTRACT) {
  const defined = new Set(
    [...DATA_CONTRACT.matchAll(/^(?:export\s+)?interface\s+(\w+)/gm)].map((m) => m[1])
  );
  // Kiểu nguyên thủy / có sẵn, không cần định nghĩa trong tài liệu này
  const builtins = new Set(['OpenDialogOptions']);

  // Chỉ quét các BẢNG KÊNH IPC (mục 3) để lấy kiểu được tham chiếu.
  // Cố ý KHÔNG quét toàn tài liệu: phần văn xuôi đính chính lịch sử có nhắc tên
  // kiểu cũ đã bị loại bỏ (ví dụ DeleteCaseResultDTO của v1.4). Đó là ghi chú
  // lịch sử, không phải nghĩa vụ đang có hiệu lực của hợp đồng.
  const ipcTablesOnly = (DATA_CONTRACT.match(/##\s*3\.\s[\s\S]*?(?=\n##\s*4\.)/) || [''])[0]
    .split('\n')
    .filter((l) => l.trimStart().startsWith('|'))   // chỉ lấy dòng bảng
    .join('\n');

  const referenced = new Set(
    [...ipcTablesOnly.matchAll(/\b([A-Z]\w*(?:DTO|Params|Options))\b/g)].map((m) => m[1])
  );
  // ApiResult là vỏ bọc chung của mọi kênh, cũng bắt buộc phải định nghĩa
  if (/ApiResult/.test(DATA_CONTRACT)) referenced.add('ApiResult');

  const missing = [...referenced].filter((t) => !defined.has(t) && !builtins.has(t)).sort();

  if (missing.length === 0) {
    ok(`Toàn bộ ${referenced.size} kiểu được tham chiếu đều có định nghĩa`);
  } else {
    fail(`${missing.length}/${referenced.size} kiểu được THAM CHIẾU nhưng KHÔNG được ĐỊNH NGHĨA:`,
      missing.join('\n'));
  }
}

// ============================================================================
// KIỂM TRA 3: LƯỢC ĐỒ CSDL — DDL trong tài liệu vs schema.sql
// ============================================================================
section('KIỂM TRA 3: Lược đồ CSDL (DDL trong tài liệu vs schema.sql)');

if (DATA_CONTRACT && SCHEMA_SQL) {
  const normalize = (sql) => sql
    .replace(/--[^\n]*/g, '')          // bỏ comment
    .replace(/\s+/g, ' ')              // gộp khoảng trắng
    .replace(/\s*([(),;])\s*/g, '$1')  // chuẩn hóa quanh dấu
    .trim().toLowerCase();

  const extractTables = (sql) => {
    const out = {};
    const re = /CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)\s*\(([\s\S]*?)\n\s*\);/gi;
    let m;
    while ((m = re.exec(sql)) !== null) out[m[1].toLowerCase()] = normalize(m[2]);
    return out;
  };

  const docSql = ([...DATA_CONTRACT.matchAll(/```sql\n([\s\S]*?)```/g)] || [])
    .map((m) => m[1]).join('\n');

  const docTables = extractTables(docSql);
  const codeTables = extractTables(SCHEMA_SQL);

  const docNames = Object.keys(docTables).sort();
  const codeNames = Object.keys(codeTables).sort();

  if (docNames.join(',') !== codeNames.join(',')) {
    fail('Danh sách bảng không khớp',
      `tài liệu: ${docNames.join(', ')}\ncode    : ${codeNames.join(', ')}`);
  } else {
    ok(`Đủ ${codeNames.length} bảng: ${codeNames.join(', ')}`);
    let mismatch = 0;
    for (const t of codeNames) {
      if (docTables[t] !== codeTables[t]) {
        fail(`Bảng "${t}": định nghĩa cột trong tài liệu KHÁC code`);
        mismatch++;
      }
    }
    if (mismatch === 0) ok('Toàn bộ định nghĩa cột khớp 100% với schema.sql');
  }

  // Index
  const docIdx = (docSql.match(/CREATE INDEX/gi) || []).length;
  const codeIdx = (SCHEMA_SQL.match(/CREATE INDEX/gi) || []).length;
  if (docIdx !== codeIdx) fail(`Số index: tài liệu ${docIdx} vs code ${codeIdx}`);
  else ok(`Số index khớp: ${codeIdx}`);

  // Dữ liệu nạp sẵn (seed) phải được tài liệu hóa
  const codeSeeds = (SCHEMA_SQL.match(/INSERT\s+(?:OR\s+IGNORE\s+)?INTO/gi) || []).length;
  if (codeSeeds > 0) {
    const docMentionsSeed = /INSERT\s+(?:OR\s+IGNORE\s+)?INTO|nạp d[ữu] liệu|seed/i.test(DATA_CONTRACT);
    if (docMentionsSeed) ok(`${codeSeeds} lệnh nạp dữ liệu sẵn (seed) đã được tài liệu hóa`);
    else fail(`schema.sql có ${codeSeeds} lệnh INSERT nạp dữ liệu sẵn nhưng tài liệu KHÔNG nhắc tới`);
  }
}

// ============================================================================
// KIỂM TRA 4: TẦNG DI TRÚ CSDL (MIGRATION) phải được tài liệu hóa
// ============================================================================
section('KIỂM TRA 4: Tầng di trú CSDL (Migration)');

const dbjs = read(P('src', 'main', 'db', 'database.js'));
if (dbjs) {
  // Chỉ lấy lệnh SQL thật bên trong chuỗi, bỏ qua dòng comment giải thích
  const alters = [...dbjs.matchAll(/["'`]\s*((?:ALTER|DROP) TABLE[^"'`]*)["'`]/gi)]
    .map((m) => m[1].replace(/\s+/g, ' ').replace(/;$/, '').trim());
  const destructive = alters.filter((a) => /^DROP/i.test(a));

  if (alters.length === 0) {
    ok('Không có lệnh di trú nào cần tài liệu hóa');
  } else {
    const documented = [DATA_CONTRACT, ARCHITECTURE]
      .filter(Boolean)
      .some((d) => /migration|di tr[úu]|ALTER TABLE|n[âa]ng c[âấ]p CSDL/i.test(d));
    if (documented) {
      ok(`${alters.length} lệnh di trú đã được tài liệu hóa`);
    } else {
      fail(`Code có ${alters.length} lệnh di trú CSDL nhưng KHÔNG tài liệu nào nhắc tới:`,
        alters.join('\n'));
    }
    if (destructive.length > 0) {
      warn(`${destructive.length} lệnh di trú có tính PHÁ HỦY, bắt buộc phải nêu rõ trong tài liệu:`,
        destructive.join('\n'));
    }
  }
}

// ============================================================================
// KIỂM TRA 5: MÃ LỖI — code vs bảng mã lỗi trong tài liệu
// ============================================================================
section('KIỂM TRA 5: Bảng mã lỗi chuẩn hóa');

if (DATA_CONTRACT) {
  const codeErrors = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) walk(fp);
      else if (e.name.endsWith('.js')) {
        const c = read(fp) || '';
        // Dạng 1: gán vào .code của BẤT KỲ biến nào — error.code, err.code, authErr.code...
        // Chỉ khớp riêng 'error'/'err' là chưa đủ: OAUTH_AUTH_FAILED được gán qua
        // biến tên `authErr` nên từng bị bỏ sót và báo sai là "đặc tả chết".
        for (const m of c.matchAll(/\w+\.code\s*=\s*['"]([A-Z][A-Z_]{2,})['"]/g)) {
          codeErrors.add(m[1]);
        }
        // Dạng 2: giá trị mặc định   err.code || 'INTERNAL_ERROR'
        for (const m of c.matchAll(/\w+\.code\s*\|\|\s*['"]([A-Z][A-Z_]{2,})['"]/g)) {
          codeErrors.add(m[1]);
        }
      }
    }
  };
  walk(P('src'));

  // Chỉ lấy các dòng BẢNG trong mục "BẢNG MÃ LỖI", dừng trước mục kế tiếp.
  // Nếu quét cả phần sau, tên biến môi trường ở mục Cấu hình Bí mật
  // (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET...) sẽ bị nhận nhầm là mã lỗi.
  // Chỉ lấy Ô ĐẦU TIÊN của mỗi dòng bảng — đó là cột "Mã lỗi".
  // Nếu quét cả dòng, các tên biến môi trường được nhắc trong cột diễn giải
  // (ví dụ GOOGLE_CLIENT_ID ở dòng OAUTH_CONFIG_MISSING) sẽ bị nhận nhầm là mã lỗi.
  const docErrors = new Set();
  const errRows = (DATA_CONTRACT.match(/BẢNG MÃ LỖI[\s\S]*?(?=\n##\s)/) || [''])[0]
    .split('\n')
    .filter((l) => l.trimStart().startsWith('|'));
  for (const row of errRows) {
    const firstCell = row.split('|')[1] || '';
    const m = firstCell.match(/`([A-Z][A-Z_]{3,})`/);
    if (m) docErrors.add(m[1]);
  }

  const notDocumented = [...codeErrors].filter((c) => !docErrors.has(c)).sort();
  const notUsed = [...docErrors].filter((d) => !codeErrors.has(d)).sort();

  if (notDocumented.length === 0) ok(`Toàn bộ ${codeErrors.size} mã lỗi trong code đều được tài liệu hóa`);
  else fail(`${notDocumented.length} mã lỗi dùng trong code nhưng KHÔNG có trong bảng:`, notDocumented.join('\n'));

  if (notUsed.length === 0) ok('Không có mã lỗi nào bị đặc tả chết (documented nhưng không dùng)');
  else warn(`${notUsed.length} mã lỗi được tài liệu hóa nhưng KHÔNG dòng code nào dùng:`, notUsed.join('\n'));
}

// ============================================================================
// KIỂM TRA 6: TÍNH TOÀN VẸN CÚ PHÁP MARKDOWN (bắt lỗi sơ đồ mermaid vỡ)
// ============================================================================
section('KIỂM TRA 6: Cân bằng khối mã trong tài liệu Markdown');

for (const f of fs.readdirSync(ROOT).filter((n) => n.endsWith('.md'))) {
  const c = read(P(f));
  if (!c) continue;
  const fences = (c.match(/^```/gm) || []).length;
  if (fences % 2 !== 0) {
    fail(`${f}: có ${fences} dấu \`\`\` (số lẻ) → khối mã KHÔNG đóng đúng, sơ đồ sẽ không render`);
  }
}
if (errors === 0 || true) {
  const bad = fs.readdirSync(ROOT).filter((n) => n.endsWith('.md'))
    .filter((n) => ((read(P(n)) || '').match(/^```/gm) || []).length % 2 !== 0);
  if (bad.length === 0) ok('Toàn bộ tài liệu .md có khối mã cân bằng đúng');
}

// ============================================================================
// KIỂM TRA 7: KIẾN TRÚC phải nêu tên file code thật
// ============================================================================
section('KIỂM TRA 7: Kiến trúc có truy vết được xuống file code?');

if (ARCHITECTURE) {
  const realFiles = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) walk(fp);
      else if (/\.(js|sql|html)$/.test(e.name)) realFiles.push(e.name);
    }
  };
  walk(P('src'));

  const named = realFiles.filter((f) => ARCHITECTURE.includes(f));
  const pct = Math.round((named.length / realFiles.length) * 100);

  if (pct >= 80) {
    ok(`Kiến trúc nêu tên ${named.length}/${realFiles.length} file code (${pct}%)`);
  } else {
    fail(`Kiến trúc chỉ nêu tên ${named.length}/${realFiles.length} file code (${pct}%) — không truy vết được từ khái niệm xuống code`,
      `Thiếu ví dụ: ${realFiles.filter((f) => !ARCHITECTURE.includes(f)).slice(0, 6).join(', ')}`);
  }
}

// ============================================================================
// KIỂM TRA 8: PHIÊN BẢN SPEC không được lạc hậu so với Baseline
// ============================================================================
section('KIỂM TRA 8: Đồng bộ phiên bản Baseline ↔ Spec');

const baselines = fs.readdirSync(ROOT)
  .filter((n) => /^REQUIREMENT_BASELINE_v[\d.]+\.md$/.test(n))
  .sort((a, b) => {
    const v = (s) => parseFloat(s.match(/v([\d.]+)/)[1]);
    return v(a) - v(b);
  });

if (baselines.length > 0) {
  const latest = baselines[baselines.length - 1];
  const baseVer = parseFloat(latest.match(/v([\d.]+)/)[1]);
  ok(`Baseline mới nhất: ${latest} (v${baseVer})`);

  const stale = [];
  const unreadable = [];
  const specFiles = fs.readdirSync(ROOT).filter((n) => /^SPEC_S\d+.*\.md$/.test(n));

  for (const f of specFiles) {
    const c = read(P(f)) || '';
    // Định dạng thật: "- **Phiên bản:** *S01 v1.3 (Official – ...)*"
    const m = c.match(/Phiên bản:[^\n]*?\bv(\d+\.\d+)/i);
    if (!m) { unreadable.push(f); continue; }
    const v = parseFloat(m[1]);
    if (v < baseVer) stale.push(`${f} → v${v} (Baseline đã v${baseVer})`);
  }

  // Không đọc được phiên bản là LỖI, không phải cảnh báo: công cụ không đọc được
  // thì không thể kết luận là đồng bộ. Báo xanh khi chưa kiểm được là tự lừa mình.
  if (unreadable.length > 0) {
    fail(`Không đọc được phiên bản của ${unreadable.length} Spec → chưa thể kết luận đồng bộ:`,
      unreadable.join('\n'));
  }

  if (stale.length > 0) {
    fail(`${stale.length}/${specFiles.length} Spec lạc hậu so với Baseline:`, stale.join('\n'));
  } else if (unreadable.length === 0) {
    ok(`Toàn bộ ${specFiles.length} Spec đã ngang phiên bản với Baseline v${baseVer}`);
  }
}

// ============================================================================
// KẾT LUẬN
// ============================================================================
console.log(`\n${'='.repeat(80)}`);
console.log(`📊 KẾT QUẢ ĐỐI SOÁT: ${checks} hạng mục kiểm tra`);
console.log(`   ❌ Lỗi (bắt buộc sửa) : ${errors}`);
console.log(`   ⚠️  Cảnh báo           : ${warnings}`);
console.log('='.repeat(80));

if (errors > 0) {
  console.log('\n❌ TÀI LIỆU CHƯA ĐỒNG BỘ VỚI MÃ NGUỒN.');
  console.log('   Tuyệt đối KHÔNG ghi "ĐỒNG BỘ 100%" vào bảng tiến độ khi lệnh này còn báo đỏ.');
  process.exit(1);
}
console.log('\n✅ TÀI LIỆU ĐỒNG BỘ 100% VỚI MÃ NGUỒN (đã kiểm chứng bằng máy).');
process.exit(0);
