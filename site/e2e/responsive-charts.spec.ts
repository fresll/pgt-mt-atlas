import { test, expect } from '@playwright/test'
import { existsSync } from 'node:fs'

const pages = ['heteroplasmy-landscape', 'embryo-concordance', 'embryo-to-offspring', 'pgt-mt-pgt-a-model']
for (const lang of ['ru', 'en', 'es', 'zh-Hans']) {
  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    test(`${lang}: charts fit the page at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      test.skip(!existsSync(`dist/${lang}/index.html`), `${lang} is not enabled in this build`)
      await page.setViewportSize(viewport)
      for (const slug of pages) {
        await page.goto(`${lang}/science/${slug}/`)
        await expect(page.locator('.js-plotly-plot').first()).toBeVisible()
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        if (slug === 'heteroplasmy-landscape' || slug === 'embryo-concordance') {
          const chart = page.locator('.chart-viewport').first()
          const overlaps = await chart.locator('.xtick text').evaluateAll(nodes => {
            const boxes = nodes.map(n => n.getBoundingClientRect())
            return boxes.some((a, i) => boxes.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1))
          })
          expect(overlaps, `${lang} ${slug} x-axis labels`).toBe(false)
          if (await chart.evaluate(el => el.scrollWidth > el.clientWidth + 1)) {
            await expect(chart).toHaveAttribute('tabindex', '0')
            await chart.focus()
            const initial = await chart.evaluate(el => el.scrollLeft)
            await page.keyboard.press('ArrowRight')
            await expect.poll(() => chart.evaluate(el => el.scrollLeft)).toBeGreaterThan(initial)
          }
        }
      }
    })
  }
}
