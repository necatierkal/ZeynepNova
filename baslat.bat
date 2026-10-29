@echo off
chcp 65001 >nul
echo ========================================================
echo   ZeynepNova - Gelistirme Sunucusu Baslatiliyor...
echo ========================================================
set "PATH=%LOCALAPPDATA%\nodejs;%PATH%"
echo Node Surumu:
node -v
echo.
echo Sunucu aciliyor... Tarayicinizda http://localhost:3000 adresine gidin.
echo Sunucuyu durdurmak icin: Ctrl + C
echo ========================================================
echo.
call npm.cmd run dev
pause
