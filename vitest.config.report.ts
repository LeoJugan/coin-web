import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vitest/config'
import { defineConfig as defineViteConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'node:url'

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
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
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
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          }
        }
      },
      setupFiles: ['./src/test-utils/setup.ts'],
      server: {
        deps: {
          inline: ['vuetify']
        }
      },
      // 測試報告配置
      reporter: ['verbose', 'json', 'html'],
      outputFile: {
        json: './test-results/results.json',
        html: './test-results/index.html'
      }
    },
  }),
)



