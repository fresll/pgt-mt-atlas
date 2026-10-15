import { expect, test } from './fixtures'

// Версия модели публикуется в model-version.json и выводится на странице модели одной строкой (только номер версии).
test('current release is identified and fits desktop and mobile', async ({ page, request }) => {
  const release = await request.get('model-version.json')
  expect(release.ok()).toBeTruthy()
  expect((await release.json()).model_version).toBe('2026-10-12')
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('ru/science/pgt-mt-pgt-a-model/')
    await expect(page.getByTestId('model-version')).toHaveAttribute('data-model-version', '2026-10-12')
    await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20000 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
    const fontSize = await page.evaluate(() => getComputedStyle(document.body).fontSize)
    expect(fontSize).toBe(width > 760 ? '20px' : '16px')
    // три сценария p_эупл: на широком экране рядом, на телефоне — по одному с переключателем .panel-tabs
    const panels = page.locator('.model-panels > div')
    const tabs = page.locator('.panel-tabs button')
    if (width > 760) {
      await expect(page.locator('.panel-tabs')).toBeHidden()
      for (let i = 0; i < 3; i++) await expect(panels.nth(i).locator('.js-plotly-plot')).toBeVisible()
    } else {
      await expect(tabs).toHaveCount(3)
      await expect(tabs.first()).toHaveAttribute('aria-pressed', 'true')
      await expect(panels.nth(0).locator('.js-plotly-plot')).toBeVisible()
      await expect(panels.nth(1)).toBeHidden()
      await expect(panels.nth(2)).toBeHidden()
      await tabs.nth(1).click()
      await expect(tabs.nth(1)).toHaveAttribute('aria-pressed', 'true')
      await expect(panels.nth(1).locator('.js-plotly-plot')).toBeVisible()
      await expect(panels.nth(0)).toBeHidden()
    }
    await page.getByTestId('model-rho').selectOption('0.1')
    await page.getByRole('checkbox', { name: 'Показать чувствительность к условному интервалу H' }).check()
    await expect(page.getByTestId('interval-note')).toBeVisible()
    expect(errors).toEqual([])
  }
})
