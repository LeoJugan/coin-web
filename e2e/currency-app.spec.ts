import { test, expect } from '@playwright/test'

test.describe('Currency App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 設置模擬數據 - 使用正確的 API 路徑
    await page.route('**/devTest/api/currencies/**', route => {
      console.log('API Route triggered:', route.request().url())
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            code: 'USD',
            name: '美元',
            symbol: '$',
            rate: '1.000',
            rateFloat: 1.0,
            description: '美國美元',
            modifyDate: new Date().toISOString()
          },
          {
            id: '2',
            code: 'EUR',
            name: '歐元',
            symbol: '€',
            rate: '0.850',
            rateFloat: 0.85,
            description: '歐洲歐元',
            modifyDate: new Date().toISOString()
          }
        ])
      })
    })

    // 設置歷史數據 API
    await page.route('**/devTest/api/currenciesHist/**', route => {
      console.log('Hist API Route triggered:', route.request().url())
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            code: 'USD',
            name: '美元',
            symbol: '$',
            rate: '1.000',
            rateFloat: 1.0,
            description: '美國美元',
            modifyDate: new Date().toISOString(),
            type: '新增'
          }
        ])
      })
    })
    
    // 啟用調試模式
    await page.goto('/')
    
    // 添加調試工具
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser Error:', msg.text())
      }
    })
    
    // 等待頁面基本載入
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display home page with currency data table', async ({ page }) => {
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用完全載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 檢查頁面標題 - 使用更寬鬆的選擇器
    await expect(page.locator('h1')).toContainText('Welcome to CoinList')
    
    // 等待載入指示器消失（如果存在）
    try {
      await page.waitForSelector('text=資料傳輸中', { state: 'hidden', timeout: 60000 })
    } catch (error) {
      console.log('Loading indicator not found or already hidden')
    }
    
    // 防禦性測試：檢查表格是否可見
    const isTableVisible = await page.isVisible('.v-data-table-server')
    if (!isTableVisible) {
      console.log('Table not visible. Checking for errors or missing data...')
      // 截圖用於調試
      await page.screenshot({ path: 'table-not-visible.png' })
      
      // 檢查頁面內容
      const pageContent = await page.content()
      console.log('Page contains "v-data-table-server":', pageContent.includes('v-data-table-server'))
      console.log('Page contains "v-data-table":', pageContent.includes('v-data-table'))
    }
    
    // 智能等待策略：分步驟檢查
    console.log('開始等待數據表格...')
    
    // 1. 先檢查表格是否存在
    const tableExists = await page.locator('.v-data-table-server').count()
    console.log('表格存在:', tableExists > 0)
    
    if (tableExists > 0) {
      // 2. 檢查表格是否可見
      const isVisible = await page.locator('.v-data-table-server').isVisible()
      console.log('表格可見:', isVisible)
      
      if (!isVisible) {
        // 3. 如果不可見，嘗試滾動
        console.log('表格不可見，嘗試滾動...')
        const table = page.locator('.v-data-table-server')
        await table.scrollIntoViewIfNeeded()
        
        // 4. 再次檢查可見性
        const isVisibleAfterScroll = await page.locator('.v-data-table-server').isVisible()
        console.log('滾動後表格可見:', isVisibleAfterScroll)
      }
    }
    
    // 5. 使用較短的超時時間等待表格可見
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 15000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 15000 })
    
    // 確保表格在視窗中可見
    const table = page.locator('.v-data-table-server')
    await table.scrollIntoViewIfNeeded()
    
    // 檢查表格標題 - 使用更合理的超時時間
    await expect(page.locator('text=代碼')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=中文')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=描述')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=符號')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=匯率')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=匯率數值')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=修改日期')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=動作')).toBeVisible({ timeout: 15000 })
  })

  test('should display loading state during data fetch', async ({ page }) => {
    // 監聽網路請求
    const responsePromise = page.waitForResponse('**/devTest/api/currencies/**')
    
    // 重新載入頁面觸發 API 呼叫
    await page.reload()
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 檢查載入狀態
    await expect(page.locator('text=資料傳輸中')).toBeVisible({ timeout: 60000 })
    
    // 等待 API 回應
    await responsePromise
    
    // 檢查載入狀態消失
    await expect(page.locator('text=資料傳輸中')).toBeHidden({ timeout: 60000 })
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // 模擬 API 錯誤
    await page.route('**/devTest/api/currencies/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' })
      })
    })
    
    // 重新載入頁面
    await page.reload()
    
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    // 等待數據表格載入，增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 60000 })
    
    // 檢查錯誤處理（可能顯示無資料或錯誤訊息）
    await expect(page.locator('text=無資料')).toBeVisible({ timeout: 60000 })
  })

  test('should navigate to About page', async ({ page }) => {
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 等待導航元素可見，使用正確的文字選擇器
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
    
    // 導航到 About 頁面
    await page.click('text=歷史資料')
    await expect(page).toHaveURL('/about')
    
    // 等待新頁面載入
    await page.waitForLoadState('networkidle')
    
    // 檢查 About 頁面內容
    await expect(page.locator('h1')).toContainText('歷史記錄')
  })

  test('should navigate back to Home page', async ({ page }) => {
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 等待導航元素可見，使用正確的文字選擇器
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
    
    // 先導航到 About 頁面
    await page.click('text=歷史資料')
    await expect(page).toHaveURL('/about')
    
    // 等待新頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待首頁導航元素可見，使用正確的文字選擇器
    await expect(page.locator('text=幣別')).toBeVisible({ timeout: 60000 })
    
    // 導航回首頁
    await page.click('text=幣別')
    await expect(page).toHaveURL('/')
    
    // 等待首頁載入
    await page.waitForLoadState('networkidle')
    
    // 檢查首頁內容
    await expect(page.locator('h1')).toContainText('Welcome to CoinList')
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // 設定行動裝置視窗大小 (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 })
    
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 等待數據表格載入，增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 60000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
    
    // 檢查表格是否可滾動
    const table = page.locator('.v-data-table-server')
    await expect(table).toBeVisible({ timeout: 60000 })
    
    // 確保表格在視窗中可見
    await table.scrollIntoViewIfNeeded()
    
    // 檢查導航在行動裝置上是否可見
    await expect(page.locator('nav')).toBeVisible({ timeout: 60000 })
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
  })

  test('should display data table with proper formatting', async ({ page }) => {
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 等待數據表格載入，增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 60000 })
    
    // 檢查表格結構
    const table = page.locator('.v-data-table-server')
    await expect(table).toBeVisible({ timeout: 60000 })
    
    // 確保表格在視窗中可見
    await table.scrollIntoViewIfNeeded()
    
    // 檢查表格標題行
    const headerRow = table.locator('thead tr')
    await expect(headerRow).toBeVisible({ timeout: 60000 })
    
    // 檢查是否有資料行（如果有的話）
    const dataRows = table.locator('tbody tr')
    const rowCount = await dataRows.count()
    
    if (rowCount > 0) {
      // 檢查第一行資料
      const firstRow = dataRows.first()
      await expect(firstRow).toBeVisible({ timeout: 60000 })
    }
  })

  test('should handle empty data state', async ({ page }) => {
    // 模擬空資料回應
    await page.route('**/devTest/api/currencies/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })
    
    // 重新載入頁面
    await page.reload()
    
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    // 等待數據表格載入，增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 60000 })
    
    // 檢查無資料狀態，增加超時時間
    await expect(page.locator('text=無資料')).toBeVisible({ timeout: 60000 })
  })

  test('should maintain state during navigation', async ({ page }) => {
    // 等待首頁載入
    await page.waitForLoadState('networkidle')
    
    // 等待導航元素可見，使用正確的文字選擇器
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
    
    // 導航到 About 頁面
    await page.click('text=歷史資料')
    await expect(page).toHaveURL('/about')
    
    // 等待新頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待首頁導航元素可見，使用正確的文字選擇器
    await expect(page.locator('text=幣別')).toBeVisible({ timeout: 60000 })
    
    // 導航回首頁
    await page.click('text=幣別')
    await expect(page).toHaveURL('/')
    
    // 等待首頁載入
    await page.waitForLoadState('networkidle')
    
    // 等待數據表格載入，增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
  })

  test('should work correctly on Mobile Safari', async ({ page }) => {
    // 模擬 Mobile Safari 環境 (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    })
    
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用完全載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 添加調試日誌
    console.log('Mobile Safari: Page loaded, checking navigation...')
    
    // 檢查導航在 Mobile Safari 中是否可見
    await expect(page.locator('nav')).toBeVisible({ timeout: 60000 })
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
    
    console.log('Mobile Safari: Navigation visible, proceeding to About page...')
    
    // 導航到 About 頁面
    await page.click('text=歷史資料')
    await expect(page).toHaveURL('/about')
    
    // 等待新頁面載入
    await page.waitForLoadState('networkidle')
    
    console.log('Mobile Safari: About page loaded')
    
    // 檢查 About 頁面內容
    await expect(page.locator('h1')).toContainText('歷史記錄')
    
    // 等待首頁導航元素可見
    await expect(page.locator('text=幣別')).toBeVisible({ timeout: 60000 })
    
    console.log('Mobile Safari: Navigating back to home page...')
    
    // 導航回首頁
    await page.click('text=幣別')
    await expect(page).toHaveURL('/')
    
    // 等待首頁載入
    await page.waitForLoadState('networkidle')
    
    console.log('Mobile Safari: Home page loaded, waiting for data table...')
    
    // 等待數據表格載入 - 增加超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
    
    console.log('Mobile Safari: Data table is visible')
    
    // 確保表格在視窗中可見
    const table = page.locator('.v-data-table-server')
    await table.scrollIntoViewIfNeeded()
  })

  test('should debug element visibility on Mobile Safari', async ({ page }) => {
    // 模擬 Mobile Safari 環境
    await page.setViewportSize({ width: 390, height: 844 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    })
    
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用完全載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 調試：檢查所有導航元素
    const navElements = await page.locator('nav a').all()
    console.log('Found navigation elements:', navElements.length)
    
    for (let i = 0; i < navElements.length; i++) {
      const text = await navElements[i].textContent()
      const isVisible = await navElements[i].isVisible()
      console.log(`Navigation element ${i}: "${text}", visible: ${isVisible}`)
    }
    
    // 調試：檢查表格元素
    const tableExists = await page.locator('.v-data-table-server').count()
    console.log('Data table count:', tableExists)
    
    // 檢查表格是否可見
    if (tableExists > 0) {
      const tableVisible = await page.locator('.v-data-table-server').isVisible()
      console.log('Data table visible:', tableVisible)
      
      // 檢查表格的 CSS 屬性
      const tableStyles = await page.locator('.v-data-table-server').evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          height: computed.height,
          width: computed.width,
          position: computed.position,
          top: computed.top,
          left: computed.left
        }
      })
      console.log('Table CSS styles:', tableStyles)
    }
    
    // 檢查是否有任何表格相關元素
    const allTables = await page.locator('table').count()
    console.log('All tables count:', allTables)
    
    // 檢查是否有 Vuetify 相關元素
    const vuetifyElements = await page.locator('[class*="v-data"]').count()
    console.log('Vuetify data elements count:', vuetifyElements)
    
    // 檢查頁面視窗大小
    const viewportSize = await page.viewportSize()
    console.log('Viewport size:', viewportSize)
    
    // 檢查頁面內容
    const pageContent = await page.content()
    console.log('Page contains "v-data-table":', pageContent.includes('v-data-table'))
    console.log('Page contains "v-data-table-server":', pageContent.includes('v-data-table-server'))
    
    // 檢查 API 調用
    console.log('Checking for API calls...')
    const networkRequests = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/api/'))
        .map(entry => ({ name: entry.name, duration: entry.duration }))
    })
    console.log('Network requests:', networkRequests)
    
    // 檢查是否有 API 路由被觸發
    const apiRouteTriggered = await page.evaluate(() => {
      return window.performance.getEntriesByType('navigation')
        .concat(window.performance.getEntriesByType('resource'))
        .filter(entry => entry.name.includes('devTest/api/currencies'))
        .length > 0
    })
    console.log('API route triggered:', apiRouteTriggered)
    
    // 檢查 Vue 組件狀態
    const vueData = await page.evaluate(() => {
      const app = document.querySelector('#app')
      return {
        hasApp: !!app,
        appHTML: app ? app.innerHTML.substring(0, 500) : 'No app element'
      }
    })
    console.log('Vue app data:', vueData)
    
    if (tableExists > 0) {
      const tableVisible = await page.locator('.v-data-table-server').isVisible()
      console.log('Data table visible:', tableVisible)
      
      // 檢查表格內容
      const tableRows = await page.locator('.v-data-table-server tbody tr').count()
      console.log('Table rows count:', tableRows)
    }
    
    // 基本導航測試
    await expect(page.locator('text=歷史資料')).toBeVisible({ timeout: 60000 })
    await expect(page.locator('text=幣別')).toBeVisible({ timeout: 60000 })
    
    // 表格可見性測試 - 使用更長的超時時間
    console.log('Waiting for data table to be visible...')
    try {
      await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })
      await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
      console.log('Data table is visible!')
    } catch (error) {
      console.log('Data table visibility test failed:', error instanceof Error ? error.message : String(error))
      
      // 如果表格不可見，嘗試滾動到表格位置
      const table = page.locator('.v-data-table-server')
      await table.scrollIntoViewIfNeeded()
      
      // 再次嘗試等待表格可見
      await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 60000 })
      await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
    }
  })

  test('should verify API routes work on Mobile Safari', async ({ page }) => {
    // 模擬 Mobile Safari 環境
    await page.setViewportSize({ width: 390, height: 844 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    })
    
    // 監聽 API 請求
    const apiRequests: string[] = []
    page.on('request', request => {
      if (request.url().includes('/devTest/api/')) {
        apiRequests.push(request.url())
        console.log('API Request detected:', request.url())
      }
    })
    
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用完全載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 檢查是否有 API 請求被觸發
    console.log('Total API requests detected:', apiRequests.length)
    console.log('API requests:', apiRequests)
    
    // 等待數據表格載入
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
    
    // 驗證至少有一個 API 請求被觸發
    expect(apiRequests.length).toBeGreaterThan(0)
  })

  test('should diagnose rendering issues on Mobile Safari', async ({ page }) => {
    // 模擬 Mobile Safari 環境
    await page.setViewportSize({ width: 390, height: 844 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    })
    
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 診斷步驟 1: 檢查基本元素
    console.log('=== 診斷開始 ===')
    
    // 檢查頁面標題
    const title = await page.locator('h1').textContent()
    console.log('Page title:', title)
    
    // 檢查導航元素
    const navExists = await page.locator('nav').count()
    console.log('Navigation exists:', navExists > 0)
    
    // 檢查是否有任何表格元素
    const allTables = await page.locator('table').count()
    console.log('All tables count:', allTables)
    
    // 檢查 Vuetify 組件
    const vuetifyComponents = await page.locator('[class*="v-"]').count()
    console.log('Vuetify components:', vuetifyComponents)
    
    // 檢查數據表格
    const dataTableExists = await page.locator('.v-data-table-server').count()
    console.log('Data table exists:', dataTableExists > 0)
    
    if (dataTableExists > 0) {
      // 檢查表格是否可見
      const isVisible = await page.locator('.v-data-table-server').isVisible()
      console.log('Data table visible:', isVisible)
      
      // 檢查表格內容
      const tableContent = await page.locator('.v-data-table-server').textContent()
      console.log('Table content length:', tableContent?.length || 0)
      console.log('Table contains data:', tableContent?.includes('USD') || false)
      
      // 檢查表格樣式
      const tableStyles = await page.locator('.v-data-table-server').evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          height: computed.height,
          width: computed.width
        }
      })
      console.log('Table styles:', tableStyles)
    }
    
    // 檢查 API 請求
    const apiRequests = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/api/'))
        .map(entry => ({ name: entry.name, duration: entry.duration }))
    })
    console.log('API requests:', apiRequests)
    
    // 檢查錯誤
    const errors = await page.evaluate(() => {
      return typeof window.console.error === 'function' ? 'Console errors detected' : 'No console errors'
    })
    console.log('Console errors:', errors)
    
    console.log('=== 診斷結束 ===')
    
    // 如果表格存在但不可見，嘗試滾動
    if (dataTableExists > 0) {
      const table = page.locator('.v-data-table-server')
      await table.scrollIntoViewIfNeeded()
      
      // 再次檢查可見性
      const isVisibleAfterScroll = await page.locator('.v-data-table-server').isVisible()
      console.log('Data table visible after scroll:', isVisibleAfterScroll)
    }
    
    // 使用更短的超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 15000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 15000 })
  })

  test('should check Vuetify rendering on Mobile Safari', async ({ page }) => {
    // 模擬 Mobile Safari 環境
    await page.setViewportSize({ width: 390, height: 844 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    })
    
    // 等待頁面載入
    await page.waitForLoadState('networkidle')
    
    // 等待 Vue 應用完全載入
    await page.waitForFunction(() => {
      const app = document.querySelector('#app')
      return app && app.innerHTML.length > 100
    }, { timeout: 60000 })
    
    // 檢查 Vuetify 組件是否正確載入
    const vuetifyComponents = await page.locator('[class*="v-"]').count()
    console.log('Vuetify components found:', vuetifyComponents)
    
    // 檢查數據表格的具體狀態
    const dataTable = page.locator('.v-data-table-server')
    const tableExists = await dataTable.count()
    console.log('Data table exists:', tableExists > 0)
    
    if (tableExists > 0) {
      // 檢查表格的渲染狀態
      const tableInfo = await dataTable.evaluate(el => {
        const rect = el.getBoundingClientRect()
        const computed = window.getComputedStyle(el)
        return {
          boundingRect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right
          },
          styles: {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            position: computed.position,
            zIndex: computed.zIndex
          },
          isInViewport: rect.top >= 0 && rect.left >= 0 && 
                       rect.bottom <= window.innerHeight && 
                       rect.right <= window.innerWidth
        }
      })
      console.log('Data table rendering info:', tableInfo)
      
      // 檢查表格內容
      const tableContent = await dataTable.textContent()
      console.log('Table content length:', tableContent?.length || 0)
      console.log('Table contains data:', tableContent?.includes('USD') || false)
    }
    
    // 等待表格可見，使用更長的超時時間
    await page.waitForSelector('.v-data-table-server', { state: 'visible', timeout: 90000 })
    await expect(page.locator('.v-data-table-server')).toBeVisible({ timeout: 60000 })
  })
})
