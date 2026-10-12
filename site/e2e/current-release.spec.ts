import { expect, test } from '@playwright/test'

test('current release is identified and fits desktop and mobile', async ({ page, request }) => {
  const release = await request.get('model-version.json')
  expect(release.ok()).toBeTruthy()
  expect((await release.json()).model_version).toBe('2026-10-12')
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('ru/science/pgt-mt-pgt-a-model/')
    await expect(page.getByTestId('model-version')).toContainText('12 октября 2026')
    await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20000 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
    const fontSize = await page.evaluate(() => getComputedStyle(document.body).fontSize)
    expect(fontSize).toBe(width > 760 ? '20px' : '16px')
    await page.getByTestId('model-rho').selectOption('0.1')
    await page.getByRole('checkbox').check()
    await expect(page.getByTestId('interval-note')).toBeVisible()
    expect(errors).toEqual([])
  }
})
