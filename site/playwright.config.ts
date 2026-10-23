import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://localhost:4173/pgt-mt-atlas/',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: [
    { command: 'npm run preview', port: 4173, reuseExistingServer: false },
    // hosting.spec.ts: та же сборка как на GitHub Pages (/pgt-mt-atlas/) и по другому пути (корень сервера)
    { command: 'node e2e/static-server.mjs 4174 /pgt-mt-atlas', port: 4174, reuseExistingServer: false },
    { command: 'node e2e/static-server.mjs 4175 ""', port: 4175, reuseExistingServer: false },
  ],
})
