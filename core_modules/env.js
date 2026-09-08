const fs = require('fs');
const path = require('path');

/**
 * BỘ NẠP CẤU HÌNH BÍ MẬT TỪ TỆP .env (ENVIRONMENT LOADER)
 * ============================================================================
 * VÌ SAO CẦN TỆP NÀY (giải thích White-box cho Anh Mike):
 *
 * Trước đây Client Secret của Google bị viết thẳng (*hardcode*) vào mã nguồn
 * `GoogleOAuthService.js`. Vì mã nguồn được Git theo dõi và đẩy lên GitHub, mật
 * khẩu đó đã bị công khai. Đây là lỗi bảo mật nghiêm trọng nhất của phiên bản cũ.
 *
 * Cách sửa chuẩn mực của ngành: tách bí mật ra khỏi mã nguồn.
 *   - Mã nguồn (được Git theo dõi, công khai)  → chỉ chứa TÊN của biến
 *   - Tệp `.env` (bị .gitignore chặn, riêng tư) → chứa GIÁ TRỊ thật của biến
 *
 * Nhờ vậy Anh có thể chia sẻ mã nguồn cho bất kỳ ai mà không lộ mật khẩu.
 *
 * Tệp này tự đọc `.env` mà KHÔNG cần cài thêm thư viện `dotenv`, giữ dự án gọn nhẹ.
 * ============================================================================
 */

/**
 * Bóc tách nội dung tệp .env thành từng cặp KHÓA=GIÁ_TRỊ
 * Hỗ trợ: dòng ghi chú (#), dòng trống, và dấu nháy bao quanh giá trị
 */
function parseEnvContent(content) {
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    // Bỏ qua dòng trống và dòng ghi chú
    if (!line || line.startsWith('#')) continue;

    // Tách tại dấu = ĐẦU TIÊN (giá trị có thể chứa dấu = bên trong)
    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key) continue;

    let value = line.slice(separatorIndex + 1).trim();

    // Gỡ dấu nháy bao quanh nếu có: KEY="giá trị" hoặc KEY='giá trị'
    if (value.length >= 2) {
      const first = value[0];
      const last = value[value.length - 1];
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
        value = value.slice(1, -1);
      }
    }

    result[key] = value;
  }

  return result;
}

/**
 * Nạp tệp .env vào process.env
 *
 * Nguyên tắc quan trọng: biến môi trường có sẵn của hệ thống LUÔN được ưu tiên,
 * tệp .env chỉ điền vào những khóa còn thiếu. Nhờ vậy khi đóng gói phát hành,
 * người dùng cuối có thể ghi đè cấu hình bằng biến môi trường của Windows.
 *
 * @param {string} [envFilePath] Đường dẫn tệp .env. Mặc định: gốc dự án
 * @returns {{ loaded: boolean, filePath: string, keys: string[] }}
 */
function loadEnv(envFilePath) {
  const targetPath = envFilePath || path.join(__dirname, '..', '..', '..', '.env');

  if (!fs.existsSync(targetPath)) {
    return { loaded: false, filePath: targetPath, keys: [] };
  }

  let parsed;
  try {
    parsed = parseEnvContent(fs.readFileSync(targetPath, 'utf8'));
  } catch (err) {
    console.error(`⚠️ Không đọc được tệp cấu hình ${targetPath}:`, err.message);
    return { loaded: false, filePath: targetPath, keys: [] };
  }

  const appliedKeys = [];
  for (const [key, value] of Object.entries(parsed)) {
    // Không ghi đè biến môi trường đã tồn tại của hệ thống
    if (process.env[key] === undefined) {
      process.env[key] = value;
      appliedKeys.push(key);
    }
  }

  return { loaded: true, filePath: targetPath, keys: appliedKeys };
}

module.exports = { loadEnv, parseEnvContent };
