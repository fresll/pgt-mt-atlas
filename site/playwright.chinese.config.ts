import { defineConfig } from '@playwright/test'
import config from './playwright.config'
export default defineConfig({ ...config, testDir: 'e2e-public', testMatch: /chinese-.*\.spec\.ts/, workers: 2, webServer: (config.webServer as { command: string; port: number }[]).map(server => ({ ...server, reuseExistingServer: true })) })
