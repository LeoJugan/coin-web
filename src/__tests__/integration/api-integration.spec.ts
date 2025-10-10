import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppApiDataStore } from '../../stores/app-api-data'
import axios from 'axios'
import { mockApiResponse, mockApiCurrencyData } from '../../test-utils'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios) as any

// Mock globalFunctions
;(global as any).globalFunctions = {
  handErrorUtil: vi.fn()
}

describe('API Integration Tests', () => {
  let store: any

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAppApiDataStore()
    vi.clearAllMocks()
  })

  describe('Currency Data Flow', () => {
    it('should fetch and process currency data correctly', async () => {
      // Mock API response
      mockedAxios.get.mockResolvedValue(mockApiResponse.success(mockApiCurrencyData))

      // Fetch currency data
      const result = await store.fetchCurrencyData()

      // Verify API call - 動態獲取 apiServerUrl
      const expectedUrl = store.apiServerUrl + 'v1/bpi/currentprice.json'
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
      
      // Verify data structure
      expect(result).toHaveProperty('bpi')
      expect(result).toHaveProperty('time')
      expect(result.bpi).toHaveProperty('USD')
      expect(result.bpi).toHaveProperty('EUR')
      
      // Verify USD data
      expect(result.bpi.USD.code).toBe('USD')
      expect(result.bpi.USD.rate_float).toBe(50000.0)
    })

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(store.fetchCurrencyData()).rejects.toThrow('API Error')
    })
  })

  describe('Query Operations', () => {
    it('should handle single query parameter', async () => {
      const mockResponse = { data: { id: 1, name: 'test' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await store.getByQuery('users', 'id', '1')

      expect(mockedAxios.get).toHaveBeenCalledWith(
        store.apiServerUrl + 'api/users?id=1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle multiple query parameters', async () => {
      const mockResponse = { data: [{ id: 1 }, { id: 2 }] }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const queryArray = [
        { key: 'status', value: 'active' },
        { key: 'type', value: 'user' }
      ]

      const result = await store.getByQueryMulti('users', queryArray)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        store.apiServerUrl + 'api/users?status=active&type=user',
        expect.any(Object)
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle path-based queries', async () => {
      const mockResponse = { data: { id: 1, name: 'test' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await store.getByPath('users', ['1', 'profile'])

      expect(mockedAxios.get).toHaveBeenCalledWith(
        store.apiServerUrl + 'api/users/1/profile',
        expect.any(Object)
      )
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('POST Operations', () => {
    it('should handle POST with body data', async () => {
      const mockResponse = { data: { id: 1, created: true } }
      const postData = { name: 'test', email: 'test@example.com' }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await store.postByBody('users', postData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        store.apiServerUrl + 'api/users',
        postData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle POST with query and body', async () => {
      const mockResponse = { data: { success: true } }
      const queryArray = [
        { key: 'action', value: 'update' },
        { body: { name: 'updated name' } }
      ]
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await store.postByQueryMulti('users', queryArray)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        store.apiServerUrl + 'api/users?action=update',
        { name: 'updated name' },
        expect.any(Object)
      )
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('Loading State Management', () => {
    it('should manage loading states correctly', async () => {
      const mockResponse = { data: 'test' }
      mockedAxios.get.mockResolvedValue(mockResponse)

      // Start with loading disabled
      expect(store.autoSaveStatus).toBe(false)

      // Call API with loading enabled
      const promise = store.getByQuery('test', 'key', 'value', true, true, 100)

      // Should enable loading immediately (async operation)
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(store.autoSaveStatus).toBe(true)

      // Wait for completion
      await promise

      // Should disable loading after timeout
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(store.autoSaveStatus).toBe(false)
    })
  })
})
