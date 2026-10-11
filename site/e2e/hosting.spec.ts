import { expect, test, type Page } from '@playwright/test'

// Собранный сайт в условиях реального размещения (раунд 1 рецензии):
// фото, SVG и все четыре графика при прямом входе, без завершающего слеша, после перезагрузки,
// при навигации и смене языка; GitHub Pages (/pgt-mt-atlas/) и другой путь размещения (корень сервера).
const HOSTS = {
  'GitHub Pages /pgt-mt-atlas/': 'http://localhost:4174/pgt-mt-atlas/',
  'other hosting path /': 'http://localhost:4175/',
}
const CHARTS: Record<string, number> = { 'science/heteroplasmy-landscape/': 1, 'science/embryo-concordance/': 3, 'science/embryo-to-offspring/': 2, 'science/pgt-mt-pgt-a-model/': 3 }

function watch(page: Page) {
  const problems: string[] = []
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()} ${r.url()}`))
  return problems
}

async function expectPhoto(page: Page, selector: string) {
  const img = page.locator(selector).first()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
}

async function expectIllustration(page: Page) {
  const svg = page.locator('.sk-illustration svg').first()
  await expect(svg).toBeVisible()
  const box = await svg.boundingBox()
  expect(box && box.width > 0 && box.height > 0).toBeTruthy()
}

for (const [host, root] of Object.entries(HOSTS)) {
  for (const lang of ['en', 'ru']) {
    test(`${host} ${lang}: photos, illustrations and all four charts load on direct entry`, async ({ page }) => {
      const problems = watch(page)
      await page.goto(`${root}${lang}/`)
      await expectPhoto(page, '.sk-home img')
      await expectIllustration(page)
      await page.goto(`${root}${lang}/ilya-mazunin/`)
      await expectPhoto(page, 'img.portrait')
      for (const [p, n] of Object.entries(CHARTS)) {
        await page.goto(`${root}${lang}/${p}`)
        await expect(page.locator('.chart-frame .js-plotly-plot'), p).toHaveCount(n, { timeout: 20_000 })
        await expect(page.locator('.chart-placeholder')).toHaveCount(0)
        await expectIllustration(page)
      }
      expect(problems).toEqual([])
    })
  }
}

test('direct entry without a trailing slash: same page, no hydration error (React #418)', async ({ page }) => {
  for (const root of ['http://localhost:4174/pgt-mt-atlas/', 'http://localhost:4173/pgt-mt-atlas/']) {
    for (const p of ['ru/about', 'en/science/heteroplasmy-landscape', 'ru/fundamentals/how-pgt-mt-works', 'en/ilya-mazunin']) {
      const problems = watch(page)
      await page.goto(`${root}${p}?q=1#content`)
      await expect(page).toHaveURL(`${root}${p}/?q=1#content`)
      await expect(page.locator('h1').first()).toBeVisible()
      await page.waitForLoadState('networkidle')
      expect(problems, `${root}${p}`).toEqual([])
      page.removeAllListeners('pageerror')
      page.removeAllListeners('console')
      page.removeAllListeners('response')
    }
  }
})

test('static language links end with a slash and keep the page', async ({ request }) => {
  const html = await (await request.get('http://localhost:4174/pgt-mt-atlas/en/science/embryo-concordance/')).text()
  const link = html.match(/<a class="btn-link"[^>]*\shref="([^"]+)"/)?.[1]
  expect(link).toBe('../../../ru/science/embryo-concordance/')
})

test('user path: home → science → chart → language → reload → back → curator → email', async ({ page }) => {
  const root = 'http://localhost:4174/pgt-mt-atlas/'
  const problems = watch(page)
  await page.goto(`${root}ru/`)
  await page.locator('nav.primary').getByRole('link', { name: 'Для специалистов' }).click()
  await page.locator('nav.side a[href$="heteroplasmy-landscape/"]').click()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(1, { timeout: 20_000 })
  // взаимодействие: режим исследования и пользовательская граница пересчитывают график
  await page.locator('.controls .seg button', { hasText: 'Исследовать' }).click()
  await page.locator('.controls input[type=number]').fill('25')
  await expect(page.locator('.chart-frame')).toContainText('25')
  // смена языка сохраняет раздел и hash
  await page.evaluate(() => history.replaceState(null, '', `${location.pathname}#content`))
  await page.locator('nav.side a[href$="embryo-concordance/"]').click()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(`${root}en/science/embryo-concordance/`)
  await expect(page.locator('h1')).toHaveText('Embryo Concordance')
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.reload()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.goBack()
  await expect(page).toHaveURL(/\/ru\/science\/embryo-concordance\/$/)
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.goBack()
  await expect(page).toHaveURL(/\/ru\/science\/heteroplasmy-landscape\//)
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(1, { timeout: 20_000 })
  await page.locator('nav.primary a[href$="ilya-mazunin/"]').click()
  await expectPhoto(page, 'img.portrait')
  const mail = page.locator('#profiles a[href^="mailto:"]')
  await expect(mail).toHaveAttribute('href', 'mailto:ilya.mazunin@gmail.com')
  await expect(page.locator('#profiles .email-address')).toHaveText('ilya.mazunin@gmail.com')
  expect(problems).toEqual([])
})

test('language switch keeps query and hash after hydration', async ({ page }) => {
  await page.goto('http://localhost:4174/pgt-mt-atlas/en/fundamentals/how-pgt-mt-works/?x=1#model-blastocyst')
  await expect(page.getByRole('link', { name: 'Русский' })).toHaveAttribute('href', /\/ru\/fundamentals\/how-pgt-mt-works\/\?x=1#model-blastocyst$/)
})

test('pages fit phone and wide screens with visible photo and chart', async ({ page }) => {
  for (const width of [390, 820, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    for (const p of ['ru/', 'en/ilya-mazunin/', 'ru/science/heteroplasmy-landscape/', 'en/science/pgt-mt-pgt-a-model/']) {
      await page.goto(`http://localhost:4174/pgt-mt-atlas/${p}`)
      if (p.includes('science')) await expect(page.locator('.chart-frame .js-plotly-plot').first()).toBeVisible({ timeout: 20_000 })
      else await expectPhoto(page, p.includes('ilya') ? 'img.portrait' : '.sk-home img')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${width} ${p}`).toBeLessThanOrEqual(0)
    }
  }
})
