import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppApiDataStore } from '../app-api-data'
import axios from 'axios'
import { mockApiResponse, mockCurrencyData } from '../../test-utils'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios) as any

// Mock globalFunctions
;(global as any).globalFunctions = {
  handErrorUtil: vi.fn()
}

describe('useAppApiDataStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('should have correct initial state', () => {
      const store = useAppApiDataStore()
      
      expect(store.apiServerUrl).toBe('/devTest/')
      expect(store.apiToken).toBeNull()
      expect(store.confirmStatus).toBe(false)
      expect(store.autoSaveStatus).toBe(false)
      expect(store.snackbarStatus).toBe(false)
    })
  })

  describe('fetchCurrencyData', () => {
    it('should fetch currency data successfully', async () => {
      const store = useAppApiDataStore()
      mockedAxios.get.mockResolvedValue(mockApiResponse.success(mockCurrencyData))

      const result = await store.fetchCurrencyData()

      expect(mockedAxios.get).toHaveBeenCalledWith('/devTest/v1/bpi/currentprice.json')
      expect(result).toEqual(mockCurrencyData)
    })

    it('should handle fetch error', async () => {
      const store = useAppApiDataStore()
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(store.fetchCurrencyData()).rejects.toThrow('Network error')
    })
  })

  describe('updateConfirm', () => {
    it('should update confirm status and items', () => {
      const store = useAppApiDataStore()
      const confirmItem = { title: 'Test' }
      const confirmFoo = () => {}

      store.updateConfirm(true, confirmItem, confirmFoo)

      expect(store.confirmStatus).toBe(true)
      expect(store.confirmItem).toStrictEqual(confirmItem)
      expect(store.confirmFoo).toBe(confirmFoo)
    })

    it('should reset items when status is false', () => {
      const store = useAppApiDataStore()
      store.updateConfirm(true, { title: 'Test' }, () => {})
      store.updateConfirm(false)

      expect(store.confirmStatus).toBe(false)
      expect(store.confirmItem).toBeNull()
      expect(store.confirmFoo).toBeNull()
    })
  })

  describe('updateAutoSaveStatus', () => {
    it('should update autoSaveStatus', async () => {
      const store = useAppApiDataStore()
      
      store.updateAutoSaveStatus(true, 100)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(store.autoSaveStatus).toBe(true)
    })
  })

  describe('getByQuery', () => {
    it('should make GET request with query parameters', async () => {
      const store = useAppApiDataStore()
      const mockResponse = { data: 'test data' }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await store.getByQuery('test', 'key', 'value')

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/devTest/api/test?key=value',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: null
          })
        })
      )
      expect(result).toBe('test data')
    })

    it('should make GET request without query parameters', async () => {
      const store = useAppApiDataStore()
      const mockResponse = { data: 'test data' }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await store.getByQuery('test', '', '')

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/devTest/api/test',
        expect.any(Object)
      )
      expect(result).toBe('test data')
    })
  })

  describe('postByBody', () => {
    it('should make POST request with body', async () => {
      const store = useAppApiDataStore()
      const mockResponse = { data: 'test data' }
      const testData = { name: 'test' }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await store.postByBody('test', testData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/devTest/api/test',
        testData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: null
          })
        })
      )
      expect(result).toBe('test data')
    })
  })

  describe('prepareSnackbar', () => {
    it('should prepare snackbar item with default timeout', () => {
      const store = useAppApiDataStore()
      const snackbarItem = { snackbarText: 'Test message' }

      store.prepareSnackbar(snackbarItem)

      expect(store.snackbarItem).toEqual({
        snackbarText: 'Test message',
        timeout: 5000
      })
    })

    it('should prepare snackbar item with custom timeout', () => {
      const store = useAppApiDataStore()
      const snackbarItem = { snackbarText: 'Test message', timeout: 3000 }

      store.prepareSnackbar(snackbarItem)

      expect(store.snackbarItem).toEqual(snackbarItem)
    })
  })
})
