#!/bin/bash
# 部署到 GitHub Pages 的本地腳本

echo "🚀 開始部署到 GitHub Pages..."

# 建置專案
echo "📦 建置專案..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 建置失敗"
    exit 1
fi

# 安裝 gh-pages（如果未安裝）
if ! command -v gh-pages &> /dev/null; then
    echo "📦 安裝 gh-pages..."
    npm install -g gh-pages
fi

# 部署到 GitHub Pages
echo "🌐 部署到 GitHub Pages..."
gh-pages -d dist -t true

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🔗 您的網站應該在幾分鐘內上線"
else
    echo "❌ 部署失敗"
    exit 1
fi

