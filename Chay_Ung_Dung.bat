@echo off
chcp 65001 >nul
title KHỞI CHẠY HỆ THỐNG WEB QUEEN STONE — ĐÁ TỰ NHIÊN HOÀNG GIA
cd /d "%~dp0"

echo ================================================================================
echo 👑 HỆ THỐNG SHOWROOM TRỰC TUYẾN QUEEN STONE — ĐÁ TỰ NHIÊN ĐỘC BẢN
echo ================================================================================
echo.
echo [1/3] Đang kiểm tra môi trường Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [LỖI] Không tìm thấy Node.js trên máy tính! Vui lòng cài đặt Node.js để tiếp tục.
    pause
    exit /b 1
)

echo [2/3] Đang khởi động máy chủ Web Server trên cổng 3000...
start "Queen Stone Web Server (Port 3000)" cmd /k "node src/server.js"

echo [3/3] Đang tự động mở trình duyệt tới Showroom Queen Stone...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ================================================================================
echo ✅ HỆ THỐNG ĐÃ SẴN SÀNG!
echo 👉 Địa chỉ Showroom: http://localhost:3000
echo 👉 Để dừng hệ thống: Đóng cửa sổ 'Queen Stone Web Server' đang chạy.
echo ================================================================================
echo.
timeout /t 5 >nul
exit