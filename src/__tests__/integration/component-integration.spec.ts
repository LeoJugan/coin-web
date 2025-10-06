import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestVuetify, createTestRouter, mockCurrencyData, mockConfirmItem } from '../../test-utils'
import CoinList from '../../views/CoinList.vue'
// import confirmComp from '../../components/common/confirmComp/confirmComp.vue' // Removed as requested

// Mock useAppApiDataStore
const mockGetByPath = vi.fn()
const mockUpdateConfirm = vi.fn()
const mockPrepareSnackbar = vi.fn()

vi.mock('@/stores/app-api-data', () => ({
  useAppApiDataStore: () => ({
    getByPath: mockGetByPath,
    updateConfirm: mockUpdateConfirm,
    prepareSnackbar: mockPrepareSnackbar
  })
}))

// Mock moment
vi.mock('moment', () => ({
  default: (date: string) => ({
    format: (format: string) => '2024/01/01 12:00:00'
  })
}))

describe('Component Integration Tests', () => {
  let homeWrapper: any
  // let confirmWrapper: any // Removed as requested

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetByPath.mockResolvedValue(mockCurrencyData)
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
      expect(dataTable.props('items')).toEqual(mockCurrencyData)
    })

    it('should handle data loading states', async () => {
      // Create a new wrapper to test initial state
      const newWrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })
      
      // Test initial state (should be empty before API call)
      expect(newWrapper.vm.items).toEqual([])
      
      // Simulate API call
      await newWrapper.vm.getCurrency()
      
      // Data should be loaded
      expect(newWrapper.vm.items).toEqual(mockCurrencyData)
    })
  })

  // ConfirmComp Integration tests removed as requested

  describe('Store Integration', () => {
    it('should integrate with appApiDataStore correctly', async () => {
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      await wrapper.vm.$nextTick()
      
      expect(mockGetByPath).toHaveBeenCalledWith('currencies')
      expect(wrapper.vm.items).toEqual(mockCurrencyData)
    })

    it('should handle store state changes', async () => {
      const wrapper = mount(CoinList, {
        global: {
          plugins: [createTestVuetify()]
        }
      })

      // Wait for initial data to load
      await wrapper.vm.$nextTick()
      
      // Verify initial data is loaded
      expect(wrapper.vm.items).toEqual(mockCurrencyData)
      
      // Simulate store state change
      wrapper.vm.items = []
      await wrapper.vm.$nextTick()

      // Verify the change was applied
      expect(wrapper.vm.items).toEqual([])
      
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

      await wrapper.vm.getCurrency()
      
      // 檢查錯誤處理
      expect(wrapper.vm.items).toEqual([])
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
