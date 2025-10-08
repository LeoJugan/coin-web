# 測試文檔

## 測試架構

本專案採用多層測試架構，包含：

- **單元測試 (Unit Tests)**: 測試個別組件和函數
- **整合測試 (Integration Tests)**: 測試組件間的互動
- **端對端測試 (E2E Tests)**: 測試完整的用戶流程

## 測試工具

- **Vitest**: 單元測試和整合測試框架
- **Vue Test Utils**: Vue 組件測試工具
- **Playwright**: 端對端測試工具
- **Vuetify**: UI 組件測試支援

## 執行測試

### 單元測試

```bash
# 執行所有單元測試
npm run test:unit

# 執行單元測試並生成覆蓋率報告
npm run test:unit:coverage

# 監聽模式執行測試
npm run test:unit:watch

# 開啟測試 UI
npm run test:unit:ui
```

### 整合測試

```bash
# 執行整合測試
npm run test:integration
```

### 端對端測試

```bash
# 執行 E2E 測試
npm run test:e2e

# 開啟 E2E 測試 UI
npm run test:e2e:ui

# 以有頭模式執行 E2E 測試
npm run test:e2e:headed
```

### 完整測試套件

```bash
# 執行所有測試
npm run test:all

# CI 環境測試
npm run test:ci
```

## 測試覆蓋率

測試覆蓋率目標：
- 分支覆蓋率: 80%
- 函數覆蓋率: 80%
- 行覆蓋率: 80%
- 語句覆蓋率: 80%

## 測試檔案結構

```
src/
├── __tests__/
│   └── integration/           # 整合測試
├── components/
│   ├── __tests__/           # 組件單元測試
│   └── common/
│       └── __tests__/       # 通用組件測試
├── stores/
│   └── __tests__/           # Store 測試
├── views/
│   └── __tests__/           # 視圖測試
├── router/
│   └── __tests__/           # 路由測試
└── test-utils/              # 測試工具
e2e/                         # E2E 測試
```

## 測試最佳實踐

### 1. 單元測試

- 測試組件的渲染
- 測試 props 傳遞
- 測試事件處理
- 測試計算屬性
- 測試生命週期鉤子

### 2. 整合測試

- 測試組件間的互動
- 測試 Store 整合
- 測試路由整合
- 測試 API 整合

### 3. E2E 測試

- 測試完整的用戶流程
- 測試跨瀏覽器相容性
- 測試響應式設計
- 測試錯誤處理

## Mock 和測試工具

### 測試工具函數

```typescript
// 建立測試用的 Vuetify 實例
createTestVuetify()

// 建立測試用的 Router 實例
createTestRouter()

// Mock API 回應
mockApiResponse.success(data)
mockApiResponse.error(message, status)

// Mock 資料
mockCurrencyData
mockSnackbarItem
mockConfirmItem
```

### Mock 配置

- **Axios**: 自動 mock HTTP 請求
- **Vuetify**: 提供測試用的 Vuetify 實例
- **Pinia**: 提供測試用的 Store 實例
- **Vue Router**: 提供測試用的路由實例

## 持續整合

### CI/CD 支援

專案支援多種 CI/CD 平台：

- 本地 CI/CD 腳本
- GitLab CI/CD
- Netlify
- Vercel
- 生成測試報告
- 上傳覆蓋率報告
- 程式碼品質檢查

### 測試環境

- **Node.js**: 20.x, 22.x
- **作業系統**: Ubuntu Latest
- **瀏覽器**: Chrome, Firefox, Safari
- **行動裝置**: Pixel 5, iPhone 12

## 故障排除

### 常見問題

1. **測試環境設定問題**
   - 檢查 `vitest.config.ts` 配置
   - 確認測試工具設定正確

2. **Mock 問題**
   - 檢查 mock 函數是否正確設定
   - 確認 mock 範圍是否正確

3. **E2E 測試問題**
   - 檢查 Playwright 配置
   - 確認測試環境設定

### 除錯技巧

- 使用 `--debug` 模式執行測試
- 檢查測試日誌
- 使用測試 UI 工具
- 檢查覆蓋率報告

## 測試資料

### Mock 資料

專案提供了完整的 mock 資料：

- 貨幣資料 (`mockCurrencyData`)
- 確認對話框資料 (`mockConfirmItem`)
- Snackbar 資料 (`mockSnackbarItem`)
- API 回應 (`mockApiResponse`)

### 測試資料管理

- 使用 `test-utils` 統一管理測試資料
- 提供可重用的 mock 函數
- 支援不同測試場景的資料

## 貢獻指南

### 新增測試

1. 為新功能新增對應的單元測試
2. 更新整合測試
3. 新增 E2E 測試場景
4. 更新測試文檔

### 測試命名規範

- 測試檔案: `*.spec.ts`
- 測試描述: 使用中文描述測試目的
- 測試案例: 使用 `should` 開頭描述預期行為

### 程式碼品質

- 保持測試程式碼簡潔
- 使用有意義的測試名稱
- 避免重複的測試程式碼
- 定期重構測試程式碼