import { expect, test } from './fixtures'

const slugs = ['mtdna-and-maternal-inheritance', 'heteroplasmy-and-threshold-effects', 'mitochondrial-genetic-bottleneck', 'embryo-development-and-biopsy', 'how-pgt-mt-works', 'interpretation-and-limitations']

test('all six sidebar chapter links reset Advanced and scroll to the top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.addInitScript(() => localStorage.setItem('atlas-fundamentals-level', 'advanced'))
  await page.goto(`ru/fundamentals/${slugs[4]}/`)
  for (const slug of slugs) {
    await expect(page.locator('.fd-advanced')).toBeHidden()
    await page.getByRole('button', { name: 'Углублённо', exact: true }).click()
    await expect(page.locator('.fd-advanced')).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.locator(`.fd-toc a[href$="/${slug}/"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${slug}/$`))
    await expect(page.locator('.fd-advanced')).toBeHidden()
    await expect(page.locator('.fd-essentials')).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  }
})

test('new pages open at the top while figure and source anchors stay usable', async ({ page }) => {
  await page.goto(`ru/fundamentals/${slugs[5]}/`)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.locator('footer.site').getByRole('link', { name: 'О проекте', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('О проекте')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.goto('ru/fundamentals/')
  await page.locator('a[href$="#model-bottleneck"]').click()
  await expect(page).toHaveURL(/#model-bottleneck$/)
  await expect.poll(() => page.locator('#model-bottleneck').evaluate(el => {
    const r = el.getBoundingClientRect()
    return r.top >= 0 && r.top < innerHeight
  })).toBe(true)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})

test('virtual oocyte count choices stay together at every viewport width', async ({ page }) => {
  await page.goto('ru/fundamentals/mitochondrial-genetic-bottleneck/')
  const group = page.locator('.fd-count-options')
  for (const width of [390, 600, 850, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const tops = await group.locator('button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().top))
    expect(Math.max(...tops) - Math.min(...tops), `width ${width}`).toBeLessThan(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0)
  }
})

test('landscape bands show 0–18, 18–30 and 30–100 and the reset button restores a zoomed chart', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('ru/science/heteroplasmy-landscape/')
  const frame = page.locator('.chart-frame').first()
  const plot = frame.locator('.js-plotly-plot')
  await expect(plot).toBeVisible()
  const ranges = await plot.evaluate((el: any) => el.layout.shapes.filter((s: any) => s.type === 'rect').map((s: any) => [s.y0, s.y1, s.fillcolor]))
  expect(ranges.map((r: unknown[]) => r.slice(0, 2))).toEqual([[0, 18], [18, 30], [30, 100]])
  expect(new Set(ranges.map((r: unknown[]) => r[2])).size).toBe(3)
  const initial = await plot.evaluate((el: any) => [...el._fullLayout.yaxis.range])
  await plot.scrollIntoViewIfNeeded()
  const box = await frame.locator('.nsewdrag').first().boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move(box!.x + 40, box!.y + box!.height * 0.3)
  await page.mouse.down()
  await page.mouse.move(box!.x + 120, box!.y + box!.height * 0.7, { steps: 8 })
  await page.mouse.up()
  await expect.poll(() => plot.evaluate((el: any) => el._fullLayout.yaxis.range[1])).toBeLessThan(initial[1])
  await frame.getByRole('button', { name: 'Вернуться к исходному варианту', exact: true }).click()
  await expect.poll(() => plot.evaluate((el: any) => [...el._fullLayout.yaxis.range])).toEqual(initial)
})
