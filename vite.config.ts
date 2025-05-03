/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/mocks/setup.ts',
    deps: {
      inline: [/^(?!.*vitest).*@mui\/.*/]
    }
  },
  base: '/mini-dashboard/'
})
