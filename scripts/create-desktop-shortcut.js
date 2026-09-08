/**
 * Script tạo Shortcut Desktop dùng PowerShell EncodedCommand (Base64 UTF-16LE)
 * Sử dụng icon chuẩn đặt tại LocalAppData (100% ASCII) để Windows Explorer hiển thị logo hoàn hảo!
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function createDesktopShortcut() {
  const projectRoot = path.resolve(__dirname, '..');
  const electronExe = path.join(projectRoot, 'node_modules', 'electron', 'dist', 'electron.exe');
  const powershellExe = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';

  // Thư mục LocalAppData an toàn tuyệt đối (không có dấu tiếng Việt)
  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\Users\\Asus', 'AppData', 'Local');
  const appDataIconDir = path.join(localAppData, 'ValuationCaseManager');
  if (!fs.existsSync(appDataIconDir)) {
    fs.mkdirSync(appDataIconDir, { recursive: true });
  }
  const localIcoPath = path.join(appDataIconDir, 'app-icon.ico');
  const projectIcoPath = path.join(projectRoot, 'assets', 'app-icon.ico');

  if (fs.existsSync(projectIcoPath)) {
    fs.copyFileSync(projectIcoPath, localIcoPath);
  }

  // Nội dung lệnh PowerShell chạy ngầm ứng dụng
  const psPayload = [
    // Gỡ biến ELECTRON_RUN_AS_NODE nếu môi trường có đặt.
    // Biến này buộc electron.exe chạy như Node.js thuần, khiến require('electron')
    // trả về chuỗi thay vì API, và biến `app` thành undefined -> ứng dụng sập ngay
    // khi mở với lỗi "Cannot read properties of undefined (reading 'commandLine')".
    // Một số IDE dựng trên Electron (VS Code, Antigravity...) có đặt biến này.
    `Remove-Item Env:\\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue`,
    `Set-Location -LiteralPath '${projectRoot.replace(/'/g, "''")}'`,
    `$exe = 'node_modules\\electron\\dist\\electron.exe'`,
    `if (Test-Path $exe) {`,
    `    Start-Process $exe -ArgumentList '.'`,
    `} else {`,
    `    Start-Process 'npm.cmd' -ArgumentList 'start' -WindowStyle Hidden`,
    `}`
  ].join('\r\n');

  // Mã hoá UTF-16LE sang Base64 chuẩn của PowerShell -EncodedCommand (Miễn nhiễm 100% với lỗi bảng mã Unicode)
  const encodedCommand = Buffer.from(psPayload, 'utf16le').toString('base64');
  const psArgs = `-WindowStyle Hidden -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${encodedCommand}`;

  const desktopPsCode = `
$desktop = [Environment]::GetFolderPath('Desktop')
if (-not $desktop -or -not (Test-Path $desktop)) {
    $desktop = Join-Path $env:USERPROFILE 'Desktop'
}
$finalPath = Join-Path $desktop 'Quản lý hồ sơ thẩm định.lnk'
# Đối tượng COM WScript.Shell của PowerShell 5.1 làm hỏng ký tự ngoài bảng mã ANSI
# khi lưu (.Save()). Nên tạo trước bằng tên ASCII, sau đó đổi tên bằng .NET —
# .NET xử lý tên tệp Unicode chính xác 100%.
$tempPath = Join-Path $desktop 'VCM_shortcut_temp.lnk'
$shortcutPath = $tempPath
$powershellExe = '${powershellExe.replace(/'/g, "''")}'
$projectRoot = '${projectRoot.replace(/'/g, "''")}'
$localIcoPath = '${localIcoPath.replace(/'/g, "''")}'
$electronExe = '${electronExe.replace(/'/g, "''")}'

$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($shortcutPath)
$sc.TargetPath = $powershellExe
$sc.Arguments = '${psArgs}'
$sc.WorkingDirectory = $projectRoot
$sc.Description = 'Quan ly ho so tham dinh gia - Valuation Case Manager (Lab 01 v3.0)'
if (Test-Path $localIcoPath) {
    $sc.IconLocation = "$localIcoPath,0"
} elseif (Test-Path $electronExe) {
    $sc.IconLocation = "$electronExe,0"
}
$sc.Save()

# Đổi sang tên tiếng Việt bằng .NET (xử lý Unicode chính xác, khác COM)
if ([System.IO.File]::Exists($tempPath)) {
    if ([System.IO.File]::Exists($finalPath)) {
        [System.IO.File]::Delete($finalPath)
    }
    [System.IO.File]::Move($tempPath, $finalPath)
}

if ([System.IO.File]::Exists($finalPath)) {
    Write-Host "SUCCESS:$finalPath"
} else {
    Write-Host "FAILED"
}
`;

  const tempPsPath = path.join(__dirname, 'temp_create_ps_shortcut.ps1');
  try {
    // Ghi t\u1EC7p t\u1EA1m b\u1EB1ng UTF-16LE k\u00E8m BOM.
    // L\u00FD do: Windows PowerShell 5.1 nh\u1EADn di\u1EC7n UTF-16LE tuy\u1EC7t \u0111\u1ED1i ch\u1EAFc ch\u1EAFn nh\u1EDD BOM,
    // trong khi UTF-8 c\u00F3 BOM v\u1EABn c\u00F3 th\u1EC3 b\u1ECB \u0111\u1ECDc theo b\u1EA3ng m\u00E3 ANSI c\u1EE7a h\u1EC7 th\u1ED1ng trong
    // m\u1ED9t s\u1ED1 c\u1EA5u h\u00ECnh \u2014 l\u00E0m h\u1ECFng d\u1EA5u ti\u1EBFng Vi\u1EC7t trong t\u00EAn t\u1EC7p l\u1ED1i t\u1EAFt
    // ("Qu\u1EA3n l\u00FD h\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh" bi\u1EBFn th\u00E0nh "Qu?n l\u00FD h? so th?m d?nh" r\u1ED3i l\u01B0u th\u1EA5t b\u1EA1i).
    fs.writeFileSync(tempPsPath, '\uFEFF' + desktopPsCode, { encoding: 'utf16le' });
    const output = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPsPath}"`, { encoding: 'utf8' });
    if (fs.existsSync(tempPsPath)) {
      fs.unlinkSync(tempPsPath);
    }

    if (output.includes('SUCCESS:')) {
      const createdPath = output.split('SUCCESS:')[1].trim();
      console.log('============================================================');
      console.log('✅ ĐÃ THIẾT LẬP SHORTCUT POWERSHELL ENCODEDCOMMAND KÈM LOGO THÀNH CÔNG!');
      console.log(`📌 Tên Lối tắt: Quản lý hồ sơ thẩm định`);
      console.log(`📂 Vị trí: ${createdPath}`);
      console.log(`🎨 Icon Logo: ${localIcoPath}`);
      console.log(`🚀 Cơ chế: PowerShell EncodedCommand (Base64 UTF-16LE)`);
      console.log('============================================================');
    } else {
      console.error('❌ Lỗi khi lưu Shortcut:', output);
    }
  } catch (error) {
    if (fs.existsSync(tempPsPath)) {
      try { fs.unlinkSync(tempPsPath); } catch {}
    }
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

createDesktopShortcut();
