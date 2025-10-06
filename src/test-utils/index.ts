import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@vue/test-utils'

// 測試用的 Vuetify 實例
export const createTestVuetify = () => {
  return createVuetify({
    theme: {
      defaultTheme: 'light'
    }
  })
}

// 測試用的 Router 實例
export const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/about', component: { template: '<div>About</div>' } }
    ]
  })
}

// 設定全域測試配置
export const setupTestConfig = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  
  config.global.plugins = [createTestVuetify(), pinia, createTestRouter()]
}

// Mock API 回應
export const mockApiResponse = {
  success: (data: any) => ({
    data,
    status: 200,
    statusText: 'OK'
  }),
  error: (message: string, status = 400) => ({
    data: { error: message },
    status,
    statusText: 'Bad Request'
  })
}

// Mock 貨幣資料 (用於組件測試)
export const mockCurrencyData = [
  {
    id: '1',
    code: 'USD',
    name: '美元',
    symbol: '&#36;',
    rate: '50,000.000',
    rateFloat: 50000.0,
    description: 'United States Dollar',
    modifyDate: '2024-01-01T12:00:00Z'
  },
  {
    id: '2',
    code: 'EUR',
    name: '歐元',
    symbol: '&euro;',
    rate: '45,000.000',
    rateFloat: 45000.0,
    description: 'Euro',
    modifyDate: '2024-01-01T12:00:00Z'
  }
]

// Mock API 回應資料 (用於 API 整合測試)
export const mockApiCurrencyData = {
  bpi: {
    USD: {
      code: 'USD',
      symbol: '&#36;',
      rate: '50,000.000',
      description: 'United States Dollar',
      rate_float: 50000.0
    },
    EUR: {
      code: 'EUR',
      symbol: '&euro;',
      rate: '45,000.000',
      description: 'Euro',
      rate_float: 45000.0
    }
  },
  disclaimer: 'This data was produced from the CoinDesk Bitcoin Price Index',
  time: {
    updated: 'Jan 1, 2024 00:00:00 UTC',
    updatedISO: '2024-01-01T00:00:00+00:00',
    updateduk: 'Jan 1, 2024 at 00:00 GMT'
  }
}

// 測試用的 Snackbar 項目
export const mockSnackbarItem = {
  snackbarText: '測試訊息',
  color: 'primary',
  timeout: 3000
}

// 測試用的確認項目
export const mockConfirmItem = {
  title: '確認測試',
  content: '這是一個測試確認對話框',
  btnText: '確認',
  snackbarText: '操作完成',
  color: 'primary',
  snackbarTimeout: 2000
}

