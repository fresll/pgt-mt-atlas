import { defineConfig } from '@playwright/test'
import config from './playwright.config'

// Run after the public bilingual build; the default suite also tests closed-English builds.
export default defineConfig({ ...config, testDir: 'e2e-public', testIgnore: /chinese-.*\.spec\.ts/, workers: 2 })
