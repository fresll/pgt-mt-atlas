// Скриншоты страниц рисунков для визуальной проверки (не тест): node e2e/screens.mjs <outdir>
import { chromium } from '@playwright/test'
const out = process.argv[2]
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
for (const [name, path, scheme, width] of [
  ['fig3-ru', 'ru/science/heteroplasmy-landscape/', 'light', 1400],
  ['fig4-en', 'en/science/embryo-concordance/', 'light', 1400],
  ['fig5-ru', 'ru/science/embryo-to-offspring/', 'light', 1400],
  ['fig6-ru-dark', 'ru/science/pgt-mt-pgt-a-model/', 'dark', 1400],
  ['home-mobile', 'ru/', 'light', 390],
  ['home-en', 'en/', 'light', 1400],
  ['curator-ru', 'ru/ilya-mazunin/', 'light', 1400],
  ['curator-mobile-en', 'en/ilya-mazunin/', 'dark', 390],
  ['science-en', 'en/science/', 'light', 1400],
  ['fig3-mobile-en', 'en/science/heteroplasmy-landscape/', 'light', 390],
]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme })
  await page.goto(`http://localhost:4173/pgt-mt-atlas/${path}`)
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  await page.close()
}
await browser.close()
