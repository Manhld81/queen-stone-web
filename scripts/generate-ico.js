/**
 * Script chuyển đổi logo sang định dạng PNG và Windows Multi-Resolution 32-bit ICO
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function generateAppIcons() {
  const projectRoot = path.resolve(__dirname, '..');
  const assetsDir = path.join(projectRoot, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const sourceJpg = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\460d5b63-f12f-4575-8450-6c4cb5e3adcb\\valuation_app_icon_1788029518308.jpg';
  const destPng = path.join(assetsDir, 'app-icon.png');
  const destIco = path.join(assetsDir, 'app-icon.ico');

  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\Users\\Asus', 'AppData', 'Local');
  const appDataIconDir = path.join(localAppData, 'ValuationCaseManager');
  if (!fs.existsSync(appDataIconDir)) {
    fs.mkdirSync(appDataIconDir, { recursive: true });
  }
  const localIco = path.join(appDataIconDir, 'app-icon.ico');

  const psScript = `
Add-Type -AssemblyName System.Drawing

$sourceImg = [System.Drawing.Image]::FromFile('${sourceJpg.replace(/'/g, "''")}')

# 1. Lưu PNG chất lượng cao
$sourceImg.Save('${destPng.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Tạo 6 tầng độ phân giải chuẩn của Windows: 256, 128, 64, 48, 32, 16 (32-bit ARGB)
$sizes = @(256, 128, 64, 48, 32, 16)
$entries = @()

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($sourceImg, 0, 0, $s, $s)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()

    $entries += ,@($s, $pngBytes)
}
$sourceImg.Dispose()

function Save-Ico($filePath, $entriesList) {
    $fs = New-Object System.IO.FileStream($filePath, [System.IO.FileMode]::Create)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$entriesList.Count)

    $offset = 6 + (16 * $entriesList.Count)
    foreach ($entry in $entriesList) {
        $s = $entry[0]
        $data = $entry[1]

        $w = if ($s -ge 256) { [byte]0 } else { [byte]$s }
        $h = if ($s -ge 256) { [byte]0 } else { [byte]$s }

        $bw.Write($w)
        $bw.Write($h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$data.Length)
        $bw.Write([uint32]$offset)

        $offset += $data.Length
    }

    foreach ($entry in $entriesList) {
        $data = $entry[1]
        $bw.Write($data)
    }

    $bw.Close()
    $fs.Close()
}

Save-Ico '${destIco.replace(/'/g, "''")}' $entries
Save-Ico '${localIco.replace(/'/g, "''")}' $entries

Write-Host "PERFECT_ICO_GENERATED_SUCCESS"
`;

  const tempPs = path.join(__dirname, 'temp_gen_ico.ps1');
  try {
    fs.writeFileSync(tempPs, '\uFEFF' + psScript, { encoding: 'utf8' });
    const output = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPs}"`, { encoding: 'utf8' });
    if (fs.existsSync(tempPs)) {
      fs.unlinkSync(tempPs);
    }
    console.log('✅ Đã tạo PNG:', destPng);
    console.log('✅ Đã tạo Windows 32-bit Multi-Res ICO:', destIco);
    console.log('✅ Đã copy sang LocalAppData:', localIco);
  } catch (err) {
    if (fs.existsSync(tempPs)) {
      try { fs.unlinkSync(tempPs); } catch {}
    }
    console.error('❌ Lỗi tạo icon:', err.message);
    process.exit(1);
  }
}

generateAppIcons();
