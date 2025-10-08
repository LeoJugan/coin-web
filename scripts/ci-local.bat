@echo off
REM 本地 CI/CD 腳本 (Windows)
REM 適用於 Windows 命令提示字元

echo 🚀 開始本地 CI/CD 流程...

REM 檢查 Node.js 版本
echo 📋 檢查 Node.js 版本...
node --version
npm --version

REM 安裝依賴
echo 📦 安裝依賴...
npm ci

REM 安裝 Playwright 瀏覽器
echo 🎭 安裝 Playwright 瀏覽器...
npx playwright install --with-deps

REM 執行單元測試
echo 🧪 執行單元測試...
npm run test:unit:coverage

if %errorlevel% neq 0 (
    echo ❌ 單元測試失敗
    exit /b 1
)

REM 執行整合測試
echo 🔗 執行整合測試...
npm run test:integration

if %errorlevel% neq 0 (
    echo ❌ 整合測試失敗
    exit /b 1
)

REM 執行 E2E 測試
echo 🌐 執行 E2E 測試...
npm run test:e2e

if %errorlevel% neq 0 (
    echo ❌ E2E 測試失敗
    exit /b 1
)

REM 建置專案
echo 🏗️ 建置專案...
npm run build-with-type-check

if %errorlevel% neq 0 (
    echo ❌ 建置失敗
    exit /b 1
)

REM 部署 (可選)
if "%1"=="--deploy" (
    echo 🚀 部署到 GitHub Pages...
    npm run deploy
)

echo ✅ CI/CD 流程完成！

