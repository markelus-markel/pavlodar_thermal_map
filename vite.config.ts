/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // For a GitHub Pages *project* site (https://<user>.github.io/<repo>/),
  // the app must be built with base = "/<repo>/". The deploy workflow sets
  // BASE_PATH automatically from the repository name. For local dev/preview,
  // or a user/org page (https://<user>.github.io/), leave it as "/".
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
