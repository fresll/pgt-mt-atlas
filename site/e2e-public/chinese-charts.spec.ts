import { writeFileSync } from 'node:fs'
import { unexpectedChartWords } from './chinese-audit'
import es from '../src/i18n/zh'
import { expect, test, stubCounter } from '../e2e/fixtures'
import type { Locator } from '@playwright/test'

const PLOTS = [
  ['heteroplasmy-landscape', 1],
  ['embryo-concordance', 3],
  ['embryo-to-offspring', 2],
  ['pgt-mt-pgt-a-model', 3],
] as const
const CAPTURE = { style: 'header.site, .fd-level-switch { visibility: hidden !important; }', animations: 'disabled' as const }
const FOREIGN = /[А-Яа-яЁё]|(?<![\p{L}\p{N}_])(?:polimorfismo|biopsia|blastocisto|sangre|tejido|Ampliar|Restablecer|polymorphism|biopsy|blastocyst|cleavage|remaining|blood|tissues|months|weeks|birth|euploid|aneuploid|mosaic|Zoom|Reset axes|Click to enter|Download plot|Share chart)(?![\p{L}\p{N}_])/u

async function surface(chart: Locator) {
  const result = await chart.evaluate((node) => {
    const el = node as HTMLElement & {
      _fullLayout: Record<string, any>
      data: Record<string, any>[]
    }
    const axes = Object.entries(el._fullLayout).filter(([k]) => /^[xy]axis\d*$/.test(k))
    return {
      axes: axes.map(([id, a]) => ({ id, title: a.title?.text, ticks: a.ticktext, range: a.range, fixed: a.fixedrange })),
      // All prepared hover texts, including points that overlap or are outside the current zoom.
      hover: el.data.map((d) => ({ text: d.text, name: d.name, template: d.hovertemplate })),
      annotations: el._fullLayout.annotations.map((a: { text: string }) => a.text),
      rendered: [...el.querySelectorAll('text')].map((n) => n.textContent),
      controls: [...el.querySelectorAll('.modebar-btn')].map((n) => n.getAttribute('data-title')),
    }
  })
  expect(unexpectedChartWords([result.axes.map(a=>[a.title,a.ticks]), result.hover.map(h=>[h.text,h.name,h.template]), result.annotations, result.rendered, result.controls])).toEqual([])
  return result
}

for (const [slug, count] of PLOTS) {
  test(`Chinese ${slug}: labels, real hover, zoom, pan, reset and enlarged inspection`, async ({ page, browser }, info) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 1600, height: 1100 })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`zh-Hans/science/${slug}/`)
    await expect(page.locator('.js-plotly-plot')).toHaveCount(count)
    await page.evaluate(() => document.fonts.ready)
    const observations: unknown[] = []
    for (let i = 0; i < count; i++) {
      const chart = page.locator('.js-plotly-plot').nth(i)
      await expect(chart.locator('.main-svg').first()).toBeVisible()
      const normal = await surface(chart)
      writeFileSync(info.outputPath(`${slug}-${i+1}-surface.json`),JSON.stringify(normal,null,2))
      const visible = [normal.axes.map(a=>[a.title,a.ticks]), normal.hover.map(h=>[h.text,h.name,h.template]), normal.annotations, normal.rendered, normal.controls]
      expect(unexpectedChartWords(visible), `all labels in ${slug}/${i + 1}`).toEqual([])
      expect(JSON.stringify(normal)).not.toMatch(FOREIGN)
      await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-normal.png`) })
      for (const b of await chart.locator('.modebar-btn').all()) {
        await b.hover()
        expect(await b.getAttribute('data-title')).not.toMatch(FOREIGN)
      }
      // Real mouse hover checks rendered tooltips as well as the entire prepared text corpus.
      let hovered = false
      for (const point of (await chart.locator('.scatterlayer .point').all()).slice(0, 35)) {
        const box = await point.boundingBox()
        if (!box) continue
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        const hover = chart.locator('.hoverlayer .hovertext')
        if (await hover.count()) {
          expect(await hover.allTextContents()).not.toEqual([])
          expect((await hover.allTextContents()).join(' ')).not.toMatch(FOREIGN)
          await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-hover.png`) })
          hovered = true
          break
        }
      }
      if (!hovered) {
        for (const line of await chart.locator('.scatterlayer .js-line').all()) {
          const point = await line.evaluate((el) => { const p = el as SVGPathElement; const q = p.getPointAtLength(p.getTotalLength() * 0.45); const m = p.getScreenCTM(); if (!m) return null; const v = q.matrixTransform(m); return { x: v.x, y: v.y } })
          if (!point) continue
          await page.mouse.move(point.x, point.y)
          const hover = chart.locator('.hoverlayer .hovertext')
          if (await hover.count()) { expect((await hover.allTextContents()).join(' ')).not.toMatch(FOREIGN); hovered = true; await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-hover.png`) }); break }
        }
      }
      expect(hovered, `${slug}/${i + 1}: tooltip displayed with the mouse`).toBe(true)
      await page.mouse.move(0, 0)
      const canZoom = normal.axes.some((a) => !a.fixed)
      if (canZoom) {
        const ranges = () => surface(chart).then((s) => s.axes.map((a) => a.range))
        const initial = normal.axes.map((a) => a.range)
        await chart.getByRole('button', { name: '放大', exact: true }).click()
        await expect.poll(ranges).not.toEqual(initial)
        const zoomed = await surface(chart)
        expect(JSON.stringify(zoomed)).not.toMatch(FOREIGN)
        await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-zoom-in.png`) })
        await chart.getByRole('button', { name: '缩小', exact: true }).click()
        expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
        await chart.getByRole('button', { name: '重置坐标轴', exact: true }).click()
        await expect.poll(ranges).toEqual(initial)
        const area = chart.locator('.nsewdrag').first()
        await chart.getByRole('button', { name: '框选放大', exact: true }).click()
        const box = await area.evaluate(el => {
          const a = el.getBoundingClientRect()
          const v = el.closest('.chart-viewport')!.getBoundingClientRect()
          const left = Math.max(a.left, v.left, 0), right = Math.min(a.right, v.right, innerWidth)
          const top = Math.max(a.top, v.top, 0), bottom = Math.min(a.bottom, v.bottom, innerHeight)
          return { x: left, y: top, width: right - left, height: bottom - top }
        })
        expect(box.width).toBeGreaterThan(20)
        expect(box.height).toBeGreaterThan(20)
        if (box) {
          await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25)
          await page.mouse.down()
          await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75, { steps: 12 })
          await page.mouse.up()
          await expect.poll(ranges).not.toEqual(initial)
          const beforePan = await ranges()
          await chart.getByRole('button', { name: '平移', exact: true }).click()
          await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
          await page.mouse.down()
          await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 10 })
          await page.mouse.up()
          await expect.poll(ranges).not.toEqual(beforePan)
          expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
          await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-pan.png`) })
          await chart.getByRole('button', { name: '重置坐标轴', exact: true }).click()
          await expect.poll(ranges).toEqual(initial)
        }
        observations.push({ panel: i + 1, normal, zoomed, zoom: 'buttons, box selection, pan and reset' })
      } else {
        expect(await chart.getByRole('button', { name: '放大', exact: true }).count()).toBe(0)
        observations.push({ panel: i + 1, normal, zoom: 'fixed scientific axes; inspected at 200% page scale' })
      }
    }
    // Also inspect all panels enlarged, including scientific panels with fixed data ranges.
    // Native browser zoom at 200% on a 1600px display has an 800px CSS viewport and DPR 2.
    // A separate context avoids CSS zoom, which distorts Plotly's text measurement.
    const enlargedContext = await browser.newContext({ viewport: { width: 800, height: 550 }, deviceScaleFactor: 2, locale: 'zh-CN' })
    await stubCounter(enlargedContext)
    const enlarged = await enlargedContext.newPage()
    await enlarged.goto(page.url())
    await expect(enlarged.locator('.js-plotly-plot')).toHaveCount(count)
    await enlarged.evaluate(() => document.fonts.ready)
    for (let i = 0; i < count; i++) {
      const chart = enlarged.locator('.js-plotly-plot').nth(i)
      if (slug.includes('model') && await enlarged.locator('.panel-tabs').isVisible()) await enlarged.locator('.panel-tabs button').nth(i).click()
      await chart.scrollIntoViewIfNeeded()
      expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
      await chart.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-enlarged-200.png`) })
      if (slug === 'heteroplasmy-landscape') {
        const scroller = chart.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," chart-viewport ")][1]')
        await scroller.evaluate((el) => { el.scrollLeft = el.scrollWidth })
        expect(await scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
        await scroller.screenshot({ ...CAPTURE, path: info.outputPath(`${slug}-${i + 1}-enlarged-200-right.png`) })
      }
    }
    await enlargedContext.close()
    expect(errors).toEqual([])
    writeFileSync(info.outputPath('chart-labels-and-controls.json'), JSON.stringify(observations, null, 2))
  })
}

test('Chinese expanded views preserve translated labels with filters and model parameters', async ({ page }) => {
  await page.goto('zh-Hans/science/heteroplasmy-landscape/')
  await page.getByRole('button', { name: '探索', exact: true }).click()
  const threshold = page.getByLabel('自定义筛选界值，%')
  await threshold.fill('25')
  await expect(page.locator('.badge.warn').first()).toBeVisible()
  expect(JSON.stringify(await surface(page.locator('.js-plotly-plot')))).not.toMatch(FOREIGN)
  await page.goto('zh-Hans/science/embryo-concordance/')
  await page.getByLabel('显示HV2', { exact: true }).uncheck()
  for (const chart of await page.locator('.js-plotly-plot').all()) expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
  await page.goto('zh-Hans/science/embryo-to-offspring/')
  await page.getByLabel('显示排除及删失记录').check()
  for (const chart of await page.locator('.js-plotly-plot').all()) expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
  await page.goto('zh-Hans/science/pgt-mt-pgt-a-model/')
  for (const cutoff of ['≤30%', '≤18%', '18% + 30%']) {
    await page.getByRole('button', { name: cutoff, exact: true }).click()
    for (const chart of await page.locator('.js-plotly-plot').all()) expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
  }
  await page.getByTestId('model-n').fill('5')
  await page.getByTestId('model-rho').selectOption('0.2')
  await page.getByRole('checkbox', { name: es.model.showRange }).check()
  await page.getByRole('button', { name: '<', exact: true }).click()
  await page.getByRole('checkbox', { name: es.model.teOnly }).check()
  for (const chart of await page.locator('.js-plotly-plot').all()) expect(JSON.stringify(await surface(chart))).not.toMatch(FOREIGN)
})

test('Chinese educational figures stay Chinese at slider extremes, new samples, structure selection and 200%', async ({ page, browser }, info) => {
  await page.setViewportSize({ width: 1600, height: 1100 })
  const figures = [
    ['mtdna-and-maternal-inheritance', 'heteroplasmy'],
    ['heteroplasmy-and-threshold-effects', 'threshold'],
    ['mitochondrial-genetic-bottleneck', 'bottleneck'],
    ['embryo-development-and-biopsy', 'development'],
    ['embryo-development-and-biopsy', 'blastocyst'],
  ] as const
  const enlargedContext = await browser.newContext({ viewport: { width: 800, height: 550 }, deviceScaleFactor: 2, locale: 'zh-CN' })
  await stubCounter(enlargedContext)
    const enlarged = await enlargedContext.newPage()
  for (const [chapter, id] of figures) {
    await page.goto(`zh-Hans/fundamentals/${chapter}/#model-${id}`)
    const widget = page.locator(`#model-${id}`)
    await expect(widget).toBeVisible()
    if (id === 'heteroplasmy') for (const v of ['0', '75', '100']) {
      await expect(async () => {
        await widget.locator('input').fill(v)
        await expect(widget.locator('.fd-mt.mut')).toHaveCount(Number(v), { timeout: 500 })
      }).toPass()
      expect(await widget.innerText()).not.toMatch(FOREIGN)
    }
    if (id === 'bottleneck') {
      await widget.locator('input').first().fill('85')
      await widget.locator('input').nth(1).fill('6')
      await widget.getByRole('button', { name: '100', exact: true }).click()
      await expect(widget.locator('.fd-dot')).toHaveCount(100)
      await widget.getByRole('button', { name: /重新随机抽样/ }).click()
      await expect(widget.locator('.fd-summary')).toContainText('第2次抽样')
    }
    if (id === 'blastocyst') for (const name of ['滋养外胚层（TE）', '内细胞团（ICM）', '滋养外胚层活检']) {
      await widget.getByRole('button', { name, exact: true }).click()
      await expect(widget.locator('.fd-bx-detail h4')).toHaveText(name)
      expect(await widget.innerText()).not.toMatch(FOREIGN)
    }
    expect(await widget.innerText()).not.toMatch(FOREIGN)
    expect((await widget.locator('svg text').allTextContents()).join(' ')).not.toMatch(FOREIGN)
    await widget.screenshot({ ...CAPTURE, path: info.outputPath(`${id}-normal.png`) })
    await enlarged.goto(page.url())
    const enlargedWidget = enlarged.locator(`#model-${id}`)
    await expect(enlargedWidget).toBeVisible()
    await enlarged.evaluate(() => document.fonts.ready)
    expect(await enlargedWidget.innerText()).not.toMatch(FOREIGN)
    await enlargedWidget.screenshot({ ...CAPTURE, path: info.outputPath(`${id}-enlarged-200.png`) })
  }
  await enlargedContext.close()
})
