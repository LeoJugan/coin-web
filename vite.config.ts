import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      "/production": {
        // target: "http://localhost:8080/coindesk-1.0.0/", //本機測試
        target: "https://nhri.hywebcloud20.com/coindesk-1.0.0/", //本機測試
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/production/, ""),
      },
      "/devTest": {
        target: "http://localhost:8080/", //本機測試
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devTest/, ""),
      },
    },

  },
  build: {
    outDir: 'dist',         // 這裡
    emptyOutDir: true,      // 這裡
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'axios', 'pinia', 'vue3-lottie']
        }
      }
    }
  },
  // 強制清除快取
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }

})
