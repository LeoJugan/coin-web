# 超時時間優化策略

## 🎯 **問題分析**

您說得對！90秒 確實太長了，這通常表示有根本性的渲染問題。讓我分析可能的原因：

### 1. **為什麼需要這麼長的超時？**

#### 可能的原因：
- **Vuetify 渲染問題**: Vuetify 組件在 Mobile Safari 上渲染緩慢
- **API 數據載入問題**: API 請求可能失敗或超時
- **Vue 應用載入問題**: Vue 應用可能在 Mobile Safari 上載入緩慢
- **CSS 兼容性問題**: 樣式可能不兼容 Mobile Safari
- **視窗大小問題**: 響應式設計可能導致表格隱藏

### 2. **根本問題診斷**

#### 常見問題：
- 表格存在但不可見（CSS 問題）
- 表格不存在（API 數據問題）
- 表格載入緩慢（渲染性能問題）
- 表格在視窗外（滾動問題）

## 🔧 **優化策略**

### 1. **智能等待策略**

```typescript
// 舊方法：盲目等待 90秒
await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })

// 新方法：分步驟檢查
// 1. 檢查表格是否存在
const tableExists = await page.locator('.v-data-table-server').count()
console.log('表格存在:', tableExists > 0)

// 2. 檢查表格是否可見
const isVisible = await page.locator('.v-data-table-server').isVisible()
console.log('表格可見:', isVisible)

// 3. 如果不可見，嘗試滾動
if (!isVisible) {
  const table = page.locator('.v-data-table-server')
  await table.scrollIntoViewIfNeeded()
}

// 4. 使用較短的超時時間
await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 15000 })
```

### 2. **超時時間優化**

#### 新的超時策略：
- **基本等待**: 15秒（從 60秒 減少）
- **表格等待**: 15秒（從 90秒 減少）
- **標題檢查**: 15秒（從 60秒 減少）
- **導航等待**: 30秒（保持合理）

#### 超時時間分佈：
```typescript
// 快速檢查（15秒）
await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 15000 })
await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 15000 })

// 標題檢查（15秒）
await expect(page.locator('text=代碼')).toBeVisible({ timeout: 15000 })

// 導航等待（30秒）
await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 30000 })
```

### 3. **早期問題檢測**

#### 診斷測試：
```typescript
test('should diagnose rendering issues on Mobile Safari', async ({ page }) => {
  // 檢查基本元素
  const title = await page.locator('h1').textContent()
  console.log('Page title:', title)
  
  // 檢查表格存在
  const dataTableExists = await page.locator('.v-data-table-server').count()
  console.log('Data table exists:', dataTableExists > 0)
  
  // 檢查表格可見性
  const isVisible = await page.locator('.v-data-table-server').isVisible()
  console.log('Data table visible:', isVisible)
  
  // 檢查表格樣式
  const tableStyles = await page.locator('.v-data-table-server').evaluate(el => {
    const computed = window.getComputedStyle(el)
    return {
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity
    }
  })
  console.log('Table styles:', tableStyles)
})
```

## 📊 **優化效果**

### 1. **超時時間減少**
- **90秒 → 15秒**: 表格等待時間
- **60秒 → 15秒**: 標題檢查時間
- **60秒 → 30秒**: 導航等待時間

### 2. **問題診斷能力**
- **早期檢測**: 快速發現渲染問題
- **詳細日誌**: 記錄每個步驟的狀態
- **樣式檢查**: 分析 CSS 渲染問題
- **滾動處理**: 自動處理視窗位置問題

### 3. **測試穩定性**
- **智能等待**: 根據實際情況調整等待策略
- **錯誤處理**: 提供詳細的錯誤信息
- **重試機制**: 自動嘗試滾動和重新檢查

## 🎯 **預期效果**

### 1. **快速失敗**
- 如果表格真的不存在，15秒內就會失敗
- 不會浪費 90秒 等待不存在的元素

### 2. **快速成功**
- 如果表格存在且可見，15秒內就會成功
- 大大減少測試執行時間

### 3. **問題診斷**
- 通過診斷測試快速定位問題
- 提供詳細的調試信息
- 幫助開發者快速修復問題

## 🚀 **後續建議**

### 1. **監控測試結果**
- 觀察 15秒 超時是否足夠
- 根據實際情況調整超時時間
- 如果仍然超時，進一步分析根本原因

### 2. **進一步優化**
- 如果 15秒 仍然不夠，檢查是否有其他問題
- 考慮使用更短的超時時間（10秒）
- 添加更多的診斷信息

### 3. **根本問題修復**
- 如果表格渲染確實很慢，考慮優化前端代碼
- 檢查 Vuetify 配置是否適合 Mobile Safari
- 考慮使用更輕量的表格組件

## 📝 **總結**

通過這些優化，我們：
1. **大幅減少超時時間**（90秒 → 15秒）
2. **提高問題診斷能力**（詳細的日誌和檢查）
3. **改善測試穩定性**（智能等待策略）
4. **快速發現根本問題**（早期檢測機制）

這樣既能快速發現問題，又能避免不必要的長時間等待。
