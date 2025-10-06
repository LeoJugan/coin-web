import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestVuetify } from '../../test-utils'
import CoinList from '../../views/CoinList.vue'

// Mock useAppApiDataStore
const mockGetByPath = vi.fn()

vi.mock('@/stores/app-api-data', () => ({
  useAppApiDataStore: () => ({
    getByPath: mockGetByPath
  })
}))

// Mock moment
vi.mock('moment', () => ({
  default: (_date: string) => ({
    format: (_format: string) => '2024/01/01 12:00:00'
  })
}))

describe('Component Integration Working Tests', () => {
  let homeWrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetByPath.mockResolvedValue([])
  })

  describe('CoinList Integration', () => {
    beforeEach(() => {
      homeWrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })
    })

    it('should load currency data on mount', async () => {
      await homeWrapper.vm.$nextTick()
      expect(mockGetByPath).toHaveBeenCalledWith('currencies')
    })

    it('should display currency data in table format', async () => {
      await homeWrapper.vm.$nextTick()
      
      const dataTable = homeWrapper.findComponent({ name: 'VDataTableServer' })
      expect(dataTable.exists()).toBe(true)
    })

    it('should handle data loading states', async () => {
      // Test loading state
      expect(homeWrapper.vm.autoSaveStatus).toBeUndefined()
      
      // Simulate API call
      await homeWrapper.vm.getCurrency()
      
      // Data should be loaded
      expect(homeWrapper.vm.items).toEqual([])
    })
  })

  describe('Store Integration', () => {
    it('should integrate with appApiDataStore correctly', async () => {
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      await wrapper.vm.$nextTick()
      
      expect(mockGetByPath).toHaveBeenCalledWith('currencies')
      expect((wrapper.vm as any).items).toEqual([])
    })

    it('should handle store state changes', async () => {
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      // Simulate store state change
      ;(wrapper.vm as any).items = []
      await wrapper.vm.$nextTick()

      const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
      expect(dataTable.props('items')).toEqual([])
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error')
      mockGetByPath.mockRejectedValue(error)
      
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      await (wrapper.vm as any).getCurrency()
      
      // 檢查錯誤處理
      expect((wrapper.vm as any).items).toEqual([])
    })

    it('should handle component errors gracefully', () => {
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      // Test component error handling
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })
  })
})

