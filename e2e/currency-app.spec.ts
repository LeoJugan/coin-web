import { test, expect } from '@playwright/test'

test.describe('Currency App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display home page with currency data table', async ({ page }) => {
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 檢查頁面標題
    await expect(page.locator('h1, .v-toolbar__title')).toContainText('Welcome to CoinList')
    
    // 檢查是否有資料表格
    await expect(page.locator('.v-data-table')).toBeVisible()
    
    // 檢查表格標題
    await expect(page.locator('text=代碼')).toBeVisible()
    await expect(page.locator('text=中文')).toBeVisible()
    await expect(page.locator('text=描述')).toBeVisible()
    await expect(page.locator('text=符號')).toBeVisible()
    await expect(page.locator('text=匯率')).toBeVisible()
    await expect(page.locator('text=匯率數值')).toBeVisible()
    await expect(page.locator('text=修改日期')).toBeVisible()
    await expect(page.locator('text=類型')).toBeVisible()
  })

  test('should display loading state during data fetch', async ({ page }) => {
    // 監聽網路請求
    const responsePromise = page.waitForResponse('**/api/currenciesHist')
    
    // 重新載入頁面觸發 API 呼叫
    await page.reload()
    
    // 檢查載入狀態
    await expect(page.locator('text=資料傳輸中')).toBeVisible()
    
    // 等待 API 回應
    await responsePromise
    
    // 檢查載入狀態消失
    await expect(page.locator('text=資料傳輸中')).toBeHidden()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // 模擬 API 錯誤
    await page.route('**/api/currenciesHist', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' })
      })
    })
    
    // 重新載入頁面
    await page.reload()
    
    // 檢查錯誤處理（可能顯示無資料或錯誤訊息）
    await expect(page.locator('text=無資料')).toBeVisible()
  })

  test('should navigate to About page', async ({ page }) => {
    // 導航到 About 頁面
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    
    // 檢查 About 頁面內容
    await expect(page.locator('text=About')).toBeVisible()
  })

  test('should navigate back to Home page', async ({ page }) => {
    // 先導航到 About 頁面
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    
    // 導航回首頁
    await page.click('text=Home')
    await expect(page).toHaveURL('/')
    
    // 檢查首頁內容
    await expect(page.locator('text=Welcome to CoinList')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // 設定行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 檢查頁面是否正常顯示
    await expect(page.locator('.v-data-table')).toBeVisible()
    
    // 檢查表格是否可滾動
    const table = page.locator('.v-data-table')
    await expect(table).toBeVisible()
  })

  test('should display data table with proper formatting', async ({ page }) => {
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 檢查表格結構
    const table = page.locator('.v-data-table')
    await expect(table).toBeVisible()
    
    // 檢查表格標題行
    const headerRow = table.locator('thead tr')
    await expect(headerRow).toBeVisible()
    
    // 檢查是否有資料行（如果有的話）
    const dataRows = table.locator('tbody tr')
    const rowCount = await dataRows.count()
    
    if (rowCount > 0) {
      // 檢查第一行資料
      const firstRow = dataRows.first()
      await expect(firstRow).toBeVisible()
    }
  })

  test('should handle empty data state', async ({ page }) => {
    // 模擬空資料回應
    await page.route('**/api/currenciesHist', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })
    
    // 重新載入頁面
    await page.reload()
    
    // 檢查無資料狀態
    await expect(page.locator('text=無資料')).toBeVisible()
  })

  test('should maintain state during navigation', async ({ page }) => {
    // 等待首頁載入
    await page.waitForLoadState('networkidle')
    
    // 導航到 About 頁面
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    
    // 導航回首頁
    await page.click('text=Home')
    await expect(page).toHaveURL('/')
    
    // 檢查首頁狀態是否保持
    await expect(page.locator('.v-data-table')).toBeVisible()
  })
})
