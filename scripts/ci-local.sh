#!/bin/bash
# 本地 CI/CD 腳本
# 適用於 Windows (Git Bash) 和 Linux/Mac

echo "🚀 開始本地 CI/CD 流程..."

# 檢查 Node.js 版本
echo "📋 檢查 Node.js 版本..."
node --version
npm --version

# 安裝依賴
echo "📦 安裝依賴..."
npm ci

# 安裝 Playwright 瀏覽器
echo "🎭 安裝 Playwright 瀏覽器..."
npx playwright install --with-deps

# 執行單元測試
echo "🧪 執行單元測試..."
npm run test:unit:coverage

# 檢查測試結果
if [ $? -ne 0 ]; then
    echo "❌ 單元測試失敗"
    exit 1
fi

# 執行整合測試
echo "🔗 執行整合測試..."
npm run test:integration

if [ $? -ne 0 ]; then
    echo "❌ 整合測試失敗"
    exit 1
fi

# 執行 E2E 測試
echo "🌐 執行 E2E 測試..."
npm run test:e2e

if [ $? -ne 0 ]; then
    echo "❌ E2E 測試失敗"
    exit 1
fi

# 建置專案
echo "🏗️ 建置專案..."
npm run build-with-type-check

if [ $? -ne 0 ]; then
    echo "❌ 建置失敗"
    exit 1
fi

# 部署 (可選)
if [ "$1" = "--deploy" ]; then
    echo "🚀 部署到 GitHub Pages..."
    npm run deploy
fi

echo "✅ CI/CD 流程完成！"

