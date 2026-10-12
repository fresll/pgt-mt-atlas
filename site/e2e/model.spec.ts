import { expect, test } from '@playwright/test'

test('scenarios preserve the baseline and expose dependence, strict thresholds and zero yield', async ({ page }) => {
  await page.goto('ru/science/pgt-mt-pgt-a-model/')
  await expect(page.getByTestId('model-version')).toHaveAttribute('data-model-version', '2026-10-12')
  const row = page.getByTestId('model-table').locator('[data-variant="m.3243A>G"]')
  await expect(row).toContainText('41/87')
  await expect(row).toContainText('52/87')
  await page.getByTestId('model-n').fill('6')
  const probability = row.locator('td').nth(5).locator('[data-cut="18"] [data-probability]')
  await expect(probability).toHaveText('0,80')
  await page.getByTestId('model-rho').selectOption('0.1')
  await expect(probability).toHaveText('0,72')
  await expect(page.getByTestId('rho-note')).toContainText('не измеренная корреляция')
  await page.getByRole('group', { name: 'Правило границы', exact: true }).getByRole('button', { name: '<', exact: true }).click()
  await expect(row.locator('td').nth(2)).toContainText('51/87')
  await page.getByTestId('model-n').fill('0')
  const probabilities = await page.getByTestId('model-table').locator('[data-probability]').allTextContents()
  expect(probabilities.length).toBeGreaterThan(0)
  expect(probabilities.every((value) => value === '0,00')).toBe(true)
})

test('both languages identify conditional uncertainty and primary-series evidence', async ({ page }) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`${lang}/science/pgt-mt-pgt-a-model/`)
    await expect(page.getByTestId('model-input-summary')).toContainText('187')
    await expect(page.getByTestId('model-input-summary')).toContainText('53')
    await expect(page.getByTestId('joint-evidence').locator('tbody tr')).toHaveCount(3)
    await expect(page.getByTestId('joint-evidence')).toContainText('0/15')
    await expect(page.getByTestId('sallevelt-note')).toContainText('2/23–6/23')
    await expect(page.getByTestId('model-table').locator('[data-variant="m.3250T>C"]')).toContainText('VUS')
    await page.getByRole('checkbox', { name: lang === 'ru' ? 'Показать чувствительность к условному интервалу h' : 'Show sensitivity to a conditional interval for h' }).check()
    await expect(page.getByTestId('interval-note')).toContainText('Wilson')
    await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  }
})
