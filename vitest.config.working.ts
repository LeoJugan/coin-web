import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import { defineConfig as defineViteConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// 建立專門的 Vite 配置給測試使用
const testViteConfig = defineViteConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    modules: {
      classNameStrategy: 'non-scoped'
    }
  },
  // 處理 CSS 檔案
  assetsInclude: ['**/*.css', '**/*.sass', '**/*.scss'],
  define: {
    'process.env': {}
  }
})

export default mergeConfig(
  testViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'coverage/**',
          'dist/**',
          'e2e/**',
          'node_modules/**',
          'src/test-utils/**',
          '**/*.d.ts',
          '**/*.config.*',
          '**/__tests__/**'
        ],
        thresholds: {
          global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
          }
        }
      },
      setupFiles: ['./src/test-utils/setup.ts'],
      // 處理 CSS 檔案
      server: {
        deps: {
          inline: ['vuetify']
        }
      }
    },
  }),
)



