@echo off
setlocal
title RTL Chat for ZCode - Uninstaller

echo ==========================================
echo  RTL Chat for ZCode - one-click uninstall
echo ==========================================
echo.

set "ASAR=%LOCALAPPDATA%\Programs\ZCode\resources\app.asar"
if not exist "%ASAR%" set "ASAR=C:\Program Files\ZCode\resources\app.asar"
if not exist "%ASAR%" (
  echo [X] ZCode was not found in the default locations.
  pause
  exit /b 1
)

if not exist "%~dp0asar-work\app.asar.bak" (
  echo [X] Backup file not found: asar-work\app.asar.bak
  echo     Without the backup the original app.asar cannot be restored.
  pause
  exit /b 1
)

echo Closing ZCode if it is running...
taskkill /IM ZCode.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

copy /Y "%~dp0asar-work\app.asar.bak" "%ASAR%" >nul
if errorlevel 1 (
  echo [X] Restore FAILED - right-click this file and choose
  echo     "Run as administrator", then try again.
  pause
  exit /b 1
)

echo [OK] Original app.asar restored. RTL patch removed.
echo      Start ZCode normally.
echo.
pause
