import { expect, test, type Page } from '@playwright/test'

const PAGES = ['', 'science/', 'science/data/', 'science/between-embryos/', 'science/within-embryo/', 'science/embryo-to-offspring/', 'science/pgt-mt-and-pgt-a/', 'science/cases/', 'science/sources/', 'science/methods/', 'patients/', 'creator/', 'about/']
const CHARTS: Record<string, number> = { 'science/between-embryos/': 1, 'science/within-embryo/': 3, 'science/embryo-to-offspring/': 2, 'science/pgt-mt-and-pgt-a/': 3 }

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
  await page.goto('ru/science/pgt-mt-and-pgt-a/')
  await expect(page.locator('.badge.model')).toBeVisible()
  await expect(page.locator('.badge.observed')).toHaveCount(0)
  await page.goto('ru/science/between-embryos/')
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

test('figure 3 shows manuscript fractions', async ({ page }) => {
  await page.goto('en/science/between-embryos/')
  const svg = page.locator('.chart-frame .main-svg').first()
  await expect(svg).toBeVisible({ timeout: 20_000 })
  const text = (await page.locator('.chart-frame').innerText()).replace(/\s+/g, '')
  for (const s of ['0.47 (41/87)', '0.60 (52/87)', '0.21 (6/28)', '0.92 (24/26)', '0.05 (1/21)', '0.56 (5/9)']) expect(text).toContain(s.replace(' ', ''))
})

test('figure 4 flags ESM discrepancies in the embryo card', async ({ page }) => {
  await page.goto('ru/science/within-embryo/')
  await page.locator('summary', { hasText: 'Таблица данных' }).click()
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_6' }).click()
  await expect(page.locator('.detail')).toContainText('расхождение с ESM')
})

test('language switch keeps the section', async ({ page }) => {
  await page.goto('en/science/within-embryo/')
  await page.getByRole('link', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru\/science\/within-embryo\/?$/)
})

test('creator photo loads on the creator page and the home page', async ({ page }) => {
  for (const url of ['en/creator/', 'ru/creator/', 'en/']) {
    await page.goto(url)
    const img = page.locator('picture img').first()
    await expect(img).toBeVisible()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  }
})

test('home page numbers come from the database', async ({ page }) => {
  await page.goto('en/')
  const nums = await page.locator('.stats .num').allInnerTexts()
  expect(nums[0]).toBe('187')
  await expect(page.locator('.hero')).toContainText('Created and curated by Ilya Mazunin')
  await page.goto('ru/')
  await expect(page.locator('.hero')).toContainText('Создатель и научный куратор — Илья Мазунин')
})

test('no broken internal links', async ({ page, request }) => {
  const seen = new Set<string>()
  const queue = ['en/', 'ru/']
  const broken: string[] = []
  while (queue.length) {
    const url = queue.shift()!
    if (seen.has(url)) continue
    seen.add(url)
    const res = await page.goto(url)
    if (!res || res.status() >= 400) { broken.push(url); continue }
    const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))
    for (const h of hrefs) {
      const u = new URL(h)
      if (u.host !== 'localhost:4173') continue
      const rel = u.pathname.replace(/^\/pgt-mt-atlas\//, '')
      if (/\.(csv|json|jpg|webp)$/.test(rel)) {
        if (!seen.has(rel)) { seen.add(rel); const r = await request.get(rel); if (r.status() >= 400) broken.push(rel) }
      } else if (!seen.has(rel)) queue.push(rel)
    }
  }
  expect(broken).toEqual([])
  expect(seen.size).toBeGreaterThan(25)
})
