# Coin Web - 幣別管理系統

一個基於 Vue 3 + Vuetify 3 的現代化幣別管理系統，提供完整的 CRUD 功能和響應式設計。

## 🚀 技術棧

- **前端框架**: Vue 3 (Composition API)
- **UI 框架**: Vuetify 3
- **路由**: Vue Router 4
- **狀態管理**: Pinia
- **HTTP 客戶端**: Axios
- **構建工具**: Vite
- **測試框架**: Vitest + Vue Test Utils
- **E2E 測試**: Playwright
- **程式碼品質**: ESLint + Prettier
- **CI/CD**: 本地腳本 + 多平台支援

## 📋 功能特色

- ✅ **幣別管理**: 新增、編輯、刪除、查詢幣別資料
- ✅ **歷史記錄**: 查看幣別變更歷史
- ✅ **響應式設計**: 支援桌面和行動裝置
- ✅ **表單驗證**: 完整的輸入驗證機制
- ✅ **確認對話框**: 操作前的安全確認
- ✅ **即時搜尋**: 代碼重複檢查
- ✅ **資料格式化**: 匯率數值格式化顯示
- ✅ **統一 UI**: 基於 Vuetify 的現代化介面

## 🛠️ 開發環境設置

### 必要條件

- Node.js 18+ 
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

## 📦 可用腳本

### 開發
```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置生產版本
npm run preview      # 預覽生產版本
```

### 測試
```bash
npm run test:unit           # 執行單元測試
npm run test:unit:ui        # 開啟測試 UI
npm run test:unit:coverage  # 生成測試覆蓋率報告
npm run test:unit:watch     # 監聽模式測試
npm run test:integration    # 整合測試
npm run test:e2e           # E2E 測試
```

### 程式碼品質
```bash
npm run lint        # ESLint 檢查
npm run format      # Prettier 格式化
npm run type-check  # TypeScript 類型檢查
```

## 🏗️ 專案結構

```
src/
├── components/           # 可重用組件
│   ├── common/          # 通用組件
│   ├── dialogs/         # 對話框組件
│   └── forms/           # 表單組件
├── config/              # 配置檔案
├── stores/              # Pinia 狀態管理
├── types/               # TypeScript 類型定義
├── views/               # 頁面組件
├── router/              # 路由配置
├── test-utils/          # 測試工具
└── __tests__/           # 測試檔案
```

## 🧪 測試策略

### 單元測試
- 組件邏輯測試
- Store 狀態管理測試
- 工具函數測試

### 整合測試
- 組件間互動測試
- API 整合測試
- 路由測試

### E2E 測試
- 完整用戶流程測試
- 跨瀏覽器測試

## 🎨 核心組件

### InputField 組件
- 統一的表單輸入組件
- 內建標籤和佈局管理
- 支援響應式設計
- 自動驗證和錯誤處理
- 智能佈局計算（標籤佔輸入框空間的一半）

### 對話框組件
- `CoinInputVDialog`: Vuetify 版本
- 統一的 API 介面
- 確認對話框整合

### 狀態管理
- Pinia Store 管理應用狀態
- API 資料快取
- 確認對話框狀態管理
- 通知系統整合

## 🔧 配置說明

### Vite 配置
- Vue 3 支援
- Vuetify 自動導入
- TypeScript 支援
- 路徑別名設定

### Vitest 配置
- JSDOM 環境
- Vue Test Utils 整合
- 覆蓋率報告
- 測試排除規則

## 📊 測試覆蓋率

專案設定了 80% 的測試覆蓋率門檻：
- 分支覆蓋率: 80%
- 函數覆蓋率: 80%
- 行覆蓋率: 80%
- 語句覆蓋率: 80%

## 🚀 部署

### 部署選項
專案支援多種部署方式：
- 本地 CI/CD 腳本
- GitLab CI/CD
- Netlify
- Vercel
- 程式碼品質檢查
- 建置驗證
- 測試覆蓋率上傳

### 建置生產版本
```bash
npm run build
```

## 🎯 專案特色

### 現代化開發體驗
- Vue 3 Composition API
- TypeScript 類型安全
- Vite 快速建置
- 熱重載開發

### 完整的測試覆蓋
- 單元測試
- 整合測試
- E2E 測試
- 測試覆蓋率監控

### 響應式設計
- 桌面和行動裝置適配
- Vuetify 組件系統
- 自適應佈局

### 開發者友好
- ESLint + Prettier 程式碼格式化
- TypeScript 類型檢查
- 完整的開發工具鏈

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 開發規範

- 使用 TypeScript 進行類型安全
- 遵循 Vue 3 Composition API 最佳實踐
- 使用 ESLint 和 Prettier 保持程式碼風格一致
- 編寫完整的測試覆蓋
- 使用語義化的 commit 訊息

## 📄 授權

此專案採用 MIT 授權條款。

