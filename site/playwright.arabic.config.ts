import { defineConfig } from '@playwright/test'
process.env.ATLAS_ARABIC_E2E = '1'
export default defineConfig({
 testDir: 'e2e', testMatch: 'arabic.spec.ts', timeout: 60000,
 use: { baseURL: 'http://127.0.0.1:4173/pgt-mt-atlas/', launchOptions: { executablePath: '/usr/bin/chromium' } },
 webServer: { command: 'npm run preview -- --host 127.0.0.1',port:4173,reuseExistingServer:true }
})
