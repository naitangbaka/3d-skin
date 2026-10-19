import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/3d-skin/',
  plugins: [vue()],
  define: {
    __PACKAGE_LOCK__: JSON.stringify(
      readFileSync(resolve(__dirname, 'package-lock.json'), 'utf-8')
    ),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api/uapis': {
        target: 'https://uapis.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uapis/, '')
      }
    }
  }
})