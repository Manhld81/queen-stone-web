@echo off
chcp 65001 >nul
title CHIA SẺ TRANG WEB QUEEN STONE RA INTERNET TỨC THÌ ĐỂ TEST
cd /d "%~dp0"

echo ================================================================================
echo 👑 QUEEN STONE — CÔNG CỤ CHIA SẺ RA INTERNET TỨC THÌ (DEMO NÓNG)
echo ================================================================================
echo.
echo [1/3] Đang kiểm tra máy chủ nội bộ trên cổng 3000...
netstat -ano | findstr ":3000" >nul
if %ERRORLEVEL% neq 0 (
    echo [THÔNG BÁO] Máy chủ chưa chạy. Đang tự động khởi động Web Server...
    start "Queen Stone Web Server (Port 3000)" cmd /k "node src/server.js"
    timeout /t 3 /nobreak >nul
) else (
    echo   ✅ Máy chủ nội bộ cổng 3000 đang hoạt động sẵn sàng!
)

echo.
echo [2/3] Đang kích hoạt đường hầm bảo mật HTTPS an toàn...
echo ================================================================================
echo 👉 CHÚ Ý: Đường link truy cập HTTPS cho khách hàng sẽ hiển thị bên dưới.
echo 👉 Anh chỉ cần COPY đường link (có dạng https://...pinggy.link) gửi qua Zalo!
echo 👉 Để dừng chia sẻ: Nhấn Ctrl + C hoặc đóng cửa sổ này.
echo ================================================================================
echo.

ssh -o StrictHostKeyChecking=no -p 443 -R0:localhost:3000 a.pinggy.io

pause
