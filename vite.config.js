import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 중 /api 요청을 배포된 백엔드로 전달
    proxy: {
      '/api': { target: 'https://be-btfx.onrender.com', changeOrigin: true },
    },
  },
})
