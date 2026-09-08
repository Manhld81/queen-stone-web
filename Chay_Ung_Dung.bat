@echo off
chcp 65001 >nul
title KHỞI CHẠY ỨNG DỤNG VIBE CODING
cd /d "%~dp0"

:: 1. Kiểm tra nếu file electron cục bộ đã có
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" .
    exit
)

:: 2. Kiểm tra nếu có electron toàn cục hoặc npx
where electron >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start "" electron .
    exit
)

:: 3. Thông báo thân thiện nếu là dự án mới chưa build
echo ================================================================================
echo ⚠️ THÔNG BÁO TỪ HỆ THỐNG VIBE CODING FRAMEWORK v4.0
echo ================================================================================
echo.
echo Dự án này hiện đang ở trạng thái KHỞI TẠO MỚI (Chưa bước vào Chặng 3 & 4).
echo Chưa có mã nguồn ứng dụng hoặc chưa cài đặt gói thư viện (node_modules).
echo.
echo 👉 Hướng dẫn cho Anh Mike:
echo   1. Mở thư mục này trong Antigravity IDE.
echo   2. AI đọc AI_CONTEXT.md -> kích hoạt Phỏng vấn Khai phá (Chặng 1).
echo   3. Chốt SRS -> Phân loại tác vụ -> Thiết kế Delta (Chặng 2 & 3).
echo   4. Em sẽ tự động viết mã và cài đặt để ứng dụng chạy được 100%!
echo.
echo ================================================================================
echo.
pause