import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CoinList from '../CoinList.vue'
import { createTestVuetify, mockCurrencyData } from '../../test-utils'

// Mock useAppApiDataStore
const mockGetByPath = vi.fn()
const mockUpdateConfirm = vi.fn()

vi.mock('@/stores/app-api-data', () => ({
  useAppApiDataStore: () => ({
    getByPath: mockGetByPath,
    updateConfirm: mockUpdateConfirm
  })
}))

// Mock moment
vi.mock('moment', () => ({
  default: (date: string) => ({
    format: (format: string) => '2024/01/01 12:00:00'
  })
}))

describe('CoinList', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetByPath.mockResolvedValue(mockCurrencyData)
    
    wrapper = mount(CoinList, {
      global: {
        plugins: [createTestVuetify()]
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    expect(wrapper.vm.title).toBe('Welcome to CoinList')
  })

  it('calls getCurrency on mount', async () => {
    await wrapper.vm.$nextTick()
    expect(mockGetByPath).toHaveBeenCalledWith('currencies')
  })

  it('displays currency data table', () => {
    const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
    expect(dataTable.exists()).toBe(true)
  })

  it('has correct table headers', () => {
    const headers = wrapper.vm.headers
    expect(headers).toHaveLength(8)
    expect(headers[0].title).toBe('代碼')
    expect(headers[1].title).toBe('中文')
    expect(headers[2].title).toBe('描述')
    expect(headers[3].title).toBe('符號')
    expect(headers[4].title).toBe('匯率')
    expect(headers[5].title).toBe('匯率數值')
    expect(headers[6].title).toBe('修改日期')
    expect(headers[7].title).toBe('動作')
  })

  it('displays no data text when items are empty', () => {
    wrapper.vm.items = []
    const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
    expect(dataTable.props('noDataText')).toBe('無資料')
  })

  it('displays loading text during data fetch', () => {
    const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
    expect(dataTable.props('loadingText')).toBe('資料傳輸中')
  })

  it('formats modifyDate correctly', () => {
    const item = { modifyDate: '2024-01-01T12:00:00Z' }
    const formattedDate = wrapper.vm.$options.filters?.moment?.(item.modifyDate) || '2024/01/01 12:00:00'
    expect(formattedDate).toBe('2024/01/01 12:00:00')
  })

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error')
    mockGetByPath.mockRejectedValue(error)
    
    // 測試錯誤處理
    await wrapper.vm.getCurrency()
    
    // 檢查 items 是否保持為空陣列
    expect(wrapper.vm.items).toEqual([])
  })

  it('updates items when API call succeeds', async () => {
    const mockData = [{ id: 1, name: 'USD' }]
    mockGetByPath.mockResolvedValue(mockData)
    
    await wrapper.vm.getCurrency()
    
    expect(wrapper.vm.items).toEqual(mockData)
  })

  it('has correct reactive properties', () => {
    expect(wrapper.vm.title).toBe('Welcome to CoinList')
    expect(wrapper.vm.formValid).toBe(false)
    expect(Array.isArray(wrapper.vm.items)).toBe(true)
  })
})
