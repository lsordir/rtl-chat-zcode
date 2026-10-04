@echo off
setlocal
title RTL Chat for ZCode - Uninstaller

echo ==========================================
echo  RTL Chat for ZCode - one-click uninstall
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
  pause
  exit /b 1
)

echo Closing ZCode if it is running...
taskkill /IM ZCode.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

set "ZCODE_ASAR=%ASAR%"
node "%~dp0asar-work\patch-asar.mjs" --unpatch
if errorlevel 1 goto fallback

echo [OK] RTL patch removed from ZCode. Start ZCode normally.
echo      A pristine backup also lives at:
echo      %LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak
echo.
pause
exit /b 0

:fallback
echo.
echo [!] Surgical removal failed. Restoring the pristine backup instead...
if exist "%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak" (
  copy /Y "%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak" "%ASAR%" >nul
  if errorlevel 1 (
    echo [X] Restore FAILED - right-click this file, "Run as administrator", retry.
    echo     Manual restore: copy "%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak" over "%ASAR%"
    pause
    exit /b 1
  )
  echo [OK] Original app.asar restored from stable backup.
  pause
  exit /b 0
)
if exist "%~dp0asar-work\app.asar.bak" (
  copy /Y "%~dp0asar-work\app.asar.bak" "%ASAR%" >nul
  if errorlevel 1 (
    echo [X] Restore FAILED - right-click this file, "Run as administrator", retry.
    pause
    exit /b 1
  )
  echo [OK] Original app.asar restored from repo backup.
  pause
  exit /b 0
)
echo [X] No backup found and surgical removal failed.
echo     Reinstall the same ZCode version, then run this uninstaller again.
pause
