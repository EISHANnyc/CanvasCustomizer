@echo off
setlocal
echo =======================================================
echo CanvasCustomizer Telemetry Database Deployer
echo =======================================================
echo.
cd /d "%~dp0"

echo 1. Checking Wrangler authentication...
powershell -ExecutionPolicy Bypass -Command "npx.cmd wrangler whoami"
if %errorlevel% neq 0 (
  echo.
  echo You need to log in to Cloudflare first (it's 100%% free).
  echo Opening browser login...
  powershell -ExecutionPolicy Bypass -Command "npx.cmd wrangler login"
)

echo.
echo 2. Deploying worker to Cloudflare...
powershell -ExecutionPolicy Bypass -Command "npx.cmd wrangler deploy"
echo.
echo [DONE] Database and telemetry API are live!
pause
