import { readFileSync } from 'node:fs'
import { expect, test } from '../e2e/fixtures'

const paths = ['', 'patients/', 'about/', 'ilya-mazunin/', 'contribute/', 'science/', 'science/data/',
  'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/',
  'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'fundamentals/',
  'fundamentals/mtdna-and-maternal-inheritance/', 'fundamentals/heteroplasmy-and-threshold-effects/',
  'fundamentals/mitochondrial-genetic-bottleneck/', 'fundamentals/embryo-development-and-biopsy/',
  'fundamentals/how-pgt-mt-works/', 'fundamentals/interpretation-and-limitations/', 'fundamentals/references/']

test('all English pages, expanded tables, 446 details and chart text contain no Cyrillic', async ({ page }) => {
  test.setTimeout(180_000)
  let selections = 0
  for (const path of paths) {
    await page.goto(`en/${path}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true }))
    await expect(page.locator('body'), path).not.toContainText(/[А-Яа-яЁё]/)
    await expect(page.locator('head title')).toHaveCount(1)
    expect(await page.title()).not.toMatch(/[А-Яа-яЁё]/)
    const rows = page.locator('table.data tbody tr[tabindex="0"]')
    for (let i = 0; i < await rows.count(); i++) {
      await rows.nth(i).dispatchEvent('click')
      await expect(page.locator('.detail'), `${path}, row ${i + 1}`).not.toContainText(/[А-Яа-яЁё]/)
      selections++
    }
    const untranslated = await page.evaluate(() => {
      const re = /[А-Яа-яЁё]/
      const found: string[] = []
      for (const el of document.querySelectorAll('[alt],[title],[aria-label],[aria-description],[placeholder]')) {
        if (el.closest('.language-switch')) continue
        for (const name of ['alt', 'title', 'aria-label', 'aria-description', 'placeholder']) {
          const text = el.getAttribute(name)
          if (text && re.test(text)) found.push(`${name}: ${text}`)
        }
      }
      const inspect = (value: unknown, depth = 0) => {
        if (depth > 18 || value == null) return
        if (typeof value === 'string') { if (re.test(value)) found.push(value); return }
        if (Array.isArray(value)) value.forEach(v => inspect(v, depth + 1))
        else if (typeof value === 'object') for (const [key, v] of Object.entries(value)) if (!key.startsWith('_')) inspect(v, depth + 1)
      }
      for (const element of document.querySelectorAll('.js-plotly-plot')) {
        const plot = element as HTMLElement & { data?: unknown; layout?: unknown }
        inspect(plot.data); inspect(plot.layout)
      }
      return found
    })
    expect(untranslated, path).toEqual([])
    await expect(page.locator('header .language-switch a[lang=ru]')).toHaveAttribute('title', 'Language: Русский')
  }
  expect(selections).toBe(446)
})

test('static English CSV links and downloaded visible rows are English', async ({ page, request }) => {
  await page.goto('en/science/data/')
  const links = page.locator('a[download][href*="data/csv/en/"]')
  await expect(links).toHaveCount(8)
  for (const link of await links.all()) {
    const response = await request.get(await link.evaluate(el => (el as HTMLAnchorElement).href))
    expect(response.status()).toBe(200)
    expect(await response.text()).not.toMatch(/[А-Яа-яЁё]/)
  }
  for (const path of ['science/data/', 'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/', 'science/cases/']) {
    await page.goto(`en/${path}`)
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true }))
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download visible rows (CSV)' }).first().click()
    const download = await downloadPromise
    expect(readFileSync((await download.path())!, 'utf8'), path).not.toMatch(/[А-Яа-яЁё]/)
  }
})

test('English template is separate and unknown English addresses use an English 404', async ({ page }) => {
  await page.goto('en/contribute/')
  await expect(page.locator('a[download]').first()).toHaveAttribute('href', /templates\/en\//)
  const response = await page.goto('http://localhost:4174/pgt-mt-atlas/en/no-such-page/')
  expect(response!.status()).toBe(404)
  await expect(page.locator('body')).not.toContainText(/[А-Яа-яЁё]/)
  await expect(page.locator('h1')).toHaveText('PGT-mt Atlas')
  await page.goto('http://localhost:4174/pgt-mt-atlas/ru/no-such-page/')
  await expect(page.locator('h1')).toHaveText('Атлас ПГТ-мт')
})
