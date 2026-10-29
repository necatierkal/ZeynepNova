@echo off
chcp 65001 >nul
echo ========================================================
echo   ZeynepNova - Birim ve Entegrasyon Testleri Calistiriliyor...
echo ========================================================
set "PATH=%LOCALAPPDATA%\nodejs;%PATH%"
call npm.cmd test
echo.
pause
