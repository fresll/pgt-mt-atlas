import { expect, test, type Page } from './fixtures'

// Английская версия закрыта (64f6686): все страницы проверяются на русском; для прежних английских адресов —
// перенаправление на тот же русский раздел с сохранением query и hash.

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

for (const p of PAGES) {
  test(`ru/${p} renders without errors`, async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto(`ru/${p}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    await expect(page.locator('h1').first()).toBeVisible()
    if (CHARTS[p]) await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(CHARTS[p], { timeout: 20_000 })
    expect(errors).toEqual([])
  })
}

test('every en/<section>/ address redirects to ru/<section>/ keeping query and hash', async ({ page }) => {
  const errors = collectErrors(page)
  for (const p of PAGES) {
    await page.goto(`en/${p}?ref=old-link#content`)
    await expect(page, p).toHaveURL(new RegExp(`/ru/${p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\?ref=old-link#content$`))
    await expect(page.locator('html'), p).toHaveAttribute('lang', 'ru')
    await expect(page.locator('h1').first(), p).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('observed vs model badges are separated', async ({ page }) => {
  await page.goto('ru/science/pgt-mt-pgt-a-model/')
  await expect(page.locator('.badge.model')).toBeVisible()
  await expect(page.locator('.badge.observed')).toHaveCount(0)
  await page.goto('ru/science/heteroplasmy-landscape/')
  await expect(page.locator('.badge.observed')).toBeVisible()
  await expect(page.locator('.badge.model')).toHaveCount(0)
})

test('Tofilo 2026 observations show the confirmed DOI and published status', async ({ page }) => {
  await page.goto('ru/science/data/')
  await expect(page.locator('h1')).toHaveText('Таблица значений')
  // фильтр «Источник» (первый select на странице теперь — скрытый на широком экране выбор раздела)
  await page.locator('.controls label', { hasText: /^Источник/ }).locator('select').selectOption('tofilo2026')
  await expect(page.locator('table.data tbody tr')).toHaveCount(6)
  await page.locator('table.data tbody tr').first().click()
  const card = page.locator('.detail')
  await expect(card).toContainText('doi:10.1007/s10815-026-04012-y')
  await expect(card).toContainText('опубликовано')
  await expect(card).toContainText('42649365')
})

test('heteroplasmy landscape shows reference fractions', async ({ page }) => {
  await page.goto('ru/science/heteroplasmy-landscape/')
  const svg = page.locator('.chart-frame .main-svg').first()
  await expect(svg).toBeVisible({ timeout: 20_000 })
  const text = (await page.locator('.chart-frame').innerText()).replace(/\s+/g, '')
  // на русской странице — десятичная запятая
  for (const s of ['0,47 (41/88)', '0,60 (53/88)', '0,21 (6/28)', '0,92 (24/26)', '0,05 (1/20)', '0,56 (5/9)']) expect(text).toContain(s.replace(' ', ''))
})

// Расхождения Tofilo 2026 с ESM 2 исправлены слоем корректировок; карточка эмбриона больше не выводит список
// сверки (64f6686). Открытых флагов ⚠ нет, сверка опубликована в verification.csv.
test('embryo concordance: ESM 2 discrepancies are resolved and recorded in verification.csv', async ({ page }) => {
  await page.goto('ru/science/embryo-concordance/')
  await page.locator('summary', { hasText: 'Таблица данных' }).click()
  const row = page.locator('table.data tbody tr', { hasText: 'Tofilo_6' })
  await expect(row).not.toContainText('⚠')
  await row.click()
  await expect(page.locator('.detail')).toContainText('Tofilo et al., 2026')
  await page.goto('ru/science/data/')
  const href = await page.locator('a[download][href$="data/csv/verification.csv"]').getAttribute('href')
  const csv = await (await page.request.get(new URL(href!, page.url()).href)).text()
  const tofilo6 = csv.split(/\r?\n/).filter((l) => l.startsWith('tofilo2026,Tofilo_6,') && l.includes('value_mismatch'))
  expect(tofilo6).toHaveLength(2)
  for (const line of tofilo6) expect(line).toContain(',value_mismatch,corrected,')
  expect(csv).toContain('В наборе 11.4%, в ESM 2 11.3%')
})

test('the Atlas is presented independently of any single publication', async ({ page }) => {
  for (const p of PAGES) {
    await page.goto(`ru/${p}`)
    const text = await page.locator('body').innerText()
    expect(text, `ru/${p}`).not.toMatch(/Acta Naturae|As in the article|Как в статье|article figure|рисунка статьи|Figure [3-6]|Fig\. [3-6]|Рисун\S* [3-6]|рис\. [3-6]|Тофило/)
  }
})

test('curator page shows the portrait and the homepage keeps the biography link at the bottom', async ({ page }) => {
  await page.goto('ru/ilya-mazunin/')
  await expect(page.locator('h1')).toHaveText('Илья Мазунин')
  await expect(page.locator('img.portrait')).toBeVisible()
  expect(await page.locator('img.portrait').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  await page.goto('ru/')
  await expect(page.locator('.sk-home .sk-curator')).toHaveCount(0)
  await expect(page.locator('footer.site').getByRole('link', { name: 'Создатель и куратор — Илья Мазунин' })).toHaveAttribute('href', /\/ru\/ilya-mazunin\//)
})

test('an English section address keeps the section', async ({ page }) => {
  await page.goto('en/science/embryo-concordance/')
  await expect(page).toHaveURL(/\/ru\/science\/embryo-concordance\/?$/)
  await expect(page.locator('h1')).toHaveText('Совпадение фракций эмбриона')
})

// Страница куратора сокращена до биографии и избранных публикаций (64f6686).
test('curator page keeps the biography and selected publications', async ({ page }) => {
  await page.goto('ru/ilya-mazunin/')
  await expect(page.locator('.cv-toc a')).toHaveText(['Научная биография', 'Избранные публикации'])
  await expect(page.locator('#bio')).toContainText('Роль в проекте')
  await expect(page.locator('#bio')).toContainText('Илья Мазунин всю научную жизнь специализируется на изучении генома митохондрий человека.')
  await expect(page.locator('#bio')).not.toContainText('единолично отвечает')
  await expect(page.locator('#bio a[href="https://petrovsky.med.ru/education/distsipliny-kafedry6715/"]')).toHaveText('кафедрой биологии и генетики')
  await expect(page.locator('.cv-topic')).toHaveCount(4)
  await expect(page.locator('.pub-list li')).toHaveCount(15)
  await expect(page.locator('.pub-list a[href*="doi.org"]')).toHaveCount(15)
  await expect(page.locator('.pub-list a[href="https://doi.org/10.1093/molbev/msae261"]')).toHaveCount(1)
})

test('contribute page: template download, review statuses and a working e-mail contact', async ({ page, request }) => {
  await page.goto('ru/')
  // «Поделиться данными» перенесено из основного меню в подвал
  await expect(page.locator('nav.primary').getByRole('link', { name: 'Поделиться данными' })).toHaveCount(0)
  await page.locator('footer.site').getByRole('link', { name: 'Исследователям: передать данные' }).click()
  await expect(page).toHaveURL(/\/ru\/contribute\/?$/)
  await expect(page.locator('h1')).toHaveText('Поделиться данными')
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
  await page.locator('#contact').getByRole('button', { name: 'Скопировать адрес' }).click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('ilya.mazunin@gmail.com')
  // иллюстрация пути данных с подписями
  await expect(page.locator('.sk-c-figure svg')).toBeVisible()
  await expect(page.locator('.sk-c-figure .sk-label')).toHaveCount(6)
})

test('contribute page fits a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('ru/contribute/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
