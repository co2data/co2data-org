import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./setup.ts'],
    environment: 'jsdom',
    exclude: ['e2e', 'node_modules', '.devenv'],
    chaiConfig: { truncateThreshold: 0 },
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './app/_components'),
      '@': path.resolve(__dirname, './'),
    },
  },
})
