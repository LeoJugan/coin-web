# E2E 測試修復 - Mobile Safari 超時問題

## 問題描述
E2E 測試在 Mobile Safari 環境中出現超時問題，主要表現為：
- 等待 `.v-data-table-server` 元素超時（30秒）
- 測試在導航和重新載入後無法找到數據表格
- 特別影響 Mobile Safari 測試

## 修復內容

### 1. 選擇器一致性修復
- **問題**: 測試中存在不一致的選擇器（`.v-data-table-server-server` vs `.v-data-table-server`）
- **修復**: 統一使用 `.v-data-table-server` 選擇器
- **影響文件**: `e2e/currency-app.spec.ts`

### 2. 超時時間優化
- **Mobile Safari 專用測試**: 將超時時間從 30秒 增加到 90秒
- **導航測試**: 將超時時間從 30秒 增加到 60秒
- **一般測試**: 將超時時間從 30秒 增加到 60秒
- **無資料狀態檢查**: 將超時時間從 30秒 增加到 60秒

### 3. 調試日誌增強
- **API 路由日誌**: 添加 API 請求觸發日誌
- **測試進度日誌**: 在關鍵步驟添加 console.log
- **網路請求監聽**: 添加 API 請求監聽和驗證
- **DOM 調試**: 添加表格 CSS 樣式和位置檢查
- **Vue 應用等待**: 確保 Vue 應用完全載入後再進行測試

### 4. Playwright 配置優化
- **Mobile Safari 專用配置**:
  - `actionTimeout`: 60000ms
  - `navigationTimeout`: 120000ms
  - `slowMo`: 100ms
  - `waitForTimeout`: 2000ms
- **調試功能**: 啟用 trace、video、screenshot

### 5. API 模擬驗證
- **新增測試**: `should verify API routes work on Mobile Safari`
- **API 請求監聽**: 驗證 API 路由是否正常觸發
- **路由日誌**: 記錄所有 API 請求的 URL

### 6. Vue 應用等待策略
- **Vue 應用載入檢查**: 確保 Vue 應用完全載入後再進行測試
- **DOM 內容驗證**: 檢查 #app 元素是否有足夠的內容
- **超時時間**: 60秒等待 Vue 應用載入

### 7. Vuetify 渲染檢查
- **新增測試**: `should check Vuetify rendering on Mobile Safari`
- **組件計數**: 檢查 Vuetify 組件數量
- **渲染狀態**: 檢查表格的邊界矩形和 CSS 樣式
- **視窗位置**: 驗證表格是否在視窗範圍內

## 修改的文件

### `e2e/currency-app.spec.ts`
- 統一選擇器為 `.v-data-table-server`
- 增加 Mobile Safari 測試的超時時間
- 添加詳細的調試日誌
- 新增 API 路由驗證測試

### `playwright.config.ts`
- 優化 Mobile Safari 配置
- 增加超時時間和調試功能
- 添加 slowMo 和 waitForTimeout 設置

## 測試策略

### 1. 分層測試
- **基本功能測試**: 驗證頁面載入和基本導航
- **Mobile Safari 專用測試**: 針對 Mobile Safari 環境的特殊處理
- **API 驗證測試**: 確保 API 模擬正常工作
- **調試測試**: 提供詳細的診斷信息

### 2. 超時策略
- **一般測試**: 60秒超時
- **Mobile Safari**: 90秒超時
- **導航測試**: 60秒超時
- **API 等待**: 90秒超時

### 3. 調試策略
- **API 請求監聽**: 記錄所有 API 調用
- **元素可見性檢查**: 驗證表格元素是否存在
- **頁面內容分析**: 檢查 HTML 內容和 Vue 組件狀態
- **網路請求分析**: 驗證 API 路由是否被觸發

## 預期效果

1. **減少超時錯誤**: 通過增加超時時間和優化等待策略
2. **提高調試能力**: 通過詳細的日誌記錄快速定位問題
3. **確保 API 正常工作**: 通過 API 請求監聽驗證模擬數據
4. **改善 Mobile Safari 兼容性**: 通過專門的配置和測試

## 後續建議

1. **監控測試結果**: 觀察修復後的測試通過率
2. **調整超時時間**: 根據實際運行情況進一步優化
3. **擴展調試功能**: 如果問題持續，可以添加更多診斷信息
4. **考慮環境差異**: 檢查 CI 環境和本地環境的差異

## 相關文件
- `e2e/currency-app.spec.ts` - 主要測試文件
- `playwright.config.ts` - Playwright 配置
- `src/views/CoinList.vue` - 數據表格組件
- `src/views/CoinListHist.vue` - 歷史記錄組件