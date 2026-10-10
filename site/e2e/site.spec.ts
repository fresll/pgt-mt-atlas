import { expect, test, type Page } from '@playwright/test'

const PAGES = ['', 'science/', 'science/data/', 'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/', 'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'patients/', 'about/', 'ilya-mazunin/']
const CHARTS: Record<string, number> = { 'science/heteroplasmy-landscape/': 1, 'science/embryo-concordance/': 3, 'science/embryo-to-offspring/': 2, 'science/pgt-mt-pgt-a-model/': 3 }

function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  return errors
}

for (const lang of ['en', 'ru']) {
  for (const p of PAGES) {
    test(`${lang}/${p} renders without errors`, async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto(`${lang}/${p}`)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page.locator('h1').first()).toBeVisible()
      if (CHARTS[p]) await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(CHARTS[p], { timeout: 20_000 })
      expect(errors).toEqual([])
    })
  }
}

test('observed vs model badges are separated', async ({ page }) => {
  await page.goto('ru/science/pgt-mt-pgt-a-model/')
  await expect(page.locator('.badge.model')).toBeVisible()
  await expect(page.locator('.badge.observed')).toHaveCount(0)
  await page.goto('ru/science/heteroplasmy-landscape/')
  await expect(page.locator('.badge.observed')).toBeVisible()
  await expect(page.locator('.badge.model')).toHaveCount(0)
})

test('Tofilo 2026 observations show the confirmed DOI and published status', async ({ page }) => {
  await page.goto('en/science/data/')
  await page.selectOption('select >> nth=1', 'tofilo2026')
  await expect(page.locator('table.data tbody tr')).toHaveCount(6)
  await page.locator('table.data tbody tr').first().click()
  const card = page.locator('.detail')
  await expect(card).toContainText('doi:10.1007/s10815-026-04012-y')
  await expect(card).toContainText('published')
  await expect(card).toContainText('42649365')
})

test('heteroplasmy landscape shows reference fractions', async ({ page }) => {
  await page.goto('en/science/heteroplasmy-landscape/')
  const svg = page.locator('.chart-frame .main-svg').first()
  await expect(svg).toBeVisible({ timeout: 20_000 })
  const text = (await page.locator('.chart-frame').innerText()).replace(/\s+/g, '')
  for (const s of ['0.47 (41/87)', '0.60 (52/87)', '0.21 (6/28)', '0.92 (24/26)', '0.05 (1/21)', '0.56 (5/9)']) expect(text).toContain(s.replace(' ', ''))
})

test('embryo concordance flags ESM discrepancies in the embryo card', async ({ page }) => {
  await page.goto('ru/science/embryo-concordance/')
  await page.locator('summary', { hasText: 'Таблица данных' }).click()
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_6' }).click()
  await expect(page.locator('.detail')).toContainText('расхождение с ESM')
})

test('the Atlas is presented independently of any single publication', async ({ page }) => {
  for (const lang of ['en', 'ru']) {
    for (const p of PAGES) {
      await page.goto(`${lang}/${p}`)
      const text = await page.locator('body').innerText()
      expect(text, `${lang}/${p}`).not.toMatch(/Acta Naturae|As in the article|Как в статье|article figure|рисунка статьи|Figure [3-6]|Fig\. [3-6]|Рисун\S* [3-6]|рис\. [3-6]|Тофило/)
    }
  }
})

test('curator page shows the portrait and the curated-by line', async ({ page }) => {
  await page.goto('en/ilya-mazunin/')
  await expect(page.locator('h1')).toHaveText('Ilya Mazunin')
  await expect(page.locator('img.portrait')).toBeVisible()
  expect(await page.locator('img.portrait').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator('footer')).toContainText('Created and curated by Ilya Mazunin')
  await page.goto('ru/')
  await expect(page.locator('footer')).toContainText('Создатель и куратор — Илья Мазунин')
})

test('language switch keeps the section', async ({ page }) => {
  await page.goto('en/science/embryo-concordance/')
  await page.getByRole('link', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru\/science\/embryo-concordance\/?$/)
})
