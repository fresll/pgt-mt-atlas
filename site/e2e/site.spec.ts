import { expect, test, type Page } from '@playwright/test'

// Основы ПГТ-мт: оглавление, шесть глав и библиография
const FUNDAMENTALS = ['fundamentals/', 'fundamentals/mtdna-and-maternal-inheritance/', 'fundamentals/heteroplasmy-and-threshold-effects/', 'fundamentals/mitochondrial-genetic-bottleneck/', 'fundamentals/embryo-development-and-biopsy/', 'fundamentals/how-pgt-mt-works/', 'fundamentals/interpretation-and-limitations/', 'fundamentals/references/']
const PAGES = ['', 'science/', 'science/data/', 'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/', 'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'patients/', 'contribute/', 'about/', 'ilya-mazunin/', ...FUNDAMENTALS]
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

test('curator page keeps the full CV content in both languages', async ({ page }) => {
  for (const lang of ['en', 'ru']) {
    await page.goto(`${lang}/ilya-mazunin/`)
    await expect(page.locator('.cv-research li')).toHaveCount(5)
    await expect(page.locator('.cv-topic')).toHaveCount(4)
    await expect(page.locator('.pub-list li')).toHaveCount(15)
    await expect(page.locator('.pub-list a[href*="doi.org"]')).toHaveCount(15)
    await expect(page.locator('#education')).toContainText('ISBN 978-5-906748-37-9')
    await expect(page.locator('#education')).toContainText('ISBN 978-5-906748-38-6')
    await expect(page.locator('#career .cv-timeline li')).toHaveCount(14)
  }
})

test('contribute page: template download, review statuses and a working e-mail contact', async ({ page, request }) => {
  for (const [lang, title, copy] of [
    ['en', 'Contribute Data', 'Copy address'],
    ['ru', 'Поделиться данными', 'Скопировать адрес'],
  ]) {
    await page.goto(`${lang}/`)
    await page.locator('nav.primary').getByRole('link', { name: title }).click()
    await expect(page).toHaveURL(new RegExp(`/${lang}/contribute/?$`))
    await expect(page.locator('h1')).toHaveText(title)
    // шаблон скачивается и является xlsx (zip)
    const href = await page.locator('a[download]').first().getAttribute('href')
    expect(href).toMatch(/templates\/PGT-mt_Research_Data_Submission_v[\d.]+\.xlsx$/)
    const res = await request.get(href!)
    expect(res.status()).toBe(200)
    expect((await res.body()).subarray(0, 2).toString()).toBe('PK')
    // статусы проверки в утверждённом порядке
    await expect(page.locator('.sk-c-status li')).toHaveCount(5)
    await expect(page.locator('.sk-c-tiers > div')).toHaveCount(4)
    // утверждённый адрес куратора: mailto, адрес для ручного копирования, без формы приёма данных
    await expect(page.locator('#contact form, #contact input, #contact textarea')).toHaveCount(0)
    await expect(page.locator('[data-channel="inactive"]')).toHaveCount(0)
    const mail = page.locator('#contact a[href^="mailto:"]')
    await expect(mail).toHaveCount(1)
    expect(await mail.getAttribute('href')).toMatch(/^mailto:ilya\.mazunin@gmail\.com\?subject=/)
    await expect(page.locator('#contact .email-address')).toHaveText('ilya.mazunin@gmail.com')
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.locator('#contact').getByRole('button', { name: copy }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('ilya.mazunin@gmail.com')
    // иллюстрация пути данных с двуязычными подписями
    await expect(page.locator('.sk-c-figure svg')).toBeVisible()
    await expect(page.locator('.sk-c-figure .sk-label')).toHaveCount(6)
  }
})

test('contribute page fits a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const lang of ['en', 'ru']) {
    await page.goto(`${lang}/contribute/`)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, lang).toBeLessThanOrEqual(0)
  }
})
