import { vi } from 'vitest'
import { setupTestConfig } from './index'

// 設定全域測試配置
setupTestConfig()

// Mock 全域物件
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock visualViewport
Object.defineProperty(window, 'visualViewport', {
  value: {
    width: 1024,
    height: 768,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
  configurable: true,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock CSS imports
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
vi.mock('*.sass', () => ({}))
vi.mock('*.less', () => ({}))
vi.mock('*.styl', () => ({}))
vi.mock('*.stylus', () => ({}))

// Mock Vuetify CSS specifically
vi.mock('vuetify/lib/components/VBtn/VBtn.css', () => ({}))
vi.mock('vuetify/lib/components/VCard/VCard.css', () => ({}))
vi.mock('vuetify/lib/components/VDialog/VDialog.css', () => ({}))
vi.mock('vuetify/lib/components/VIcon/VIcon.css', () => ({}))
vi.mock('vuetify/lib/components/VTextField/VTextField.css', () => ({}))
vi.mock('vuetify/lib/components/VBtn/VBtn.sass', () => ({}))
vi.mock('vuetify/lib/components/VCard/VCard.sass', () => ({}))
vi.mock('vuetify/lib/components/VDialog/VDialog.sass', () => ({}))
vi.mock('vuetify/lib/components/VIcon/VIcon.sass', () => ({}))
vi.mock('vuetify/lib/components/VTextField/VTextField.sass', () => ({}))
