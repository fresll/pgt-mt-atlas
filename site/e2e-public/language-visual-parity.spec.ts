import { drawing } from './drawing-contract'
import { expect, test, stubCounter } from '../e2e/fixtures'
import type { Page } from '@playwright/test'
import en from '../src/i18n/en'
import ru from '../src/i18n/ru'
import es from '../src/i18n/es'

const LANGS = ['en', 'ru', 'es'] as const
const VIEWS = [
  { name: 'desktop', viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 },
  { name: 'phone-dark', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 },
  { name: '200-percent', viewport: { width: 800, height: 550 }, deviceScaleFactor: 2 },
] as const
const ROUTES = [
  ['', 0, '.sk-hero-figure .sk-plate, .sk-side-figure .sk-illustration, .sk-data-figure .sk-illustration', 3],
  ['contribute/', 0, '.sk-c-figure .sk-plate', 1],
  ['science/heteroplasmy-landscape/', 1, '.js-plotly-plot', 1],
  ['science/embryo-concordance/', 3, '.js-plotly-plot', 3],
  ['science/embryo-to-offspring/', 2, '.js-plotly-plot', 2],
  ['science/pgt-mt-pgt-a-model/', 3, '.js-plotly-plot', 3],
  ['fundamentals/mtdna-and-maternal-inheritance/', 0, '.fd-het-plate', 1],
  ['fundamentals/heteroplasmy-and-threshold-effects/', 0, '.fd-chart', 1],
  ['fundamentals/mitochondrial-genetic-bottleneck/', 0, '.fd-chart', 1],
  ['fundamentals/embryo-development-and-biopsy/', 0, '.fd-dev, .fd-bx-plate', 2],
] as const
const CAPTURE = { animations: 'disabled' as const, style: 'header.site, .fd-level-switch { visibility: hidden !important; }' }

async function ready(page: Page, route: string, lang: string, plots: number) {
  await page.goto(`${lang}/${route}`)
  await expect(page.locator('html')).toHaveAttribute('lang', lang)
  if (route.startsWith('fundamentals/')) await expect(page.locator('.fd-levels')).toHaveAttribute('data-level', 'essentials')
  await expect(page.locator('.js-plotly-plot')).toHaveCount(plots)
  for (const chart of await page.locator('.js-plotly-plot').all()) await expect(chart.locator('.main-svg').first()).toBeAttached()
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' })
}


for (const [route, plots, selector, count] of ROUTES) {
  test(`EN/RU/ES have identical drawings: ${route || 'home'}`, async ({ browser }, info) => {
    test.setTimeout(180_000)
    for (const view of VIEWS) {
      const context = await browser.newContext({ ...view, colorScheme: view.name === 'phone-dark' ? 'dark' : 'light', reducedMotion: 'reduce' })
      await stubCounter(context)
  const page = await context.newPage()
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      const baseline: unknown[] = []
      for (const lang of LANGS) {
        await ready(page, route, lang, plots)
        const figures = page.locator(selector)
        await expect(figures).toHaveCount(count)
        for (let i = 0; i < count; i++) {
          const figure = figures.nth(i)
          if (route.includes('model') && await page.locator('.panel-tabs').isVisible()) {
            await page.locator('.panel-tabs button').nth(i).click()
            // Every newly visible tab must fit the viewport, including the
            // plots that were initialized while display:none.
            await expect.poll(() => figure.evaluate(el => Math.abs(el.getBoundingClientRect().width - el.querySelector('.main-svg')!.getBoundingClientRect().width))).toBeLessThan(1)
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(view.viewport.width)
          }
          await figure.scrollIntoViewIfNeeded()
          await page.mouse.move(0, 0)
          const contract = await drawing(figure)
          if (lang === 'en') baseline[i] = contract
          else expect(contract, `${view.name}/${lang}/${route}/${i + 1}`).toEqual(baseline[i])
          // The development labels extend below the SVG's box; include the
          // enclosing figure so the comparison image keeps the complete text.
          const capture = route === 'fundamentals/embryo-development-and-biopsy/' && i === 0 ? figure.locator('xpath=ancestor::figure[1]') : figure
          await capture.screenshot({ ...CAPTURE, path: info.outputPath(`${view.name}-${lang}-${i + 1}.png`) })
        }
        if (view.name === '200-percent' && route === 'science/heteroplasmy-landscape/') {
          const scroller = figures.first().locator('xpath=ancestor::div[contains(@style,"overflow-x")][1]')
          await scroller.evaluate((el) => { el.scrollLeft = el.scrollWidth })
          await scroller.screenshot({ ...CAPTURE, path: info.outputPath(`${view.name}-${lang}-1-right.png`) })
        }
      }
      if (route.includes('model') && view.name === 'phone-dark') {
        for (const lang of ['en', 'ru', 'es'] as const) {
          await page.locator(`.language-switch a[lang=${lang}]`).click()
          await expect(page.locator('html')).toHaveAttribute('lang', lang)
          for (let i = 0; i < count; i++) {
            await page.locator('.panel-tabs button').nth(i).click()
            const figure = page.locator(selector).nth(i)
            await expect(figure.locator('.ytitle')).toHaveText({ en, ru, es }[lang].model.yAxis)
            await expect.poll(() => figure.evaluate(el => Math.abs(el.getBoundingClientRect().width - el.querySelector('.main-svg')!.getBoundingClientRect().width))).toBeLessThan(1)
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(view.viewport.width)
            await expect.poll(() => drawing(figure)).toEqual(baseline[i])
          }
        }
      }
      expect(errors).toEqual([])
      await info.attach(`${view.name}-drawing-contract.json`, { body: JSON.stringify(baseline), contentType: 'application/json' })
      await context.close()
    }
  })
}

test('changing language preserves filters, selection, zoom, pan and reset on every scientific panel', async ({ page }) => {
  test.setTimeout(180_000)
  await page.setViewportSize({ width: 1600, height: 1100 })
  for (const [route, plots] of ROUTES.filter(([, n]) => n > 0)) {
    await ready(page, route, 'en', plots)
    if (route.includes('landscape')) {
      await page.getByRole('button', { name: 'Explore', exact: true }).click()
      await page.locator('input[type=number]').fill('25')
      await page.locator('fieldset input').first().uncheck()
    } else if (route.includes('concordance')) await page.locator('input[type=checkbox]').uncheck()
    else if (route.includes('offspring')) await page.locator('input[type=checkbox]').check()
    else {
      await page.locator('.seg button').nth(2).click()
      await page.getByTestId('model-rho').selectOption('0.2')
      await page.getByRole('button', { name: '<', exact: true }).click()
      await page.getByTestId('model-te-only').check()
      await page.getByRole('checkbox', { name: en.model.showRange }).uncheck()
      await page.getByTestId('model-n').fill('5')
    }
    const charts = page.locator('.js-plotly-plot')
    // Select a real observation; its highlighted marker must survive translation too.
    if (!route.includes('model')) await charts.first().locator('.scatterlayer .point').first().click({ force: true })
    const ranges = () => charts.evaluateAll((els) => els.map((el: any) => [el._fullLayout.xaxis.range, el._fullLayout.yaxis.range]))
    const initialRanges = await ranges()
    for (const chart of await charts.all()) {
      const zoom = chart.getByRole('button', { name: 'Zoom in', exact: true })
      if (await zoom.count()) {
        await zoom.click()
        await chart.getByRole('button', { name: 'Pan', exact: true }).click()
        const before = await chart.evaluate((e: any) => [e._fullLayout.xaxis.range, e._fullLayout.yaxis.range])
        // A toolbar can be visible while the plot centre is below the viewport
        // (notably Offspring after selecting an observation). Mouse coordinates
        // do not scroll automatically, so bring the primary XY surface into view.
        const area = chart.locator('.nsewdrag[data-subplot="xy"]')
        await area.scrollIntoViewIfNeeded()
        const box = await area.boundingBox()
        expect(box).not.toBeNull()
        if (box) {
          await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
          await page.mouse.down()
          await page.mouse.move(box.x + box.width * 0.56, box.y + box.height * 0.58, { steps: 8 })
          await page.mouse.up()
          await expect.poll(() => chart.evaluate((e: any) => [e._fullLayout.xaxis.range, e._fullLayout.yaxis.range])).not.toEqual(before)
        }
      }
    }
    const baseline = await Promise.all((await charts.all()).map(drawing))
    const controls = () => page.locator('article input, article select, article button[aria-pressed]').evaluateAll((els) => els.map((n) => { const i = n as HTMLInputElement; return [i.tagName, i.value, i.checked, i.getAttribute('aria-pressed')] }))
    const state = await controls()
    for (const lang of ['es', 'ru', 'en'] as const) {
      await page.locator(`.language-switch a[lang=${lang}]`).click()
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      // Wait for Plotly to paint translated axes, rather than reading the previous language's frame.
      const dict = { en, ru, es }[lang]
      const title = route.includes('landscape') ? dict.landscape.yAxis : route.includes('concordance') ? dict.concordance.yA : route.includes('offspring') ? dict.offspring.yA : dict.model.yAxis
      await expect(charts.first().locator('.ytitle')).toHaveText(title)
      await expect.poll(async () => Promise.all((await charts.all()).map(drawing))).toEqual(baseline)
      expect(await controls()).toEqual(state)
    }
    for (const chart of await charts.all()) {
      const reset = chart.getByRole('button', { name: 'Reset axes', exact: true })
      if (await reset.count()) {
        await reset.click()
      }
    }
    await expect.poll(ranges).toEqual(initialRanges)
    await page.locator('.language-switch a[lang=es]').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect.poll(ranges).toEqual(initialRanges)
  }
})

test('educational models preserve identical parameter changes, seeded samples and selections across languages', async ({ page }) => {
  await ready(page, 'fundamentals/mtdna-and-maternal-inheritance/', 'en', 0)
  const cell = page.locator('#model-heteroplasmy')
  await cell.locator('input').fill('75')
  await expect(cell.locator('.fd-mt.mut')).toHaveCount(75)
  const cellDrawing = await drawing(cell.locator('.fd-het-plate'))
  for (const lang of ['es', 'ru', 'en']) {
    await page.locator(`.language-switch a[lang=${lang}]`).click()
    await expect(page.locator('html')).toHaveAttribute('lang', lang)
    expect(await drawing(cell.locator('.fd-het-plate'))).toEqual(cellDrawing)
    await expect(cell.locator('input')).toHaveValue('75')
  }
  await ready(page, 'fundamentals/mitochondrial-genetic-bottleneck/', 'en', 0)
  const bn = page.locator('#model-bottleneck')
  await bn.locator('input').first().fill('85')
  await bn.locator('input').nth(1).fill('6')
  await bn.getByRole('button', { name: '100', exact: true }).click()
  await bn.locator('.fd-redraw').click()
  await expect(bn.locator('.fd-dot')).toHaveCount(100)
  const sample = await drawing(bn.locator('.fd-chart'))
  for (const lang of ['es', 'ru', 'en']) {
    await page.locator(`.language-switch a[lang=${lang}]`).click()
    await expect(page.locator('html')).toHaveAttribute('lang', lang)
    expect(await drawing(bn.locator('.fd-chart'))).toEqual(sample)
    await expect(bn.locator('input').first()).toHaveValue('85')
    await expect(bn.locator('input').nth(1)).toHaveValue('6')
  }
  await ready(page, 'fundamentals/embryo-development-and-biopsy/', 'en', 0)
  const bx = page.locator('#model-blastocyst')
  for (const i of [0, 1, 2]) {
    await bx.locator('.fd-parts button').nth(i).click()
    const selected = await drawing(bx.locator('.fd-bx-plate'))
    for (const lang of ['es', 'ru', 'en']) {
      await page.locator(`.language-switch a[lang=${lang}]`).click()
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      expect(await drawing(bx.locator('.fd-bx-plate'))).toEqual(selected)
      await expect(bx.locator('.fd-parts button').nth(i)).toHaveAttribute('aria-pressed', 'true')
    }
  }
})
