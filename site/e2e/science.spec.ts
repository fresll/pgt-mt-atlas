import { expect, test, type Page } from '@playwright/test'

// Научная сверка раунда 1: группы ×n (B3), корректировки по ESM 2 (A3), версии и ID (B2),
// модель (A4), ориентиры (A5), роли источников и основания классификации (раздел 7).

/** Имитирует щелчок Plotly по точке с данной customdata (точки ×n несут ID всех наблюдений группы). */
async function clickPoint(page: Page, pick: 'group' | 'single') {
  return page.evaluate((mode) => {
    const gd = document.querySelector('.chart-frame .js-plotly-plot') as unknown as {
      data: { customdata?: string[] }[]
      emit: (ev: string, d: unknown) => void
    }
    for (const tr of gd.data) {
      const cd = (tr.customdata ?? []).find((c) => (mode === 'group' ? c.includes(' ') : !c.includes(' ')))
      if (cd) {
        gd.emit('plotly_click', { points: [{ customdata: cd }] })
        return cd.split(' ')
      }
    }
    return []
  }, pick)
}

test('×n point opens every observation of the group; table and filters stay consistent (B3)', async ({ page }) => {
  await page.goto('ru/science/heteroplasmy-landscape/')
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(1, { timeout: 20_000 })
  const ids = await clickPoint(page, 'group')
  expect(ids.length).toBeGreaterThanOrEqual(6)
  const panel = page.locator('.obs-group')
  await expect(panel).toHaveAttribute('data-group-size', String(ids.length))
  await expect(panel.locator('.obs-group-list li')).toHaveCount(ids.length)
  // каждое наблюдение группы доступно для выбора
  for (const id of [ids[0], ids[ids.length - 1]]) {
    await panel.getByRole('button', { name: id }).click()
    await expect(page.locator('.detail').filter({ hasText: id }).locator('dl')).toContainText('Прежний ID')
  }
  // таблица показывает ровно эту группу
  await expect(page.locator('table.data tbody tr')).toHaveCount(ids.length)
  await panel.getByRole('button', { name: 'Показать все наблюдения' }).click()
  await expect(page.locator('.obs-group')).toHaveCount(0)
  // смена фильтра (объединение ×n) сбрасывает группу
  await clickPoint(page, 'group')
  await expect(page.locator('.obs-group')).toHaveCount(1)
  await page.getByLabel('Объединять ≥6 совпадающих значений (×n)').uncheck()
  await expect(page.locator('.obs-group')).toHaveCount(0)
  // одиночная точка по-прежнему открывает одну карточку
  const single = await clickPoint(page, 'single')
  await expect(page.locator('.detail')).toContainText(single[0])
})

test('Tofilo 2026 corrections follow ESM 2 and keep the source value (A3)', async ({ page }) => {
  await page.goto('ru/science/embryo-concordance/')
  await page.locator('summary', { hasText: 'Таблица данных' }).click()
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_6' }).click()
  const card = page.locator('.detail')
  await expect(card).toContainText('Исправлено по опубликованному источнику')
  await expect(card).toContainText('11,4%')
  await expect(card).toContainText('11,3%')
  await expect(card).toContainText('исправлено по ESM 2')
  await page.goto('en/science/methods/')
  await expect(page.getByTestId('corrections').locator('tbody tr')).toHaveCount(4)
  await expect(page.getByTestId('corrections')).toContainText('ICM+TE (combined fraction)')
  await expect(page.locator('article')).toContainText('2.2 pp after corrections (2.1 pp from the source workbook)')
})

test('dataset versions: initial frozen release vs current counts; former IDs resolve (B2)', async ({ page }) => {
  await page.goto('ru/science/methods/')
  const counts = page.getByTestId('release-counts')
  await expect(counts).toContainText('2026-10-10')
  await expect(counts.locator('tbody tr').first()).toContainText('187')
  await page.goto('ru/science/data/?id=f3-183')
  const card = page.locator('.detail')
  await expect(card).toContainText(/HL-hu2026-\d{3}/)
  await expect(card).toContainText('f3-183')
  await expect(page.locator('[data-release="current"]')).toContainText('2026-10-10')
})

test('scenario model states what P(≥1) means and labels p_eupl as scenario values (A4)', async ({ page }) => {
  await page.goto('ru/science/pgt-mt-pgt-a-model/')
  await expect(page.getByTestId('model-meaning')).toContainText('не вероятность беременности, рождения ребёнка или рождения здорового ребёнка')
  await expect(page.getByTestId('p-eupl')).toContainText('сценарное значение')
  await expect(page.getByTestId('p-eupl')).toContainText('xfnr.2024.100082')
  await page.goto('en/science/pgt-mt-pgt-a-model/')
  await expect(page.getByTestId('model-meaning')).toContainText('not the probability of pregnancy')
})

test('reference lines carry their role and are not universal thresholds (A5)', async ({ page }) => {
  await page.goto('en/science/methods/')
  const text = await page.locator('article').innerText()
  expect(text).toContain('risk estimate from a specific study')
  expect(text).toContain('working criterion of a clinical programme')
  expect(text).toMatch(/chart convention/)
  expect(text).toContain('single day-3 blastomere')
})

test('every source states its role; classification has a basis (section 7)', async ({ page }) => {
  await page.goto('ru/science/sources/')
  const cards = page.locator('li.card')
  const n = await cards.count()
  expect(n).toBeGreaterThan(20)
  await expect(page.locator('li.card [data-roles]')).toHaveCount(n)
  await expect(page.locator('#hellebrekers2012 [data-roles]')).toHaveAttribute('data-roles', 'threshold')
  await expect(page.locator('#thorburn2009')).toContainText('Исключение по DOI')
  await page.goto('en/science/methods/')
  const vc = page.getByTestId('variant-classes')
  await expect(vc.locator('tr', { hasText: 'm.3250T>C' })).toContainText('Variant of uncertain significance')
  await expect(vc.locator('tr', { hasText: 'm.3250T>C' })).toContainText('Hu et al., 2026')
})
