import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api/mojang': {
        target: 'https://api.mojang.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mojang/, '')
      },
      '/api/sessionserver': {
        target: 'https://sessionserver.mojang.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sessionserver/, '')
      }
    }
  }
})