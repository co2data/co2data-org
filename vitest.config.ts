import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
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
