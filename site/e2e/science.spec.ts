import { expect, test, type Page } from './fixtures'

// Научная сверка раунда 1: группы ×n (B3), корректировки по ESM 2 (A3), версии и ID (B2),
// модель (A4), ориентиры (A5), роли источников и основания классификации (раздел 7).
// Английская версия закрыта (64f6686): проверяются русские страницы.

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

/** Простой разбор CSV из раздела «Таблица значений» (поля без переводов строк). */
function parseCsv(text: string): Record<string, string>[] {
  const split = (line: string) => {
    const out: string[] = []
    let cur = ''
    let quoted = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (quoted && ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') quoted = !quoted
      else if (ch === ',' && !quoted) { out.push(cur); cur = '' }
      else cur += ch
    }
    out.push(cur)
    return out
  }
  const [head, ...rows] = text.trim().split(/\r?\n/).map(split)
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
}

/** CSV по ссылке со страницы «Таблица значений» (тот же файл, что скачивает пользователь). */
async function csvFromDataPage(page: Page, name: string) {
  await page.goto('ru/science/data/')
  const href = await page.locator(`a[download][href$="data/csv/${name}.csv"]`).getAttribute('href')
  expect(href, name).toBeTruthy()
  const res = await page.request.get(new URL(href!, page.url()).href)
  expect(res.status(), name).toBe(200)
  return parseCsv(await res.text())
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

// Карточка эмбриона и страница «Методы» больше не показывают слой корректировок (64f6686); исходное значение
// и ссылка на корректировку сохраняются в публикуемом measurement.csv, сверка — в verification.csv.
test('Tofilo 2026 corrections follow ESM 2 and keep the source value (A3)', async ({ page }) => {
  await page.goto('ru/science/embryo-concordance/')
  // зависимые статистики пересчитаны из исправленного набора (по исходной таблице было бы 2,1 п.п.)
  await expect(page.locator('article')).toContainText('Медиана размаха: 2,2 п.п. (21 патогенных бластоцист)')
  await page.locator('summary', { hasText: 'Таблица данных' }).click()
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_6' }).click()
  const card = page.locator('.detail')
  // на сайте — значения опубликованного ESM 2, у каждого — строка исходной таблицы
  await expect(card.locator('dl')).toContainText('11,3%')
  await expect(card.locator('dl')).toContainText('11,7%')
  await expect(card.locator('dl')).not.toContainText('11,4%')
  await expect(card).toContainText('лист «Рисунок 4», строка 81')
  // категория фракции эмбрионов 3 и 4 приведена к ESM 2: объединённая фракция ВКМ+ТЭ
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_3' }).click()
  await expect(page.locator('.detail')).toContainText('ВКМ+ТЭ (объединённая фракция)')

  const measurements = await csvFromDataPage(page, 'measurement')
  const corrected = measurements.filter((m) => m.correction_ids)
  expect(corrected.map((m) => m.correction_ids).sort()).toEqual([
    'corr-tofilo2026-e3-fraction', 'corr-tofilo2026-e4-fraction', 'corr-tofilo2026-e6-icm', 'corr-tofilo2026-e6-remaining-te',
  ])
  const icm = measurements.find((m) => m.legacy_id === 'f4-081')!
  expect(icm).toMatchObject({ sample_id: 'emb-Tofilo_6-icm', value_pct: '11.3', value_source_pct: '11.4', src_sheet: 'Рисунок 4', src_row: '81' })
  const e3 = measurements.find((m) => m.correction_ids === 'corr-tofilo2026-e3-fraction')!
  expect(e3).toMatchObject({ sample_id: 'emb-Tofilo_3-combined_te_icm', fraction_source: 'remaining_te', value_pct: '13.5', value_source_pct: '13.5' })
})

// Сравнение с исходной зафиксированной версией 2026-10-10 со страниц снято (64f6686): «Методы» показывают
// объём текущего набора, «Таблица значений» — число значений; прежние ID по-прежнему находятся.
test('dataset size: current counts on Methods and Data; former IDs resolve (B2)', async ({ page }) => {
  await page.goto('ru/science/methods/')
  const counts = page.getByTestId('release-counts')
  await expect(counts.locator('tbody tr').first()).toContainText('значения гетероплазмии эмбрионов')
  await expect(counts.locator('tbody tr').first()).toContainText('187')
  await expect(counts.locator('tbody tr', { hasText: 'публикации' })).toContainText('22')
  for (const entry of ['ru', 'en']) {
    await page.goto(`${entry}/science/data/?id=f3-183`)
    await expect(page).toHaveURL(/\/ru\/science\/data\/\?id=f3-183$/)
    const card = page.locator('.detail')
    await expect(card).toContainText(/HL-hu2026-\d{3}/)
    await expect(card).toContainText('f3-183')
    await expect(page.locator('[data-release="current"]')).toContainText('В наборе: 187 значений гетероплазмии эмбрионов')
  }
})

test('scenario model states what P(≥1) means and labels p_eupl as scenario values (A4)', async ({ page }) => {
  await page.goto('ru/science/pgt-mt-pgt-a-model/')
  await expect(page.getByTestId('model-meaning')).toContainText('не вероятность беременности, рождения ребёнка или рождения здорового ребёнка')
  await expect(page.getByTestId('p-eupl')).toContainText('сценарное значение')
  await expect(page.getByTestId('p-eupl')).toContainText('xfnr.2024.100082')
})

test('reference lines carry their role and are not universal thresholds (A5)', async ({ page }) => {
  await page.goto('ru/science/methods/')
  const text = await page.locator('article').innerText()
  expect(text).toContain('оценка риска в конкретном исследовании')
  expect(text).toContain('рабочий критерий клинической программы')
  expect(text).toMatch(/условное обозначение графика/)
  expect(text).toContain('одном бластомере 3-го дня')
  expect(text).toContain('Ни одно из этих чисел не задаёт безопасного порога для отдельного эмбриона')
})

test('every source states its role; classification has a basis (section 7)', async ({ page }) => {
  await page.goto('ru/science/sources/')
  const cards = page.locator('li.card')
  const n = await cards.count()
  expect(n).toBeGreaterThan(20)
  await expect(page.locator('li.card [data-roles]')).toHaveCount(n)
  await expect(page.locator('#hellebrekers2012 [data-roles]')).toHaveAttribute('data-roles', 'threshold')
  await expect(page.locator('#thorburn2009')).toContainText('Исключение по DOI')
  await page.goto('ru/science/methods/')
  const vc = page.getByTestId('variant-classes')
  await expect(vc.locator('tr', { hasText: 'm.3250T>C' })).toContainText('Вариант неопределённого значения')
  await expect(vc.locator('tr', { hasText: 'm.3250T>C' })).toContainText('Hu et al., 2026')
})
