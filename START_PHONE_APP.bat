@echo off
setlocal
cd /d "%~dp0"

set "HOST=0.0.0.0"
set "NODE_EXE=node"
set "PORT="

for %%P in (3010 3017 3020 3021 3022 3023 3024 3025) do (
  if not defined PORT (
    netstat -ano | findstr /R /C:":%%P .*LISTENING" >nul
    if errorlevel 1 set "PORT=%%P"
  )
)

if not defined PORT set "PORT=3030"

where node >nul 2>nul
if errorlevel 1 (
  set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

if not exist "%NODE_EXE%" if not "%NODE_EXE%"=="node" (
  echo Node.js was not found.
  echo Install Node.js or run this app from Codex once to use the bundled runtime.
  pause
  exit /b 1
)

set "PHONE_IP="
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
  if not defined PHONE_IP set "PHONE_IP=%%A"
)
for /f "tokens=* delims= " %%A in ("%PHONE_IP%") do set "PHONE_IP=%%A"

echo.
echo Khayubdi app is starting...
echo.
echo Computer: http://localhost:%PORT%/
echo Setup:    http://localhost:%PORT%/phone
if defined PHONE_IP echo Phone:    http://%PHONE_IP%:%PORT%/
echo.
echo Keep this window open while using the app on your phone.
echo If the phone cannot open it, allow Node.js through Windows Firewall.
echo.

start "" "http://localhost:%PORT%/phone"
"%NODE_EXE%" server.js
pause
