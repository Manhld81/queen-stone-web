@echo off
chcp 65001 >nul
title ĐẨY MÃ NGUỒN QUEEN STONE LÊN GITHUB ĐỂ DEPLOY KOYEB CLOUD
cd /d "%~dp0"

echo ================================================================================
echo 👑 QUEEN STONE — TỰ ĐỘNG HÓA ĐẨY CODE LÊN GITHUB CHO KOYEB DEPLOY
echo ================================================================================
echo.

:: 1. Kiểm tra Git
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [LỖI] Không tìm thấy Git trên máy tính! Vui lòng cài Git để tiếp tục.
    pause
    exit /b 1
)

:: 2. Nhận đường dẫn kho GitHub của Anh Mike
echo 👉 Bước 1: Hãy tạo 1 Repository mới trên GitHub (Ví dụ: queen-stone-web)
echo    (Để chế độ Public hoặc Private đều được)
echo.
set /p REPO_URL="👉 Hãy DÁN đường link GitHub Repository của Anh vào đây rồi bấm Enter: "

if "%REPO_URL%"=="" (
    echo [LỖI] Anh chưa nhập đường link GitHub! Vui lòng chạy lại file.
    pause
    exit /b 1
)

echo.
echo ================================================================================
echo [1/4] Đang đóng gói dữ liệu và checkpoint CSDL SQLite...
node -e "try { const { getDb } = require('./src/db/database'); const db = getDb(); db.pragma('wal_checkpoint(TRUNCATE)'); console.log('  ✅ Checkpoint CSDL thành công!'); } catch(e){}"

echo.
echo [2/4] Đang thêm tất cả các file vào Git...
git add .

echo.
echo [3/4] Đang tạo bản ghi Commit chuẩn bị xuất xưởng...
git commit -m "feat: dong goi toan dien Queen Stone san sang deploy Koyeb Cloud 24/7"

echo.
echo [4/4] Đang kết nối Remote và đẩy lên nhánh main...
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================================
    echo 🎉 XUẤT SẮC! MÃ NGUỒN ĐÃ ĐƯỢC ĐẨY THÀNH CÔNG LÊN GITHUB!
    echo.
    echo 👉 Bước tiếp theo rất đơn giản:
    echo 1. Vào trang: https://app.koyeb.com
    echo 2. Bấm "Create App" -> Chọn "GitHub"
    echo 3. Chọn Repository vừa đẩy lên -> Bấm "Deploy"
    echo 4. Koyeb sẽ tự động cấp cho Anh đường link HTTPS để gửi khách test!
    echo ================================================================================
    echo.
    echo Đang tự động mở trang Koyeb trên trình duyệt...
    timeout /t 2 /nobreak >nul
    start https://app.koyeb.com
) else (
    echo.
    echo ================================================================================
    echo ⚠️ Có lỗi khi đẩy lên GitHub!
    echo Anh hãy kiểm tra lại:
    echo - Đường link GitHub đã nhập chính xác chưa?
    echo - Anh đã đăng nhập tài khoản GitHub trên máy chưa?
    echo ================================================================================
)

echo.
pause
