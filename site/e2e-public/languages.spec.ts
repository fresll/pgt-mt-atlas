import { expect, stubCounter, test } from '../e2e/fixtures'

const ROOTS = ['http://localhost:4174/pgt-mt-atlas/', 'http://localhost:4175/']
const PAGES = ['', 'patients/', 'about/', 'ilya-mazunin/', 'contribute/', 'science/', 'science/data/',
  'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/',
  'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/',
  'fundamentals/', 'fundamentals/mtdna-and-maternal-inheritance/',
  'fundamentals/heteroplasmy-and-threshold-effects/', 'fundamentals/mitochondrial-genetic-bottleneck/',
  'fundamentals/embryo-development-and-biopsy/', 'fundamentals/how-pgt-mt-works/',
  'fundamentals/interpretation-and-limitations/', 'fundamentals/references/']

for (const path of PAGES) {
  test(`public ${path || 'home'}: both languages render and link to the same section`, async ({ page, request }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const lang of ['ru', 'en']) {
      const other = lang === 'ru' ? 'en' : 'ru'
      const url = `${ROOTS[0]}${lang}/${path}`
      const html = await (await request.get(url)).text()
      expect(html).not.toContain('http-equiv="refresh"')
      expect(html).toContain('<meta name="robots" content="index, follow">')
      await page.goto(url)
      await expect(page).toHaveURL(url)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://fresll.github.io/pgt-mt-atlas/${lang}/${path}`)
      for (const language of ['ru', 'en']) await expect(page.locator(`head link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute('href', `https://fresll.github.io/pgt-mt-atlas/${language}/${path}`)
      const link = page.locator('header .language-switch')
      await expect(link).toHaveAccessibleName(lang === 'ru' ? 'Язык: English' : 'Language: Русский')
      await expect(link).toHaveAttribute('hreflang', other)
      expect(new URL((await link.getAttribute('href'))!, url).href).toBe(`${ROOTS[0]}${other}/${path}`)
    }
    expect(errors).toEqual([])
  })
}

for (const root of ROOTS) {
  for (const width of [320, 390, 1440]) {
    test(`${root} at ${width}px: switch retains query, anchor and works in both directions`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      const path = 'fundamentals/how-pgt-mt-works/?level=advanced#content'
      await page.goto(`${root}ru/${path}`)
      for (const lang of ['en', 'ru']) {
        const link = page.locator('header .language-switch')
        await expect(link).toBeVisible()
        const box = await link.boundingBox()
        expect(box!.height).toBeGreaterThanOrEqual(44)
        expect(box!.width).toBeGreaterThanOrEqual(44)
        await link.focus()
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(`${root}${lang}/${path}`)
        await expect(page.locator('html')).toHaveAttribute('lang', lang)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
        await page.reload()
        await expect(page).toHaveURL(`${root}${lang}/${path}`)
      }
      await page.screenshot({ path: `test-results/language-switch-${width}-${root.includes('4174') ? 'pages' : 'root'}.png` })
    })
  }

  test(`${root}: both language links work without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    await stubCounter(context)
    const page = await context.newPage()
    try {
      await page.goto(`${root}ru/science/methods/`)
      await page.locator('header .language-switch').click()
      await expect(page).toHaveURL(`${root}en/science/methods/`)
      await expect(page.locator('h1')).toHaveText('Methods and limitations')
      await page.locator('header .language-switch').click()
      await expect(page).toHaveURL(`${root}ru/science/methods/`)
      await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    } finally { await context.close() }
  })
}

for (const [path, count] of Object.entries({ 'heteroplasmy-landscape': 1, 'embryo-concordance': 3, 'embryo-to-offspring': 2, 'pgt-mt-pgt-a-model': 3 })) {
  test(`English ${path}: interactive charts load after language switching`, async ({ page }) => {
    await page.goto(`${ROOTS[0]}ru/science/${path}/`)
    await page.locator('header .language-switch').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(count, { timeout: 30_000 })
    await expect(page.locator('.chart-placeholder')).toHaveCount(0)
  })
}
