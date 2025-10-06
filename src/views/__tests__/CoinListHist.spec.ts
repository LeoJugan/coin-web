import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CoinListHist from '../CoinListHist.vue'
import { createTestVuetify } from '../../test-utils'

// Mock useAppApiDataStore
const mockGetByPath = vi.fn()

vi.mock('@/stores/app-api-data', () => ({
  useAppApiDataStore: () => ({
    getByPath: mockGetByPath
  })
}))

// Mock moment
vi.mock('moment', () => ({
  default: (date: string) => ({
    format: (format: string) => '2024/01/01 12:00:00'
  })
}))

describe('CoinListHist', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetByPath.mockResolvedValue([])
    
    wrapper = mount(CoinListHist, {
      global: {
        plugins: [createTestVuetify()]
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    expect(wrapper.text()).toContain('歷史記錄')
  })

  it('has proper Vue component structure', () => {
    expect(wrapper.vm).toBeDefined()
  })
})
