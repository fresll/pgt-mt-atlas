import { expect, test } from './fixtures'

// Английская версия закрыта (64f6686): все проверки — на русских страницах (тексты из src/i18n/ru.ts и
// src/content/fundamentals/ru.ts); en-адреса перенаправляются на те же русские страницы.
const CH = (slug: string) => `fundamentals/${slug}/`

test('Fundamentals is in the main menu and lists six chapters', async ({ page }) => {
  await page.goto('ru/')
  await page.locator('nav.primary').getByRole('link', { name: 'Основы ПГТ-мт' }).click()
  await expect(page).toHaveURL(/\/ru\/fundamentals\/?$/)
  await expect(page.locator('.fd-chapter-index li')).toHaveCount(6)
})

test('every chapter has both reading levels, sources with DOI and links to Atlas data', async ({ page }) => {
  await page.goto('ru/fundamentals/')
  const hrefs = await page.locator('.fd-chapter-index a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
  expect(hrefs).toHaveLength(6)
  for (const href of hrefs) {
    await page.goto(href.replace(/^.*\/ru\//, 'ru/'))
    await expect(page.locator('.fd-essentials')).toBeVisible()
    await expect(page.locator('.fd-advanced')).toBeHidden()
    // источники главы свёрнуты в <details>, но остаются в документе
    await expect(page.locator('details.fd-refs')).not.toHaveAttribute('open')
    expect(await page.locator('.fd-refs li a[href^="https://doi.org/10."]').count()).toBeGreaterThan(3)
    expect(await page.locator('.fd-data a[href*="/science/"], .fd-data a[href*="/contribute/"]').count()).toBeGreaterThan(0)
    // каждая ссылка в тексте ведёт к записи в списке источников главы
    for (const id of await page.locator('.fd-cite a').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!))])) await expect(page.locator(id)).toHaveCount(1)
  }
})

test('a citation in the text opens the collapsed chapter sources at its entry', async ({ page }) => {
  await page.goto(`ru/${CH('heteroplasmy-and-threshold-effects')}`)
  const refs = page.locator('details.fd-refs')
  const cite = page.locator('.fd-essentials .fd-cite a').first()
  const target = (await cite.getAttribute('href'))!
  expect(target).toMatch(/^#ref-/)
  await expect(page.locator('.fd-essentials')).toBeVisible()
  await expect(async () => {
    await cite.click()
    await expect(refs).toHaveAttribute('open', '', { timeout: 500 })
  }).toPass()
  await expect(page.locator(target)).toBeVisible()
  await expect(page.locator(target).locator('a[href^="https://doi.org/10."]')).toBeVisible()
})

test('reading level switch shows Advanced and is remembered across chapters and after the English address redirect', async ({ page }) => {
  await page.goto(`ru/${CH('mitochondrial-genetic-bottleneck')}`)
  await expect(async () => {
    await page.getByRole('button', { name: 'Углублённо', exact: true }).click()
    await expect(page.locator('.fd-essentials')).toBeHidden({ timeout: 500 })
  }).toPass()
  await expect(page.locator('.fd-advanced')).toBeVisible()
  await expect(page.locator('.fd-advanced')).toContainText('распределением Кимуры')
  // следующая глава открывается на выбранном уровне
  await page.locator('.fd-pager .next').click()
  await expect(page).toHaveURL(/\/ru\/fundamentals\/embryo-development-and-biopsy\/?$/)
  await expect(page.locator('.fd-advanced')).toBeVisible()
  await expect(page.locator('.fd-essentials')).toBeHidden()
  // прежняя английская ссылка ведёт на ту же русскую главу, выбранный уровень сохраняется
  await page.goto(`en/${CH('mitochondrial-genetic-bottleneck')}`)
  await expect(page).toHaveURL(/\/ru\/fundamentals\/mitochondrial-genetic-bottleneck\/?$/)
  await expect(page.locator('.fd-advanced')).toBeVisible()
  await expect(page.locator('.fd-advanced')).toContainText('распределением Кимуры')
  await expect(page.getByRole('button', { name: 'Углублённо', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

test('chapter pager links neighbouring chapters', async ({ page }) => {
  await page.goto(`ru/${CH('heteroplasmy-and-threshold-effects')}`)
  await expect(page.locator('.fd-pager .prev')).toHaveAttribute('href', /mtdna-and-maternal-inheritance\/$/)
  await page.locator('.fd-pager .next').click()
  await expect(page).toHaveURL(/mitochondrial-genetic-bottleneck\/?$/)
  await expect(page.locator('h1')).toHaveText('Митохондриальное бутылочное горлышко')
})

test('Heteroplasmy Explorer recolours mtDNA molecules with the slider', async ({ page }) => {
  await page.goto(`ru/${CH('mtdna-and-maternal-inheritance')}`)
  const w = page.locator('#model-heteroplasmy')
  await expect(w.locator('.fd-mt')).toHaveCount(100)
  await expect(w.locator('.fd-mt.mut')).toHaveCount(30)
  // статическая страница интерактивна только после гидратации — повторяем ввод до отклика
  await expect(async () => {
    await w.locator('input[type=range]').fill('75')
    await expect(w.locator('.fd-mt.mut')).toHaveCount(75, { timeout: 500 })
  }).toPass()
  await expect(w).toContainText('75 из 100 молекул мтДНК несут патогенный вариант')
  await w.locator('input[type=range]').fill('0')
  await expect(w).toContainText('гомоплазмия: только мтДНК дикого типа')
  await expect(w).toContainText('а не модель развития заболевания')
})

test('Bottleneck Simulator is labelled as a model and responds to N and redraw', async ({ page }) => {
  await page.goto(`ru/${CH('mitochondrial-genetic-bottleneck')}`)
  const w = page.locator('#model-bottleneck')
  await expect(w.locator('.badge.model')).toBeVisible()
  await expect(w).toContainText('не предсказывает распределение эмбрионов конкретной пациентки')
  await expect(w).toContainText('K ~ Bin(N, h₀)')
  await expect(w.locator('.fd-dot')).toHaveCount(30)
  await expect(async () => {
    await w.getByRole('button', { name: '100', exact: true }).click()
    await expect(w.locator('.fd-dot')).toHaveCount(100, { timeout: 500 })
  }).toPass()
  const before = await w.locator('.fd-summary').innerText()
  await w.locator('input[type=range]').nth(1).fill('6') // N = 500
  await expect(w.locator('.fd-summary')).not.toHaveText(before)
  await expect(w.locator('.fd-summary')).toContainText('2.0 п.п.')
  const s2 = await w.locator('.fd-summary').innerText()
  await w.getByRole('button', { name: /Новая случайная выборка/ }).click()
  await expect(w.locator('.fd-summary')).not.toHaveText(s2)
})

test('Blastocyst & Biopsy Explorer explains TE, ICM and the biopsy', async ({ page }) => {
  await page.goto(`ru/${CH('embryo-development-and-biopsy')}`)
  const w = page.locator('#model-blastocyst')
  await expect(w.locator('.fd-bx-detail h4')).toHaveText('Трофэктодерма (ТЭ)')
  await expect(async () => {
    await w.getByRole('button', { name: 'Внутренняя клеточная масса (ВКМ)' }).click()
    await expect(w.locator('.fd-bx-plate')).toHaveAttribute('data-sel', 'icm', { timeout: 500 })
  }).toPass()
  await expect(w.locator('.fd-bx-detail')).toContainText('переданы для научных целей')
  await w.getByRole('button', { name: 'Биоптат трофэктодермы' }).click()
  await expect(w.locator('.fd-bx-detail')).toContainText('5–10 клеток')
  await expect(page.locator('#model-development')).toBeVisible()
})

test('bibliography lists every source with a DOI and its verification status', async ({ page }) => {
  await page.goto('ru/fundamentals/references/')
  const items = page.locator('.fd-reflist li')
  expect(await items.count()).toBeGreaterThan(50)
  expect(await page.locator('.fd-reflist li a[href^="https://doi.org/10."]').count()).toBe(await items.count())
  await expect(page.locator('#ref-otten2018')).toContainText('doi:10.1093/humrep/dey114')
  await expect(page.locator('#ref-franco2026')).toContainText('препринт, не прошёл рецензирование')
})

test('Fundamentals pages fit a phone screen; the chapter list becomes a select', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const p of ['fundamentals/', CH('mitochondrial-genetic-bottleneck'), CH('embryo-development-and-biopsy'), CH('how-pgt-mt-works')]) {
    await page.goto(`ru/${p}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth), p).toBeLessThanOrEqual(390)
    if (p === 'fundamentals/') continue
    // оглавление «Основ» на узком экране заменено выпадающим списком глав
    await expect(page.locator('.fd-toc'), p).toBeHidden()
    await expect(page.locator('.fd-layout > .section-select select'), p).toBeVisible()
    await expect(page.locator('.fd-layout > .section-select select'), p).toHaveValue(`/ru/${p}`)
  }
})
