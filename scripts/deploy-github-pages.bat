@echo off
REM 部署到 GitHub Pages 的本地腳本 (Windows)

echo 🚀 開始部署到 GitHub Pages...

REM 建置專案
echo 📦 建置專案...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 建置失敗
    exit /b 1
)

REM 安裝 gh-pages（如果未安裝）
where gh-pages >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 安裝 gh-pages...
    npm install -g gh-pages
)

REM 部署到 GitHub Pages
echo 🌐 部署到 GitHub Pages...
gh-pages -d dist -t true

if %errorlevel% equ 0 (
    echo ✅ 部署成功！
    echo 🔗 您的網站應該在幾分鐘內上線
) else (
    echo ❌ 部署失敗
    exit /b 1
)

