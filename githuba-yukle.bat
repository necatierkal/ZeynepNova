@echo off
chcp 65001 >nul
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin;%LOCALAPPDATA%\git\cmd;%LOCALAPPDATA%\nodejs;%PATH%"

echo ========================================================
echo   ZeynepNova - GitHub'a Projeyi Yukleme Araci
echo ========================================================
echo.
echo Hedef Depo: https://github.com/necatierkal/ZeynepNova.git
echo.

gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo GitHub oturumu henuz acilmamis.
    echo Simdi tarayiciniz acilacak ve tek tikla giris yapmaniz istenecek...
    echo.
    gh auth login --web -p https -h github.com
    if %ERRORLEVEL% NEQ 0 (
        echo [HATA] GitHub girisi tamamlanamadi.
        pause
        exit /b 1
    )
)

echo.
echo Git kimlik dogrulamasi yapilandiriliyor...
gh auth setup-git

echo.
echo Kodlar GitHub'a yukleniyor (git push)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [TEBRIKLER] Tum kodlar basariyla GitHub'a yuklendi!
    echo   Depo Adresi: https://github.com/necatierkal/ZeynepNova
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [BILGI] Eger uzaktaki depoda (README vb.) farkli dosyalar
    echo   varsa birlestirme deneniyor...
    echo ========================================================
    git pull origin main --rebase
    git push -u origin main
)

echo.
pause
