import es from '../src/i18n/es'
import { expect, test, stubCounter } from '../e2e/fixtures'

test('Spanish direct routes remember the choice while the published root still opens Russian', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-MX' })
  await stubCounter(context)
  const page = await context.newPage()
  await page.goto('http://localhost:4174/pgt-mt-atlas/es/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('atlas-lang'))).toBe('es')
  await expect(page.locator('nav.primary')).toContainText('Datos para especialistas')
  await page.goto('http://localhost:4174/pgt-mt-atlas/')
  await expect(page).toHaveURL(/\/ru\/$/)
  await context.close()
})

test('Spanish language switch retains reading level, query and anchor', async ({ page }) => {
  await page.goto('en/fundamentals/mitochondrial-genetic-bottleneck/?x=1#advanced')
  await expect(page.locator('.fd-levels')).toHaveAttribute('data-level', 'essentials')
  await page.getByRole('button', { name: 'Advanced', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Español', exact: true })).toHaveAttribute('href', /\/es\/fundamentals\/mitochondrial-genetic-bottleneck\/\?x=1#advanced$/)
  await page.getByRole('link', { name: 'Español', exact: true }).click()
  await expect(page.locator('.fd-advanced')).toBeVisible()
  await expect(page.locator('.fd-essentials')).toBeHidden()
  await expect(page.locator('h1')).toHaveText('El cuello de botella genético mitocondrial')
  await page.getByRole('link', { name: 'Русский', exact: true }).click()
  await expect(page).toHaveURL(/\/ru\/fundamentals\/mitochondrial-genetic-bottleneck\/\?x=1#advanced$/)
})

test('Spanish plots use translated controls and decimal commas', async ({ page }) => {
  await page.goto('es/science/pgt-mt-pgt-a-model/')
  const chart = page.locator('.js-plotly-plot').first()
  await expect(chart).toBeVisible()
  await expect(page.locator('.badge.model')).toContainText(es.badge.model)
  await expect(page.locator('.badge.observed')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Descargar gráfico como PNG', exact: true })).toHaveCount(3)
  await expect(chart.locator('g.ytick text').first()).toContainText('0,0')
  await expect(page.getByRole('button', { name: 'Compartir gráfico…', exact: true })).toHaveCount(3)
  await page.screenshot({ path: test.info().outputPath('atlas-es-model.png'), fullPage: true })
  const pngReady = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar gráfico como PNG', exact: true }).first().click()
  const png = await pngReady
  expect(png.suggestedFilename()).toMatch(/\.png$/)
  expect(await png.failure()).toBeNull()
  await expect(page.locator('[data-testid="p-eupl"]')).toContainText(es.model.scenarioNote)
  await page.goto('es/science/embryo-concordance/')
  await expect(page.locator('.badge.observed')).toContainText(es.badge.observed)
  await page.getByText('Tabla de datos', { exact: false }).click()
  await page.locator('table.data tbody tr', { hasText: 'Tofilo_6' }).click()
  // Current published UI reports the corrected values directly in the detail.
  for (const value of ['11,3 %', '11,7 %', '2,2 p. p.']) await expect(page.locator('.detail')).toContainText(value)
  await expect(page.locator('.detail')).toContainText('doi:10.1007/s10815-026-04012-y')
})

test('Spanish patient page preserves uncertainty and the distinction between the biopsy and child', async ({ page }) => {
  await page.goto('es/patients/')
  await expect(page.locator('h1')).toHaveText(es.patients.title)
  await expect(page.locator('main')).toContainText('reduce el riesgo de transmitir una enfermedad mitocondrial, pero no lo elimina')
  await expect(page.locator('main')).toContainText('No existe un porcentaje de heteroplasmia «seguro» universal')
  await expect(page.locator('main')).toContainText('una o varias células en un único momento')
  await expect(page.locator('main')).toContainText('no establece un «0 %»')
})

test('Spanish static content and language links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  await stubCounter(context)
  const page = await context.newPage()
  await page.goto('http://localhost:4174/pgt-mt-atlas/es/fundamentals/mtdna-and-maternal-inheritance/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.locator('.fd-essentials')).toBeVisible()
  await expect(page.locator('.fd-advanced')).toBeVisible()
  await expect(page.getByRole('link', { name: 'English', exact: true })).toHaveAttribute('href', /\/en\/fundamentals\/mtdna-and-maternal-inheritance\/$/)
  await context.close()
})

test('Spanish pages fit phone and desktop widths, in light and dark themes', async ({ page }) => {
  test.setTimeout(180_000)
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['', 'fundamentals/', 'fundamentals/embryo-development-and-biopsy/', 'fundamentals/mitochondrial-genetic-bottleneck/', 'fundamentals/how-pgt-mt-works/#advanced', 'fundamentals/interpretation-and-limitations/#advanced', 'science/', 'science/pgt-mt-pgt-a-model/', 'science/methods/', 'patients/', 'contribute/', 'ilya-mazunin/']) {
      await page.goto(`es/${path}`)
      if (!path) await page.screenshot({ path: test.info().outputPath(`atlas-es-home-${width}.png`) })
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}/es/${path}`).toBeLessThanOrEqual(width)
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `dark ${width}/es/${path}`).toBeLessThanOrEqual(width)
    }
  }
})
