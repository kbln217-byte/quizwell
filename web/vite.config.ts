import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = env.VITE_API_URL || "http://localhost:3000"

  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/users": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/sessions": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/questions": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/answers": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/review": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/question-flags": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
