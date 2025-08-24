import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {

      // '/api': 'https://nhri.hywebcloud20.com/',
      "/devTest": {
        target: "http://localhost:8080/", //本機測試
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devTest/, ""),
        // },
        // "/api": {
        //   target: "https://nhri.hywebcloud20.com/", // 後端 API 進入點
        //   changeOrigin: true,
        //   // secure: false,
        //   ws: true,
        //   rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },

  },

})
