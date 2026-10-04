@echo off
setlocal
title RTL Chat for ZCode - Installer

echo ==========================================
echo  RTL Chat for ZCode - one-click installer
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js not found. Install it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

set "ASAR=%LOCALAPPDATA%\Programs\ZCode\resources\app.asar"
if not exist "%ASAR%" set "ASAR=C:\Program Files\ZCode\resources\app.asar"
if not exist "%ASAR%" (
  echo [X] ZCode was not found in the default locations.
  set /p "ASAR=Enter the full path to ZCode resources\app.asar: "
)
if not exist "%ASAR%" (
  echo [X] Path not found: "%ASAR%"
  pause
  exit /b 1
)
echo ZCode found: "%ASAR%"
echo.
echo Closing ZCode if it is running...
taskkill /IM ZCode.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

set "ZCODE_ASAR=%ASAR%"
node "%~dp0asar-work\patch-asar.mjs" --apply
if errorlevel 1 (
  echo.
  echo [X] Patch FAILED - read the error above.
  echo     "anchor missing" means your ZCode version needs an updated patch.
  pause
  exit /b 1
)

echo.
echo [OK] Installed. Start ZCode normally and look for the RTL toggle
echo      near the chat input box (bottom toolbar). Click it to toggle RTL.
echo.
pause
